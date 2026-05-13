/**
 * Gating de addons (Cartografía, Insights, Calculadoras).
 *
 * Regla AGENTS.md §17: los toggles de addons se verifican EN EL SERVER.
 * Un cliente puede llamar un endpoint de Cartografía aunque su UI no lo
 * muestre — el endpoint debe rechazar si `subscription.addons.cartografia === false`.
 *
 * Fail-closed: sin Subscription, sin status active, o endDate pasada → false.
 */
// Subscription está bloqueada por RLS para `propaily_app` (policy USING(false)).
// Sólo `dbBypass` puede leerla.
import { dbBypass } from "@/server/db/scoped";

export type Addon = "cartografia" | "insights" | "calculadoras";

export type AddonState = Record<Addon, boolean>;

const NONE: AddonState = {
  cartografia: false,
  insights: false,
  calculadoras: false,
};

export async function getEnabledAddons(managementCompanyId: string): Promise<AddonState> {
  const sub = await dbBypass.subscription.findUnique({
    where: { managementCompanyId },
    select: {
      cartografiaEnabled: true,
      insightsEnabled: true,
      calculadorasEnabled: true,
      status: true,
      endDate: true,
    },
  });
  if (!sub) return NONE;
  if (sub.status !== "active") return NONE;
  if (sub.endDate && sub.endDate < new Date()) return NONE;

  return {
    cartografia: sub.cartografiaEnabled,
    insights: sub.insightsEnabled,
    calculadoras: sub.calculadorasEnabled,
  };
}

export async function hasAddon(
  managementCompanyId: string,
  addon: Addon,
): Promise<boolean> {
  const state = await getEnabledAddons(managementCompanyId);
  return state[addon];
}
