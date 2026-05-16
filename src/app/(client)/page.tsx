import Link from "next/link";

import { IcArrowUR, IcBuilding, IcCheck, IcMap, IcPlus } from "@/components/icons";
import { PortfolioMap, type MapPin } from "@/components/portfolio-map";
import { Badge, type BadgeTone, Card, CardHeader, Kpi } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatMxn(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  const pesos = Number(cents) / 100;
  if (pesos === 0) return "$0";
  const abs = Math.abs(pesos);
  if (abs >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(pesos / 1_000).toFixed(0)}K`;
  return `$${numFmt.format(Math.round(pesos))}`;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  available: "Disponible",
  rented: "Rentada",
  for_sale: "En venta",
  under_construction: "En construcción",
  maintenance: "Mantenimiento",
  reserved: "Reservada",
  inactive: "Inactiva",
};

function statusTone(status: string): BadgeTone {
  if (status === "active" || status === "rented") return "ok";
  if (status === "available") return "info";
  if (status === "reserved") return "violet";
  if (status === "inactive") return "neutral";
  return "warn";
}

export default async function HomePage() {
  const ctx = await requireContext();

  const now = new Date();
  const in60Days = new Date(now.getTime() + 60 * 86_400_000);

  // RLS scopea por MC (+ Client si es family office). Los `where` no lo mencionan.
  const data = await withAppScope(appScope(ctx), async (tx) => {
    const [
      propertyCount,
      portfolioCount,
      documentCount,
      recentProperties,
      valueAgg,
      rentAgg,
      pinRows,
      overduePaymentCount,
      expiringLeaseCount,
      openValuationCount,
    ] = await Promise.all([
      tx.property.count({ where: { deletedAt: null } }),
      tx.portfolio.count({ where: { deletedAt: null } }),
      tx.document.count({ where: { deletedAt: null } }),
      tx.property.findMany({
        where: { deletedAt: null },
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: {
          id: true,
          name: true,
          city: true,
          landAreaSqm: true,
          builtAreaSqm: true,
          currentValueCents: true,
          fiscalValueCents: true,
          operationalStatus: true,
        },
      }),
      tx.property.aggregate({
        where: { deletedAt: null },
        _sum: { currentValueCents: true, fiscalValueCents: true },
      }),
      tx.unit.aggregate({
        where: { deletedAt: null },
        _sum: { monthlyRentCents: true },
      }),
      tx.property.findMany({
        where: {
          deletedAt: null,
          latitude: { not: null },
          longitude: { not: null },
        },
        select: { id: true, name: true, latitude: true, longitude: true },
        take: 200,
      }),
      tx.rentPayment.count({
        where: { deletedAt: null, status: "pending", dueDate: { lt: now } },
      }),
      tx.lease.count({
        where: {
          deletedAt: null,
          status: "active",
          endDate: { gte: now, lte: in60Days },
        },
      }),
      tx.valuationRequest.count({
        where: { status: { in: ["pending", "in_progress"] } },
      }),
    ]);
    return {
      propertyCount,
      portfolioCount,
      documentCount,
      recentProperties,
      valueAgg,
      rentAgg,
      pinRows,
      overduePaymentCount,
      expiringLeaseCount,
      openValuationCount,
    };
  });

  const pins: MapPin[] = data.pinRows.flatMap((p) =>
    p.latitude != null && p.longitude != null
      ? [
          {
            id: p.id,
            name: p.name,
            lat: Number(p.latitude),
            lng: Number(p.longitude),
          },
        ]
      : [],
  );

  const totalValue =
    data.valueAgg._sum.currentValueCents ??
    data.valueAgg._sum.fiscalValueCents ??
    0n;
  const rentTotal = data.rentAgg._sum.monthlyRentCents ?? 0n;
  const pPlural = data.propertyCount === 1 ? "" : "es";
  const portfolioWord =
    data.portfolioCount === 1 ? "portafolio" : "portafolios";

  type PendingTone = "bad" | "warn" | "info";
  type PendingItem = {
    href: string;
    count: number;
    label: string;
    tone: PendingTone;
  };
  const pendingItems: PendingItem[] = [];
  if (data.overduePaymentCount > 0) {
    pendingItems.push({
      href: "/rentas/calendario",
      count: data.overduePaymentCount,
      label: data.overduePaymentCount === 1 ? "pago vencido" : "pagos vencidos",
      tone: "bad",
    });
  }
  if (data.expiringLeaseCount > 0) {
    pendingItems.push({
      href: "/rentas",
      count: data.expiringLeaseCount,
      label:
        data.expiringLeaseCount === 1
          ? "contrato vence pronto"
          : "contratos vencen pronto",
      tone: "warn",
    });
  }
  if (data.openValuationCount > 0) {
    pendingItems.push({
      href: "/valuaciones",
      count: data.openValuationCount,
      label:
        data.openValuationCount === 1
          ? "solicitud de avalúo abierta"
          : "solicitudes de avalúo abiertas",
      tone: "info",
    });
  }

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      {/* Greeting */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">{dateFmt.format(new Date())}</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            {greeting()}, {ctx.user.name?.split(" ")[0] ?? "Pablo"}.
          </h1>
          <p className="mt-1 max-w-[640px] text-sm text-[var(--fg-muted)]">
            {ctx.client?.name ?? ctx.membership.managementCompanyName} ·{" "}
            {data.propertyCount} propiedad{pPlural} en {data.portfolioCount}{" "}
            {portfolioWord}.
          </p>
        </div>
        <Link
          href="/propiedades/nueva"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-pp-500 px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgba(27,8,83,0.2)] transition-colors hover:bg-pp-600"
        >
          <IcPlus size={16} />
          Nueva propiedad
        </Link>
      </header>

      {/* KPI strip */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi
            label="Valor estimado"
            value={formatMxn(totalValue)}
            note="MXN · portafolio"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Propiedades"
            value={numFmt.format(data.propertyCount)}
            note={`en ${data.portfolioCount} ${portfolioWord}`}
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Renta mensual"
            value={formatMxn(rentTotal)}
            note="MXN · suma de unidades"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Documentos"
            value={numFmt.format(data.documentCount)}
            note="en biblioteca"
          />
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader
            title="Mapa del portafolio"
            action={
              <Link
                href="/cartografia"
                className="inline-flex items-center gap-1 text-xs font-medium text-pp-700 transition-colors hover:text-pp-600"
              >
                Abrir cartografía <IcArrowUR size={12} />
              </Link>
            }
          />
          <div className="relative h-[320px]">
            <PortfolioMap pins={pins} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="Accesos rápidos" />
          <div className="flex flex-col gap-2.5 p-4">
            <QuickLink
              href="/propiedades/nueva"
              icon={<IcPlus size={16} />}
              label="Crear propiedad"
              hint="Desde cero o desde un lote"
            />
            <QuickLink
              href="/propiedades"
              icon={<IcBuilding size={16} />}
              label="Ver portafolio"
              hint={`${data.propertyCount} en total`}
            />
            <QuickLink
              href="/cartografia"
              icon={<IcMap size={16} />}
              label="Explorar cartografía"
              hint="León, Gto · catastro"
            />
          </div>
          <div className="mt-auto m-3 flex flex-col gap-1.5">
            <span className="mono px-1 text-[10px] uppercase tracking-[0.12em] text-ink-500">
              Requiere atención
            </span>
            {pendingItems.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-ink-100 bg-[var(--bg-muted)] px-3 py-2.5">
                <IcCheck size={14} style={{ color: "var(--color-ok)" }} />
                <span className="text-xs text-ink-600">
                  Todo al día. Sin pendientes.
                </span>
              </div>
            ) : (
              pendingItems.map((item) => (
                <PendingRow key={item.href} {...item} />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent properties */}
      <Card>
        <CardHeader
          title="Propiedades recientes"
          action={
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-1 text-xs font-medium text-pp-700 transition-colors hover:text-pp-600"
            >
              Ver todas ({data.propertyCount}) <IcArrowUR size={12} />
            </Link>
          }
        />
        {data.recentProperties.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--fg-muted)]">
            Aún no tienes propiedades.{" "}
            <Link
              href="/propiedades/nueva"
              className="font-medium text-pp-700"
            >
              Crear la primera →
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.recentProperties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                name={p.name}
                city={p.city}
                area={p.builtAreaSqm ?? p.landAreaSqm}
                value={p.currentValueCents ?? p.fiscalValueCents}
                status={p.operationalStatus}
              />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

/* ── Sub-componentes ───────────────────────────────────────────── */

function QuickLink({
  href,
  icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href as never}
      className="flex items-center gap-3 rounded-lg border border-ink-100 bg-[var(--bg-muted)] px-3 py-2.5 transition-colors hover:border-pp-300 hover:bg-pp-50"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pp-50 text-pp-600">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[13px] font-medium text-ink-900">
          {label}
        </span>
        <span className="block text-[11px] text-ink-500">{hint}</span>
      </span>
      <IcArrowUR size={14} style={{ color: "var(--color-ink-400)" }} />
    </Link>
  );
}

const PENDING_TONE: Record<
  "bad" | "warn" | "info",
  { chip: string; text: string }
> = {
  bad: { chip: "bg-bad text-white", text: "text-bad" },
  warn: { chip: "bg-warn text-white", text: "text-warn" },
  info: { chip: "bg-info text-white", text: "text-ink-700" },
};

function PendingRow({
  href,
  count,
  label,
  tone,
}: {
  href: string;
  count: number;
  label: string;
  tone: "bad" | "warn" | "info";
}) {
  const t = PENDING_TONE[tone];
  return (
    <Link
      href={href as never}
      className="flex items-center gap-2.5 rounded-lg border border-ink-100 bg-white px-3 py-2 transition-colors hover:border-pp-300 hover:bg-pp-50"
    >
      <span
        className={`mono num flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold ${t.chip}`}
      >
        {count}
      </span>
      <span className="flex-1 text-[12px] text-ink-700">{label}</span>
      <IcArrowUR size={13} style={{ color: "var(--color-ink-400)" }} />
    </Link>
  );
}

function PropertyCard({
  id,
  name,
  city,
  area,
  value,
  status,
}: {
  id: string;
  name: string;
  city: string | null;
  area: { toNumber: () => number } | null;
  value: bigint | null;
  status: string;
}) {
  return (
    <Link
      href={`/propiedades/${id}` as never}
      className="flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white transition-all hover:border-pp-300 hover:shadow-[var(--shadow-sm)]"
    >
      <div className="flex h-20 items-center justify-center bg-gradient-to-br from-pp-100 to-ink-100 px-3 text-center text-[13px] font-medium text-pp-700">
        {name.slice(0, 28)}
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13px] font-medium text-ink-900">
            {name}
          </span>
          <span className="mono num shrink-0 text-[13px] font-medium text-ink-900">
            {formatMxn(value)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="mono truncate text-[11px] text-ink-500">
            {city ?? "—"}
            {area
              ? ` · ${numFmt.format(Math.round(area.toNumber()))} m²`
              : ""}
          </span>
          <Badge tone={statusTone(status)}>
            {STATUS_LABEL[status] ?? status}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

/* El mapa real del portafolio vive en `components/portfolio-map.tsx` (#3). */
