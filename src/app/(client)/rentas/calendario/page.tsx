import Link from "next/link";

import { IcKey } from "@/components/icons";
import { Avatar, Card, EmptyState, Kpi, initialsFrom } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const numFmt = new Intl.NumberFormat("es-MX");
const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function fmtMxn(cents: number | bigint): string {
  const n = Number(cents) / 100;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${numFmt.format(Math.round(n))}`;
}

type CellStatus = "paid" | "paid-late" | "pending" | "overdue" | "empty";

const CELL: Record<CellStatus, { cls: string; icon: string }> = {
  paid: { cls: "bg-ok text-white", icon: "✓" },
  "paid-late": { cls: "bg-warn text-white", icon: "✓" },
  pending: { cls: "border border-dashed border-pp-300 bg-pp-50 text-pp-700", icon: "·" },
  overdue: { cls: "bg-bad text-white", icon: "!" },
  empty: { cls: "border border-dashed border-ink-200", icon: "" },
};

export default async function RentasCalendarioPage() {
  const ctx = await requireContext();

  const leases = await withAppScope(appScope(ctx), (tx) =>
    tx.lease.findMany({
      where: { deletedAt: null, status: { not: "cancelled" } },
      orderBy: { tenantName: "asc" },
      include: {
        property: { select: { name: true } },
        unit: { select: { name: true, property: { select: { name: true } } } },
        rentPayments: {
          where: { deletedAt: null },
          select: {
            periodMonth: true,
            periodYear: true,
            dueDate: true,
            paidAt: true,
            amountCents: true,
            status: true,
          },
        },
      },
    }),
  );

  // Ventana de 12 meses terminando en el mes actual.
  const today = new Date();
  const curY = today.getUTCFullYear();
  const curM = today.getUTCMonth(); // 0-11
  const window: Array<{ year: number; month: number }> = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(curY, curM - i, 1));
    window.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
  }
  const now = today.getTime();

  function cellStatus(
    payments: (typeof leases)[number]["rentPayments"],
    year: number,
    month: number,
  ): CellStatus {
    const p = payments.find(
      (x) => x.periodYear === year && x.periodMonth === month,
    );
    if (!p || p.status === "cancelled") return "empty";
    if (p.status === "confirmed") {
      if (p.paidAt && p.paidAt.getTime() > p.dueDate.getTime() + 86_400_000) {
        return "paid-late";
      }
      return "paid";
    }
    return p.dueDate.getTime() < now ? "overdue" : "pending";
  }

  // KPIs del mes actual.
  let cobradoMes = 0;
  let porCobrarMes = 0;
  let vencidoTotal = 0;
  for (const l of leases) {
    for (const p of l.rentPayments) {
      if (p.status === "cancelled") continue;
      const isCurMonth = p.periodYear === curY && p.periodMonth === curM + 1;
      if (p.status === "confirmed" && isCurMonth) cobradoMes += Number(p.amountCents);
      if (p.status !== "confirmed" && isCurMonth) porCobrarMes += Number(p.amountCents);
      if (p.status !== "confirmed" && p.dueDate.getTime() < now) {
        vencidoTotal += Number(p.amountCents);
      }
    }
  }
  const esperadoMes = leases
    .filter((l) => l.status === "active")
    .reduce((s, l) => s + Number(l.monthlyRentCents), 0);

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-5 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Rentas · salud financiera</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Calendario de pagos
          </h1>
        </div>
        <nav className="flex gap-1 rounded-lg border border-ink-100 bg-[var(--bg-subtle)] p-1 text-[13px] font-medium">
          <Link href="/rentas" className="rounded-md px-3 py-1.5 text-ink-500 hover:text-ink-800">
            Contratos
          </Link>
          <span className="rounded-md bg-white px-3 py-1.5 text-ink-900 shadow-[var(--shadow-xs)]">
            Calendario
          </span>
        </nav>
      </header>

      {/* KPIs */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi label={`Cobrado · ${MONTHS[curM]}`} value={fmtMxn(cobradoMes)} note="pagos confirmados" />
        </Card>
        <Card className="p-4">
          <Kpi label="Por cobrar este mes" value={fmtMxn(porCobrarMes)} note="aún pendiente" />
        </Card>
        <Card className="p-4">
          <Kpi label="Vencido" value={fmtMxn(vencidoTotal)} note="pagos sin registrar" />
        </Card>
        <Card className="p-4">
          <Kpi label="Renta esperada" value={fmtMxn(esperadoMes)} note="MXN · mes · contratos activos" />
        </Card>
      </div>

      {leases.length === 0 ? (
        <EmptyState
          icon={IcKey}
          title="Sin contratos en el calendario"
          description="Crea un contrato para ver el calendario de pagos."
          accent
        />
      ) : (
        <Card className="overflow-x-auto">
          {/* Header de meses */}
          <div className="grid min-w-[820px] grid-cols-[220px_repeat(12,1fr)] border-b border-ink-100 bg-[var(--bg-subtle)] py-2.5">
            <div className="px-4">
              <span className="mono-label">Inquilino</span>
            </div>
            {window.map((w, i) => (
              <div
                key={`${w.year}-${w.month}`}
                className={`text-center text-[11px] font-medium uppercase tracking-[0.04em] ${
                  i === 11 ? "text-pp-700" : "text-ink-500"
                }`}
              >
                {MONTHS[w.month - 1]}
              </div>
            ))}
          </div>
          {/* Filas */}
          {leases.map((l, idx) => {
            const target = l.unit
              ? `${l.unit.property.name} · ${l.unit.name}`
              : (l.property?.name ?? "—");
            return (
              <div
                key={l.id}
                className={`grid min-w-[820px] grid-cols-[220px_repeat(12,1fr)] items-center border-b border-ink-100 py-2 last:border-b-0 ${
                  idx % 2 === 1 ? "bg-[var(--bg-muted)]" : "bg-white"
                }`}
              >
                <Link
                  href={`/rentas/${l.id}` as never}
                  className="flex items-center gap-2.5 px-4"
                >
                  <Avatar initials={initialsFrom(l.tenantName)} size={30} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink-900">
                      {l.tenantName}
                    </span>
                    <span className="mono block truncate text-[10px] text-ink-500">
                      {target}
                    </span>
                  </span>
                </Link>
                {window.map((w) => {
                  const st = cellStatus(l.rentPayments, w.year, w.month);
                  const c = CELL[st];
                  return (
                    <div
                      key={`${w.year}-${w.month}`}
                      className="flex justify-center px-1"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${c.cls}`}
                        title={`${MONTHS[w.month - 1]} ${w.year}`}
                      >
                        {c.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Card>
      )}

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-[11px] text-ink-600">
        {(
          [
            ["bg-ok", "Pagado"],
            ["bg-warn", "Pagado tarde"],
            ["border border-dashed border-pp-300 bg-pp-50", "Pendiente"],
            ["bg-bad", "Vencido"],
            ["border border-dashed border-ink-200", "Sin pago"],
          ] as Array<[string, string]>
        ).map(([cls, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
