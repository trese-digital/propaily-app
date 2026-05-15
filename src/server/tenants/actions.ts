"use server";

import { revalidatePath } from "next/cache";
import type {
  Prisma,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { dbBypass } from "@/server/db/scoped";
import { logAdminAccess } from "@/server/audit/log";

/**
 * Backoffice GF — gestión de cuentas (tenants) y suscripciones (S7).
 *
 * Todo es cross-tenant: se exige rol staff GF (`isGfStaff`), se usa `dbBypass`
 * (la tabla `Subscription` está bloqueada por RLS para el rol de la app) y
 * cada cambio se registra en `AuditLog`.
 *
 * MVP sin Stripe: el plan, el estado y los addons son toggles manuales.
 */

const PLANS: readonly string[] = [
  "starter",
  "growth",
  "pro",
  "enterprise",
  "custom",
];
const STATUSES: readonly string[] = ["active", "paused", "past_due", "cancelled"];
const ADDONS: readonly string[] = ["cartografia", "insights", "calculadoras"];

type Result = { ok?: boolean; error?: string };

/** Exige sesión + rol staff GF. Lanza si no lo es. */
async function requireGfStaff() {
  const ctx = await requireContext();
  if (!(await isGfStaff(ctx.user.id))) {
    throw new Error("Acción restringida al staff de GF.");
  }
  return ctx;
}

/** Crea una Subscription `starter`/`active` para una cuenta que no tiene. */
export async function crearSuscripcion(
  managementCompanyId: string,
): Promise<Result> {
  const ctx = await requireGfStaff();

  const mc = await dbBypass.managementCompany.findUnique({
    where: { id: managementCompanyId },
    select: { id: true },
  });
  if (!mc) return { error: "Cuenta no encontrada." };

  const existing = await dbBypass.subscription.findUnique({
    where: { managementCompanyId },
    select: { id: true },
  });
  if (existing) return { error: "La cuenta ya tiene suscripción." };

  await dbBypass.subscription.create({
    data: { managementCompanyId, plan: "starter", status: "active" },
  });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "create",
    entityType: "Subscription",
    entityId: managementCompanyId,
    managementCompanyId,
    metadata: { plan: "starter" },
  });

  revalidatePath(`/admin/tenants/${managementCompanyId}`);
  revalidatePath("/admin/tenants");
  return { ok: true };
}

/** Cambia el plan de la suscripción de una cuenta. */
export async function cambiarPlan(
  managementCompanyId: string,
  plan: string,
): Promise<Result> {
  const ctx = await requireGfStaff();
  if (!PLANS.includes(plan)) return { error: "Plan inválido." };

  const sub = await dbBypass.subscription.findUnique({
    where: { managementCompanyId },
    select: { plan: true },
  });
  if (!sub) return { error: "La cuenta no tiene suscripción." };

  await dbBypass.subscription.update({
    where: { managementCompanyId },
    data: { plan: plan as SubscriptionPlan },
  });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "update",
    entityType: "Subscription",
    entityId: managementCompanyId,
    managementCompanyId,
    metadata: { field: "plan", from: sub.plan, to: plan },
  });

  revalidatePath(`/admin/tenants/${managementCompanyId}`);
  revalidatePath("/admin/tenants");
  return { ok: true };
}

/** Cambia el estado de la suscripción (active/paused/past_due/cancelled). */
export async function cambiarEstadoSuscripcion(
  managementCompanyId: string,
  status: string,
): Promise<Result> {
  const ctx = await requireGfStaff();
  if (!STATUSES.includes(status)) return { error: "Estado inválido." };

  const sub = await dbBypass.subscription.findUnique({
    where: { managementCompanyId },
    select: { status: true },
  });
  if (!sub) return { error: "La cuenta no tiene suscripción." };

  await dbBypass.subscription.update({
    where: { managementCompanyId },
    data: { status: status as SubscriptionStatus },
  });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "update",
    entityType: "Subscription",
    entityId: managementCompanyId,
    managementCompanyId,
    metadata: { field: "status", from: sub.status, to: status },
  });

  revalidatePath(`/admin/tenants/${managementCompanyId}`);
  revalidatePath("/admin/tenants");
  return { ok: true };
}

/** Enciende/apaga un addon (cartografia | insights | calculadoras). */
export async function toggleAddon(
  managementCompanyId: string,
  addon: string,
  enabled: boolean,
): Promise<Result> {
  const ctx = await requireGfStaff();
  if (!ADDONS.includes(addon)) return { error: "Addon inválido." };

  const sub = await dbBypass.subscription.findUnique({
    where: { managementCompanyId },
    select: { id: true },
  });
  if (!sub) return { error: "La cuenta no tiene suscripción." };

  // Clave explícita por addon — evita el ensanchamiento de tipo de una
  // clave computada en el `data` de Prisma.
  const data: Prisma.SubscriptionUpdateInput =
    addon === "cartografia"
      ? { cartografiaEnabled: enabled }
      : addon === "insights"
        ? { insightsEnabled: enabled }
        : { calculadorasEnabled: enabled };

  await dbBypass.subscription.update({ where: { managementCompanyId }, data });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "update",
    entityType: "Subscription",
    entityId: managementCompanyId,
    managementCompanyId,
    metadata: { addon, enabled },
  });

  revalidatePath(`/admin/tenants/${managementCompanyId}`);
  return { ok: true };
}
