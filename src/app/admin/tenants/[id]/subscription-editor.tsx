"use client";

import { useState, useTransition } from "react";

import { Button, Select, Toggle } from "@/components/ui";
import {
  cambiarEstadoSuscripcion,
  cambiarPlan,
  crearSuscripcion,
  toggleAddon,
} from "@/server/tenants/actions";

const PLANS: Array<[string, string]> = [
  ["starter", "Starter · 0–5 propiedades"],
  ["growth", "Growth · 5–10"],
  ["pro", "Pro · 10–20"],
  ["enterprise", "Enterprise · 20+"],
  ["custom", "Custom"],
];

const STATUSES: Array<[string, string]> = [
  ["active", "Activa"],
  ["paused", "Pausada"],
  ["past_due", "Vencida"],
  ["cancelled", "Cancelada"],
];

const ADDONS: Array<{ key: "cartografia" | "insights" | "calculadoras"; label: string; desc: string }> = [
  { key: "cartografia", label: "Cartografía", desc: "Visor catastral con PostGIS" },
  { key: "insights", label: "Insights", desc: "Analítica de portafolio" },
  { key: "calculadoras", label: "Calculadoras", desc: "ISAI, ISR, predial, plusvalía" },
];

export type SubscriptionState = {
  plan: string;
  status: string;
  cartografiaEnabled: boolean;
  insightsEnabled: boolean;
  calculadorasEnabled: boolean;
};

export function SubscriptionEditor({
  managementCompanyId,
  subscription,
}: {
  managementCompanyId: string;
  subscription: SubscriptionState | null;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok?: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (r?.error) setError(r.error);
    });
  }

  if (!subscription) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center">
        <h3 className="text-base font-semibold">Sin suscripción</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--fg-muted)]">
          Esta cuenta no tiene suscripción. Créala para asignarle un plan y addons.
        </p>
        <div className="mt-4">
          <Button
            size="md"
            disabled={pending}
            onClick={() => run(() => crearSuscripcion(managementCompanyId))}
          >
            {pending ? "Creando…" : "Crear suscripción"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-bad">{error}</p>}
      </div>
    );
  }

  const addonValue = (key: string): boolean =>
    key === "cartografia"
      ? subscription.cartografiaEnabled
      : key === "insights"
        ? subscription.insightsEnabled
        : subscription.calculadorasEnabled;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Plan</span>
          <Select
            defaultValue={subscription.plan}
            disabled={pending}
            onChange={(e) => run(() => cambiarPlan(managementCompanyId, e.target.value))}
          >
            {PLANS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Estado</span>
          <Select
            defaultValue={subscription.status}
            disabled={pending}
            onChange={(e) =>
              run(() => cambiarEstadoSuscripcion(managementCompanyId, e.target.value))
            }
          >
            {STATUSES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div>
        <span className="text-xs font-medium text-[var(--fg-muted)]">Addons</span>
        <div className="mt-2 flex flex-col divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
          {ADDONS.map((a) => (
            <div key={a.key} className="flex items-center gap-3 px-3.5 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[var(--fg)]">{a.label}</div>
                <div className="text-xs text-[var(--fg-muted)]">{a.desc}</div>
              </div>
              <Toggle
                checked={addonValue(a.key)}
                disabled={pending}
                label={a.label}
                onChange={(next) =>
                  run(() => toggleAddon(managementCompanyId, a.key, next))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm font-medium text-bad">{error}</p>}
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
        Cada cambio se registra en AuditLog
      </p>
    </div>
  );
}
