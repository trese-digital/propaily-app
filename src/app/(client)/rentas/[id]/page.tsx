import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, Badge, type BadgeTone, Card, CardHeader, Kpi, initialsFrom } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { CancelContractButton } from "./lease-actions";
import { PaymentList, type PaymentItem } from "./payment-list";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function fmtMxn(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  return `$${numFmt.format(Math.round(Number(cents) / 100))}`;
}

const LEASE_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  active: { label: "Activo", tone: "ok" },
  expired: { label: "Expirado", tone: "warn" },
  renewed: { label: "Renovado", tone: "info" },
  cancelled: { label: "Cancelado", tone: "bad" },
};

export default async function ContratoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireContext();
  const { id } = await params;

  const lease = await withAppScope(appScope(ctx), (tx) =>
    tx.lease.findFirst({
      where: { id, deletedAt: null },
      include: {
        property: { select: { id: true, name: true } },
        unit: {
          select: { name: true, property: { select: { id: true, name: true } } },
        },
        rentPayments: {
          where: { deletedAt: null },
          orderBy: { dueDate: "asc" },
        },
      },
    }),
  );
  if (!lease) notFound();

  const now = Date.now();
  const cobrado = lease.rentPayments
    .filter((p) => p.status === "confirmed")
    .reduce((s, p) => s + Number(p.amountCents), 0);
  const pendientes = lease.rentPayments.filter(
    (p) => p.status === "pending" || p.status === "proof_uploaded" || p.status === "overdue",
  ).length;

  const payments: PaymentItem[] = lease.rentPayments.map((p) => ({
    id: p.id,
    periodLabel: `${MONTHS[p.periodMonth - 1]} ${p.periodYear}`,
    dueLabel: dateFmt.format(p.dueDate),
    amountLabel: fmtMxn(p.amountCents),
    status: p.status,
    isOverdue: p.dueDate.getTime() < now,
  }));

  const target = lease.unit
    ? { name: `${lease.unit.property.name} · ${lease.unit.name}`, href: `/propiedades/${lease.unit.property.id}` }
    : { name: lease.property?.name ?? "—", href: lease.property ? `/propiedades/${lease.property.id}` : null };

  const st = LEASE_STATUS[lease.status] ?? LEASE_STATUS.draft;
  const code = `LSE-${lease.id.slice(0, 8).toUpperCase()}`;

  return (
    <section className="mx-auto flex max-w-[1100px] flex-col gap-5 px-8 py-7">
      <p className="mono-label">
        <Link href="/rentas" className="hover:text-pp-700">
          ← Rentas
        </Link>
      </p>

      {/* Hero */}
      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-pp-100 bg-gradient-to-br from-pp-50 to-white p-5">
        <Avatar initials={initialsFrom(lease.tenantName)} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="mono text-[11px] uppercase tracking-[0.1em] text-pp-700">
              Contrato · {code}
            </span>
            <Badge tone={st.tone}>{st.label}</Badge>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.015em]">
            {lease.tenantName}
          </h1>
          <p className="mono mt-1 text-xs text-ink-500">
            {lease.tenantEmail ? `${lease.tenantEmail} · ` : ""}
            {target.href ? (
              <Link href={target.href as never} className="hover:text-pp-700">
                {target.name}
              </Link>
            ) : (
              target.name
            )}
          </p>
        </div>
        <div className="border-l border-ink-200 pl-5 text-right">
          <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-500">
            Renta mensual
          </span>
          <div className="mono num text-[26px] font-semibold tracking-[-0.02em]">
            {fmtMxn(lease.monthlyRentCents)}
          </div>
          <span className="mono text-[11px] text-ink-500">
            MXN · día {lease.paymentDay} de cada mes
          </span>
        </div>
        <CancelContractButton
          leaseId={lease.id}
          disabled={lease.status === "cancelled"}
        />
      </div>

      {/* KPIs */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi label="Cobrado" value={fmtMxn(BigInt(cobrado))} note="pagos confirmados" />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Pagos pendientes"
            value={numFmt.format(pendientes)}
            note="en el calendario"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Depósito"
            value={fmtMxn(lease.securityDepositCents)}
            note="en garantía"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Vigencia"
            value={`${dateFmt.format(lease.startDate)}`}
            note={`hasta ${dateFmt.format(lease.endDate)}`}
          />
        </Card>
      </div>

      {/* Payments */}
      <Card>
        <CardHeader
          title="Calendario de pagos"
          action={
            <span className="text-xs text-ink-500">
              {lease.rentPayments.length} pago
              {lease.rentPayments.length === 1 ? "" : "s"}
            </span>
          }
        />
        <PaymentList payments={payments} />
      </Card>

      {/* Contract data + notes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Datos del contrato" />
          <dl className="flex flex-col">
            {(
              [
                ["Inmueble", target.name],
                ["Inicio", dateFmt.format(lease.startDate)],
                ["Fin", dateFmt.format(lease.endDate)],
                ["Día de pago", `día ${lease.paymentDay}`],
                ["Depósito", fmtMxn(lease.securityDepositCents)],
                ["Moneda", lease.currency],
              ] as Array<[string, string]>
            ).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 border-t border-ink-100 px-4 py-2.5 text-[13px] first:border-t-0"
              >
                <dt className="text-ink-500">{k}</dt>
                <dd className="text-right font-medium text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <CardHeader title="Notas" />
          <p className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-700">
            {lease.notes ?? "Sin notas."}
          </p>
        </Card>
      </div>
    </section>
  );
}
