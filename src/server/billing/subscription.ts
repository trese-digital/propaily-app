/**
 * Resumen de la suscripción de una ManagementCompany para la pantalla
 * `/suscripcion` (vista de sólo lectura — sin Stripe).
 *
 * Subscription está bloqueada por RLS para `propaily_app` (policy USING(false)),
 * igual que en `has-addon.ts`: sólo `dbBypass` puede leerla.
 */
import { dbBypass } from "@/server/db/scoped";

export type PlanTier = "starter" | "growth" | "pro" | "enterprise" | "custom";

/** Tiers de paquete por número de propiedades (ver AGENTS.md §1). */
export const PLAN_META: Record<
  PlanTier,
  { label: string; min: number; max: number | null }
> = {
  starter: { label: "Starter", min: 0, max: 5 },
  growth: { label: "Growth", min: 5, max: 10 },
  pro: { label: "Pro", min: 10, max: 20 },
  enterprise: { label: "Enterprise", min: 20, max: null },
  custom: { label: "A la medida", min: 0, max: null },
};

export type SubscriptionSummary = {
  plan: PlanTier;
  status: string;
  addons: { cartografia: boolean; insights: boolean; calculadoras: boolean };
  startDate: Date;
  endDate: Date | null;
  source: string;
  notes: string | null;
  propertyCount: number;
};

export async function getSubscriptionSummary(
  managementCompanyId: string,
): Promise<SubscriptionSummary | null> {
  const [sub, propertyCount] = await Promise.all([
    dbBypass.subscription.findUnique({
      where: { managementCompanyId },
      select: {
        plan: true,
        status: true,
        cartografiaEnabled: true,
        insightsEnabled: true,
        calculadorasEnabled: true,
        startDate: true,
        endDate: true,
        source: true,
        notes: true,
      },
    }),
    dbBypass.property.count({
      where: {
        deletedAt: null,
        portfolio: { client: { managementCompanyId } },
      },
    }),
  ]);
  if (!sub) return null;

  return {
    plan: sub.plan,
    status: sub.status,
    addons: {
      cartografia: sub.cartografiaEnabled,
      insights: sub.insightsEnabled,
      calculadoras: sub.calculadorasEnabled,
    },
    startDate: sub.startDate,
    endDate: sub.endDate,
    source: sub.source,
    notes: sub.notes,
    propertyCount,
  };
}
