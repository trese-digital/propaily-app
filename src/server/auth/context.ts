/**
 * Resuelve el contexto del usuario autenticado: su `User` en Prisma, el
 * `Membership` activo (define la ManagementCompany) y — desde S2 — el alcance
 * de acceso.
 *
 * Dos tipos de usuario sobre la misma DB (decisión S2 "ambos portales"):
 *  - **Operador GF** (`accessScope: "gf"`) — `Membership.clientId` es null.
 *    Ve toda la ManagementCompany. RLS scopea sólo por `managementCompanyId`.
 *  - **Portal family office** (`accessScope: "client"`) — `Membership.clientId`
 *    apunta a un Client. El usuario ve SÓLO ese Client. RLS añade el filtro
 *    `app.client_id` sobre el de la MC.
 *
 * Por ahora un usuario tiene UN membership; cuando se introduzcan organizaciones
 * múltiples, este helper recibirá el ID de la org actual desde URL/cookie.
 */
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ensureUserSynced } from "@/server/auth/sync-user";
import { dbBypass } from "@/server/db/scoped";

export type AccessScope = "gf" | "client";

export type AppContext = {
  user: { id: string; email: string; name: string | null };
  membership: {
    id: string;
    role: string;
    managementCompanyId: string;
    managementCompanyName: string;
  };
  /** "gf" = operador (toda la MC) · "client" = portal family office (un Client). */
  accessScope: AccessScope;
  /** El Client al que está acotado el usuario, o null si es operador GF. */
  client: { id: string; name: string } | null;
};

/**
 * Deriva el scope de RLS de un `AppContext`, listo para `withAppScope`:
 * la MC siempre, el Client sólo si el usuario es family office.
 */
export function appScope(ctx: AppContext): {
  managementCompanyId: string;
  clientId: string | null;
} {
  return {
    managementCompanyId: ctx.membership.managementCompanyId,
    clientId: ctx.client?.id ?? null,
  };
}

export async function requireContext(): Promise<AppContext> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const dbUser = await ensureUserSynced(
    authUser.id,
    authUser.email ?? "",
    (authUser.user_metadata?.name as string | undefined) ?? null,
  );

  // Membership es pre-tenant: se resuelve antes de saber qué MC/Client settear
  // para RLS. Por eso usa `dbBypass`. El filtro por userId viene de la sesión
  // Supabase ya verificada.
  const m = await dbBypass.membership.findFirst({
    where: { userId: dbUser.id, status: "active" },
    include: { managementCompany: true, client: true },
  });
  if (!m) {
    // Sin membership: por ahora deja pasar a `/`. Más adelante: pantalla
    // "Sin acceso a ninguna empresa".
    redirect("/");
  }

  const scopedToClient = m.clientId != null && m.client != null;

  return {
    user: { id: dbUser.id, email: dbUser.email, name: dbUser.name },
    membership: {
      id: m.id,
      role: m.role,
      managementCompanyId: m.managementCompanyId,
      managementCompanyName: m.managementCompany.name,
    },
    accessScope: scopedToClient ? "client" : "gf",
    client: scopedToClient ? { id: m.client!.id, name: m.client!.name } : null,
  };
}
