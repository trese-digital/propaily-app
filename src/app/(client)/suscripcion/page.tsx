import {
  IcCalc,
  IcCard,
  IcCheck,
  IcLayers,
  IcMap,
  IcX,
} from "@/components/icons";
import { Badge, type BadgeTone, Card, CardHeader, EmptyState } from "@/components/ui";
import { requireContext } from "@/server/auth/context";
import {
  getSubscriptionSummary,
  PLAN_META,
  type PlanTier,
} from "@/server/billing/subscription";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: "Activa", tone: "ok" },
  paused: { label: "Pausada", tone: "warn" },
  past_due: { label: "Pago pendiente", tone: "bad" },
  cancelled: { label: "Cancelada", tone: "neutral" },
};

const PLAN_ORDER: PlanTier[] = ["starter", "growth", "pro", "enterprise"];

const ADDON_META = [
  { key: "cartografia", label: "Cartografía", icon: IcMap, desc: "Visor catastral de León con PostGIS." },
  { key: "insights", label: "Insights", icon: IcLayers, desc: "Analítica de rendimiento del portafolio." },
  { key: "calculadoras", label: "Calculadoras fiscales", icon: IcCalc, desc: "ISAI, ISR, predial y plusvalía." },
] as const;

function planRangeLabel(tier: PlanTier): string {
  const m = PLAN_META[tier];
  if (m.max == null) return `${m.min}+ propiedades`;
  return `${m.min}–${m.max} propiedades`;
}

export default async function SuscripcionPage() {
  const ctx = await requireContext();
  const sub = await getSubscriptionSummary(ctx.membership.managementCompanyId);

  if (!sub) {
    return (
      <section className="mx-auto flex max-w-[860px] flex-col gap-6 px-8 py-7">
        <header>
          <span className="mono-label">Cuenta · plan y módulos</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Suscripción
          </h1>
        </header>
        <EmptyState
          icon={IcCard}
          title="Sin suscripción registrada"
          description="Tu cuenta aún no tiene un plan asignado. Contacta a tu operador de GF Consultoría para activarlo."
        />
      </section>
    );
  }

  const planMeta = PLAN_META[sub.plan];
  const status = STATUS_META[sub.status] ?? STATUS_META.active;
  const limit = planMeta.max;
  const usagePct =
    limit != null
      ? Math.min(100, Math.round((sub.propertyCount / limit) * 100))
      : null;
  const overLimit = limit != null && sub.propertyCount > limit;

  return (
    <section className="mx-auto flex max-w-[860px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Cuenta · plan y módulos</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Suscripción
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {ctx.membership.managementCompanyName} · plan administrado por GF.
          </p>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </header>

      {/* Plan actual + uso */}
      <Card className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="mono-label">Plan actual</span>
            <div className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink-900">
              {planMeta.label}
            </div>
            <p className="mt-0.5 text-[13px] text-ink-500">
              {planRangeLabel(sub.plan)}
            </p>
          </div>
          <div className="text-right">
            <span className="mono-label">Vigente desde</span>
            <div className="mono mt-1 text-[13px] text-ink-700">
              {dateFmt.format(sub.startDate)}
            </div>
            {sub.endDate && (
              <div className="mono text-[11px] text-ink-400">
                hasta {dateFmt.format(sub.endDate)}
              </div>
            )}
          </div>
        </div>

        {/* Uso de propiedades */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-ink-800">
              Propiedades en uso
            </span>
            <span className="mono num text-[13px] text-ink-700">
              {sub.propertyCount}
              {limit != null ? ` / ${limit}` : ""}
            </span>
          </div>
          {usagePct != null ? (
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className={`h-full rounded-full ${overLimit ? "bg-bad" : "bg-pp-500"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          ) : (
            <div className="h-2 rounded-full bg-pp-100" />
          )}
          {overLimit && (
            <p className="text-[12px] text-bad">
              Superaste el límite del plan. Contacta a GF para ampliarlo.
            </p>
          )}
        </div>
      </Card>

      {/* Tiers */}
      <Card>
        <CardHeader title="Paquetes" />
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_ORDER.map((tier) => {
            const m = PLAN_META[tier];
            const current = tier === sub.plan;
            return (
              <div
                key={tier}
                className={`flex flex-col gap-1 rounded-lg border p-3.5 ${
                  current
                    ? "border-pp-300 bg-pp-50"
                    : "border-ink-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-ink-900">
                    {m.label}
                  </span>
                  {current && <Badge tone="violet">Actual</Badge>}
                </div>
                <span className="mono text-[11px] text-ink-500">
                  {planRangeLabel(tier)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Addons */}
      <Card>
        <CardHeader title="Módulos plus" />
        <ul className="divide-y divide-ink-100">
          {ADDON_META.map((a) => {
            const on = sub.addons[a.key];
            const Icon = a.icon;
            return (
              <li key={a.key} className="flex items-center gap-3 px-4 py-3.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    on ? "bg-pp-100 text-pp-700" : "bg-[var(--bg-muted)] text-ink-400"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink-900">
                    {a.label}
                  </div>
                  <p className="text-[12px] text-ink-500">{a.desc}</p>
                </div>
                {on ? (
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-ok">
                    <IcCheck size={14} /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[12px] text-ink-400">
                    <IcX size={14} /> Inactivo
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <p className="rounded-lg border border-ink-100 bg-[var(--bg-muted)] px-4 py-3 text-[12px] leading-relaxed text-ink-600">
        Tu plan y los módulos plus los administra el equipo de GF Consultoría.
        Para cambiar de paquete o activar un módulo, contacta a tu operador GF.
      </p>
    </section>
  );
}
