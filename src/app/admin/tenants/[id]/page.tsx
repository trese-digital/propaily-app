import Link from "next/link";
import { notFound } from "next/navigation";

import { dbBypass } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { logAdminAccess } from "@/server/audit/log";
import { SubscriptionEditor, type SubscriptionState } from "./subscription-editor";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireContext();
  const { id } = await params;

  const mc = await dbBypass.managementCompany.findUnique({
    where: { id },
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
  if (!mc || mc.deletedAt) notFound();

  const propertyCount = await dbBypass.property.count({
    where: {
      deletedAt: null,
      portfolio: { client: { managementCompanyId: id } },
    },
  });

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "view",
    entityType: "ManagementCompany",
    entityId: id,
    managementCompanyId: id,
    metadata: { route: "/admin/tenants/[id]" },
  });

  const sub = mc.subscription;
  const subState: SubscriptionState | null = sub
    ? {
        plan: sub.plan,
        status: sub.status,
        cartografiaEnabled: sub.cartografiaEnabled,
        insightsEnabled: sub.insightsEnabled,
        calculadorasEnabled: sub.calculadorasEnabled,
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        <Link href={"/admin/tenants" as never} className="hover:text-[var(--color-pp-700)]">
          ← Cuentas
        </Link>
      </p>

      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Cuenta · ManagementCompany
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {mc.name}
        </h1>
        {mc.legalName && (
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{mc.legalName}</p>
        )}
        {mc.isPlatformOperator && (
          <span className="mt-2 inline-block rounded bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Operador de plataforma
          </span>
        )}
      </header>

      {/* Counts */}
      <section className="mb-7 grid grid-cols-3 gap-3">
        <Stat label="Clientes" value={mc._count.clients} />
        <Stat label="Propiedades" value={propertyCount} />
        <Stat label="Usuarios" value={mc._count.memberships} />
      </section>

      {/* Subscription */}
      <section>
        <h2 className="mb-3 text-base font-semibold">Suscripción</h2>
        <SubscriptionEditor managementCompanyId={mc.id} subscription={subState} />
        {sub && (
          <p className="mt-3 text-xs text-[var(--fg-muted)]">
            Alta: {dateFmt.format(sub.startDate)}
            {sub.endDate ? ` · vence ${dateFmt.format(sub.endDate)}` : ""} · fuente{" "}
            <span className="font-mono">{sub.source}</span>
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">
        {new Intl.NumberFormat("es-MX").format(value)}
      </p>
    </div>
  );
}
