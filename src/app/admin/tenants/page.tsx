import Link from "next/link";

import { Badge, type BadgeTone } from "@/components/ui";
import { dbBypass } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { logAdminAccess } from "@/server/audit/log";

const PLAN_LABEL: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
  enterprise: "Enterprise",
  custom: "Custom",
};

const SUB_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: "Activa", tone: "ok" },
  paused: { label: "Pausada", tone: "warn" },
  past_due: { label: "Vencida", tone: "bad" },
  cancelled: { label: "Cancelada", tone: "neutral" },
};

const ADDON_LABEL: Array<{
  key: "cartografiaEnabled" | "insightsEnabled" | "calculadorasEnabled";
  short: string;
}> = [
  { key: "cartografiaEnabled", short: "Cartografía" },
  { key: "insightsEnabled", short: "Insights" },
  { key: "calculadorasEnabled", short: "Calculadoras" },
];

export default async function AdminTenantsPage() {
  const ctx = await requireContext();

  const tenants = await dbBypass.managementCompany.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      subscription: true,
      _count: {
        select: {
          clients: { where: { deletedAt: null } },
          memberships: { where: { status: "active" } },
        },
      },
    },
  });

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "list",
    entityType: "ManagementCompany",
    metadata: { route: "/admin/tenants", count: tenants.length },
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF · vista cross-tenant
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Cuentas y suscripciones
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {tenants.length} cuenta{tenants.length === 1 ? "" : "s"}. Plan, estado y addons
          se administran por cuenta.
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
            <tr>
              {["Cuenta", "Plan", "Estado", "Addons", "Clientes", "Usuarios"].map((h) => (
                <th
                  key={h}
                  className="border-b border-[var(--border)] px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.04em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => {
              const sub = t.subscription;
              const st = sub ? SUB_STATUS[sub.status] ?? SUB_STATUS.active : null;
              const addons = sub ? ADDON_LABEL.filter((a) => sub[a.key]) : [];
              return (
                <tr key={t.id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-3.5 py-3">
                    <Link
                      href={`/admin/tenants/${t.id}` as never}
                      className="font-medium text-[var(--fg)] hover:text-[var(--color-pp-700)]"
                    >
                      {t.name}
                    </Link>
                    {t.isPlatformOperator && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
                        operador
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-3">
                    {sub ? (
                      PLAN_LABEL[sub.plan] ?? sub.plan
                    ) : (
                      <span className="text-[var(--fg-subtle)]">—</span>
                    )}
                  </td>
                  <td className="px-3.5 py-3">
                    {st ? (
                      <Badge tone={st.tone}>{st.label}</Badge>
                    ) : (
                      <Badge tone="neutral">Sin suscripción</Badge>
                    )}
                  </td>
                  <td className="px-3.5 py-3">
                    {addons.length > 0 ? (
                      <span className="flex flex-wrap gap-1">
                        {addons.map((a) => (
                          <span
                            key={a.key}
                            className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[11px] text-[var(--color-pp-700)]"
                          >
                            {a.short}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-[var(--fg-subtle)]">—</span>
                    )}
                  </td>
                  <td className="px-3.5 py-3 tabular-nums">{t._count.clients}</td>
                  <td className="px-3.5 py-3 tabular-nums">{t._count.memberships}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
