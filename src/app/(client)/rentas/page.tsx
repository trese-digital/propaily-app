import Link from "next/link";

import { IcKey, IcPlus } from "@/components/icons";
import {
  Avatar,
  Badge,
  type BadgeTone,
  Card,
  EmptyState,
  initialsFrom,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function fmtMxn(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  return `$${new Intl.NumberFormat("es-MX").format(Math.round(Number(cents) / 100))}`;
}

const LEASE_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: "Borrador", tone: "neutral" },
  active: { label: "Activo", tone: "ok" },
  expired: { label: "Expirado", tone: "warn" },
  renewed: { label: "Renovado", tone: "info" },
  cancelled: { label: "Cancelado", tone: "bad" },
};

const DAY_MS = 86_400_000;

export default async function RentasPage() {
  const ctx = await requireContext();

  const leases = await withAppScope(appScope(ctx), (tx) =>
    tx.lease.findMany({
      where: { deletedAt: null },
      orderBy: [{ status: "asc" }, { endDate: "asc" }],
      include: {
        property: { select: { name: true } },
        unit: {
          select: { name: true, property: { select: { name: true } } },
        },
        rentPayments: {
          where: { status: "pending", deletedAt: null },
          orderBy: { dueDate: "asc" },
          take: 1,
          select: { dueDate: true },
        },
      },
    }),
  );

  const now = Date.now();
  const activos = leases.filter((l) => l.status === "active").length;
  const ingresoEsperado = leases
    .filter((l) => l.status === "active")
    .reduce((s, l) => s + Number(l.monthlyRentCents), 0);

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">
            {ctx.client?.name ?? ctx.membership.managementCompanyName}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Rentas
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {leases.length === 0
              ? "Aún no hay contratos."
              : `${leases.length} contrato${leases.length === 1 ? "" : "s"} · ${activos} vigente${activos === 1 ? "" : "s"} · ingreso esperado ${fmtMxn(BigInt(ingresoEsperado))}/mes`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex gap-1 rounded-lg border border-ink-100 bg-[var(--bg-subtle)] p-1 text-[13px] font-medium">
            <span className="rounded-md bg-white px-3 py-1.5 text-ink-900 shadow-[var(--shadow-xs)]">
              Contratos
            </span>
            <Link
              href="/rentas/calendario"
              className="rounded-md px-3 py-1.5 text-ink-500 hover:text-ink-800"
            >
              Calendario
            </Link>
          </nav>
          <Link
            href="/rentas/nuevo"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-pp-500 px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgba(27,8,83,0.2)] transition-colors hover:bg-pp-600"
          >
            <IcPlus size={16} />
            Nuevo contrato
          </Link>
        </div>
      </header>

      {leases.length === 0 ? (
        <EmptyState
          icon={IcKey}
          title="Aún no hay contratos de arrendamiento"
          description="Crea un contrato sobre una propiedad o unidad. El calendario de pagos se genera automáticamente."
          accent
        />
      ) : (
        <Card>
          <Table className="rounded-none border-0">
            <THead>
              <TR>
                <TH>Inquilino</TH>
                <TH>Propiedad · Unidad</TH>
                <TH align="right">Renta · día</TH>
                <TH>Próximo pago</TH>
                <TH>Vigencia</TH>
                <TH>Estatus</TH>
              </TR>
            </THead>
            <TBody>
              {leases.map((l, i) => {
                const target = l.unit
                  ? `${l.unit.property.name} · ${l.unit.name}`
                  : (l.property?.name ?? "—");
                const next = l.rentPayments[0]?.dueDate ?? null;
                const days = next
                  ? Math.round((next.getTime() - now) / DAY_MS)
                  : null;
                const st = LEASE_STATUS[l.status] ?? LEASE_STATUS.draft;
                const overdue = days != null && days < 0;
                return (
                  <TR key={l.id} zebra={i % 2 === 1}>
                    <TD>
                      <Link
                        href={`/rentas/${l.id}` as never}
                        className="flex items-center gap-2.5"
                      >
                        <Avatar initials={initialsFrom(l.tenantName)} size={32} />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-ink-900">
                            {l.tenantName}
                          </span>
                          {l.tenantEmail && (
                            <span className="mono block truncate text-[11px] text-ink-500">
                              {l.tenantEmail}
                            </span>
                          )}
                        </span>
                      </Link>
                    </TD>
                    <TD>
                      <span className="text-[13px] text-ink-900">{target}</span>
                    </TD>
                    <TD align="right">
                      <span className="mono num block text-[13px] font-semibold text-ink-900">
                        {fmtMxn(l.monthlyRentCents)}
                      </span>
                      <span className="mono block text-[11px] text-ink-500">
                        día {l.paymentDay}
                      </span>
                    </TD>
                    <TD>
                      {next ? (
                        <>
                          <span
                            className={`mono num block text-[13px] font-semibold ${overdue ? "text-bad" : "text-ink-900"}`}
                          >
                            {dateFmt.format(next)}
                          </span>
                          <span className="mono block text-[11px] text-ink-500">
                            {days != null && days < 0
                              ? `vencido ${Math.abs(days)}d`
                              : `en ${days}d`}
                          </span>
                        </>
                      ) : (
                        <span className="mono text-[11px] text-ink-400">—</span>
                      )}
                    </TD>
                    <TD>
                      <span className="mono text-[11px] text-ink-600">
                        {dateFmt.format(l.startDate)} → {dateFmt.format(l.endDate)}
                      </span>
                    </TD>
                    <TD>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      )}
    </section>
  );
}
