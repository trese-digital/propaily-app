"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@prisma/client";

import { appScope, requireContext, type AppContext } from "@/server/auth/context";
import { can } from "@/server/auth/can";
import { dbBypass, withAppScope } from "@/server/db/scoped";
import { APP_ORIGIN } from "@/lib/domains";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Gestión de usuarios (S6).
 *
 * Un administrador (owner del family office, o staff GF) invita y administra a
 * los usuarios de su alcance:
 *  - **family office** (`accessScope: "client"`) → invita dentro de su Client;
 *    roles asignables: `owner` (co-administrador) y `guest` (sólo lectura).
 *  - **operador GF** (`accessScope: "gf"`) → invita operadores de la MC;
 *    roles asignables: `company_admin` y `company_operator`.
 *
 * La invitación es real: `inviteUserByEmail` crea el usuario en Supabase Auth
 * y le envía el enlace de acceso. El `User.id` de Prisma = UID de Supabase.
 * RLS (`membership_isolation`, S2b) garantiza que un family office sólo cree
 * memberships de su propio Client.
 */

const CLIENT_ROLES = ["owner", "guest"] as const;
const GF_ROLES = ["company_admin", "company_operator"] as const;

/** Roles que el contexto actual puede asignar. */
function assignableRoles(ctx: AppContext): readonly Role[] {
  return ctx.accessScope === "gf" ? GF_ROLES : CLIENT_ROLES;
}

const InviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  name: z.string().trim().min(1, "Nombre requerido"),
  role: z.enum(["owner", "guest", "company_admin", "company_operator"]),
});

export type InviteFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function invitarUsuario(
  _prev: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  const ctx = await requireContext();
  if (!can(ctx, "user.manage")) {
    return { error: "No tienes permiso para invitar usuarios." };
  }

  const parsed = InviteSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = i.path.join(".");
      if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }
  const { email, name, role } = parsed.data;

  if (!assignableRoles(ctx).includes(role)) {
    return { error: "Ese rol no se puede asignar desde aquí.", fieldErrors: { role: "Rol no permitido" } };
  }

  const mcId = ctx.membership.managementCompanyId;

  // Invitación real en Supabase Auth — crea el auth user y envía el correo.
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name },
    // El enlace del correo debe volver al portal, no a la raíz de marketing.
    // `/auth/callback` intercambia el code por sesión.
    redirectTo: `${APP_ORIGIN}/auth/callback`,
  });
  if (error || !data?.user) {
    const msg = error?.message ?? "";
    if (/already|registered|exists/i.test(msg)) {
      return {
        error:
          "Ese correo ya tiene una cuenta en Propaily. Pide al equipo de GF que lo vincule a esta cuenta.",
        fieldErrors: { email: "Correo ya registrado" },
      };
    }
    return { error: "No se pudo enviar la invitación. Intenta de nuevo." };
  }
  const authUserId = data.user.id;

  // Espejo del usuario en el modelo de negocio. status `invited` hasta el
  // primer login (lo promueve `ensureUserSynced`).
  await dbBypass.user.upsert({
    where: { id: authUserId },
    update: { email, name },
    create: { id: authUserId, email, name, status: "invited" },
  });

  // Un usuario = un membership por MC.
  const existing = await dbBypass.membership.findUnique({
    where: {
      userId_managementCompanyId: { userId: authUserId, managementCompanyId: mcId },
    },
    select: { id: true },
  });
  if (existing) {
    return { error: "Ese usuario ya pertenece a esta cuenta." };
  }

  await withAppScope(appScope(ctx), (tx) =>
    tx.membership.create({
      data: {
        userId: authUserId,
        managementCompanyId: mcId,
        clientId: ctx.client?.id ?? null,
        role,
        status: "active",
      },
    }),
  );

  revalidatePath("/usuarios");
  return { ok: true };
}

/** Cambia el rol de un miembro. No permite cambiar el propio. */
export async function cambiarRol(
  membershipId: string,
  role: Role,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  if (!can(ctx, "user.manage")) {
    return { error: "No tienes permiso para cambiar roles." };
  }
  if (!assignableRoles(ctx).includes(role)) {
    return { error: "Ese rol no se puede asignar desde aquí." };
  }

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const m = await tx.membership.findFirst({
      where: { id: membershipId },
      select: { id: true, userId: true },
    });
    if (!m) return { error: "Usuario no encontrado" } as const;
    if (m.userId === ctx.user.id) {
      return { error: "No puedes cambiar tu propio rol." } as const;
    }
    await tx.membership.update({ where: { id: m.id }, data: { role } });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/usuarios");
  return { ok: true };
}

/** Suspende o reactiva el acceso de un miembro. No permite suspenderse a sí mismo. */
export async function cambiarEstadoUsuario(
  membershipId: string,
  suspend: boolean,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  if (!can(ctx, "user.manage")) {
    return { error: "No tienes permiso para administrar usuarios." };
  }

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const m = await tx.membership.findFirst({
      where: { id: membershipId },
      select: { id: true, userId: true },
    });
    if (!m) return { error: "Usuario no encontrado" } as const;
    if (m.userId === ctx.user.id) {
      return { error: "No puedes cambiar tu propio acceso." } as const;
    }
    await tx.membership.update({
      where: { id: m.id },
      data: { status: suspend ? "suspended" : "active" },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/usuarios");
  return { ok: true };
}
