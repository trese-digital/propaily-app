import Link from "next/link";
import { cookies } from "next/headers";

import type { Prisma } from "@prisma/client";

import { IcBuilding, IcPhoto, IcPlus } from "@/components/icons";
import { Badge, type BadgeTone, Card, EmptyState } from "@/components/ui";
import { withAppScope } from "@/server/db/scoped";
import { appScope, requireContext } from "@/server/auth/context";
import { getPropertyCoverUrl } from "@/server/properties/cover-photo";
import { formatPropertyTitleValue } from "@/lib/property-value";

import { FiltersBar } from "./filters-bar";
import { ViewToggle } from "./view-toggle";
import { VIEW_COOKIE, type PropertyView } from "./view-config";

const TYPE_LABEL: Record<string, string> = {
  house: "Casa habitación",
  apartment: "Departamento",
  land: "Terreno",
  commercial_space: "Local comercial",
  office: "Oficina",
  warehouse: "Bodega",
  industrial: "Industrial",
  other: "Otro",
};

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

/** Estatus operativo → tono del Badge compartido (mismo lenguaje que el resto del portal). */
const STATUS_TONE: Record<string, BadgeTone> = {
  active: "ok",
  rented: "ok",
  available: "info",
  for_sale: "warn",
  under_construction: "warn",
  maintenance: "warn",
  reserved: "violet",
  inactive: "neutral",
};

const VALID_TYPES = new Set(Object.keys(TYPE_LABEL));
const VALID_STATUS = new Set(Object.keys(STATUS_LABEL));

function fmtMoneyCents(c: bigint | null | undefined) {
  if (c == null) return "—";
  const n = Number(c) / 100;
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ ciudad?: string; tipo?: string; estado?: string }>;
}) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const cookieStore = await cookies();

  const view: PropertyView =
    cookieStore.get(VIEW_COOKIE)?.value === "list" ? "list" : "grid";

  const ciudadFilter = sp.ciudad?.trim() || "";
  const tipoFilter = sp.tipo && VALID_TYPES.has(sp.tipo) ? sp.tipo : "";
  const estadoFilter = sp.estado && VALID_STATUS.has(sp.estado) ? sp.estado : "";

  // RLS hace el scoping por managementCompanyId. baseWhere se queda con los
  // filtros propios del modelo (soft-delete y status).
  const baseWhere: Prisma.PropertyWhereInput = {
    status: { not: "deleted" },
    deletedAt: null,
  };

  const where: Prisma.PropertyWhereInput = {
    ...baseWhere,
    ...(ciudadFilter ? { city: ciudadFilter } : {}),
    ...(tipoFilter ? { type: tipoFilter as Prisma.EnumPropertyTypeFilter["equals"] } : {}),
    ...(estadoFilter
      ? { operationalStatus: estadoFilter as Prisma.EnumOperationalStatusFilter["equals"] }
      : {}),
  };

  const { ciudades, properties, totalUnfiltered } = await withAppScope(
    appScope(ctx),
    async (tx) => {
      const ciudadesRaw = await tx.property.findMany({
        where: { ...baseWhere, city: { not: null } },
        distinct: ["city"],
        select: { city: true },
        orderBy: { city: "asc" },
      });
      const ciudades = ciudadesRaw
        .map((r) => r.city)
        .filter((c): c is string => !!c && c.trim().length > 0);

      const properties = await tx.property.findMany({
        where,
        include: { portfolio: { include: { client: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      const totalUnfiltered = await tx.property.count({ where: baseWhere });
      return { ciudades, properties, totalUnfiltered };
    },
  );

  const coverUrls = await Promise.all(
    properties.map((p) =>
      p.coverPhotoStorageKey
        ? getPropertyCoverUrl(p.coverPhotoStorageKey)
        : Promise.resolve(null),
    ),
  );

  const filtered = properties.length;
  const isFiltered = !!(ciudadFilter || tipoFilter || estadoFilter);

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">{ctx.membership.managementCompanyName}</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Propiedades
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {isFiltered
              ? `${filtered} de ${totalUnfiltered}`
              : `${totalUnfiltered} en total`}
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

      <FiltersBar
        ciudades={ciudades}
        selectedCity={ciudadFilter}
        selectedType={tipoFilter}
        selectedStatus={estadoFilter}
      />

      {totalUnfiltered === 0 ? (
        <EmptyState
          icon={IcBuilding}
          title="Aún no hay propiedades"
          description="Registra la primera propiedad, desde cero o a partir de un lote del catastro."
          accent
        />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={IcBuilding}
          tone="warn"
          title="Sin coincidencias"
          description="Ninguna propiedad coincide con esos filtros. Ajusta o límpialos."
        />
      ) : (
        <>
          <div className="flex justify-end">
            <ViewToggle view={view} />
          </div>
          {view === "grid" ? (
            <GridView properties={properties} coverUrls={coverUrls} />
          ) : (
            <ListView properties={properties} coverUrls={coverUrls} />
          )}
        </>
      )}
    </section>
  );
}

type PropertyRow = Prisma.PropertyGetPayload<{
  include: { portfolio: { include: { client: true } } };
}>;

function GridView({
  properties,
  coverUrls,
}: {
  properties: PropertyRow[];
  coverUrls: (string | null)[];
}) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
      {properties.map((p, i) => {
        const url = coverUrls[i];
        return (
          <Link key={p.id} href={`/propiedades/${p.id}` as never} className="group">
            <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:border-pp-300 group-hover:shadow-[var(--shadow-md)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)]">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                ) : (
                  <PlaceholderArt name={p.name} />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <div>
                  <span className="mono-label">
                    {(TYPE_LABEL[p.type] ?? p.type).toLowerCase()} ·{" "}
                    {p.portfolio.client.name}
                  </span>
                  <h3 className="mt-1.5 text-[16px] font-medium leading-tight tracking-[-0.01em] text-ink-900">
                    {p.name}
                  </h3>
                  {p.address && (
                    <p className="mt-1 truncate text-xs text-[var(--fg-muted)]">
                      {p.address}
                    </p>
                  )}
                </div>
                <div className="mt-auto flex items-end justify-between gap-2">
                  <div>
                    <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-500">
                      Valor estimado
                    </span>
                    <div className="num mt-0.5 text-[18px] font-semibold tracking-[-0.01em] text-ink-900">
                      {formatPropertyTitleValue(p)}
                    </div>
                  </div>
                  <Badge tone={STATUS_TONE[p.operationalStatus] ?? "neutral"}>
                    {STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function ListView({
  properties,
  coverUrls,
}: {
  properties: PropertyRow[];
  coverUrls: (string | null)[];
}) {
  const cols =
    "grid grid-cols-[64px_minmax(0,2.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4";
  return (
    <Card className="overflow-hidden">
      <div
        className={`${cols} mono-label border-b border-ink-100 bg-[var(--bg-muted)] px-4 py-2.5`}
      >
        <span />
        <span>Nombre</span>
        <span>Cliente · Tipo</span>
        <span>Ciudad</span>
        <span>Estatus</span>
        <span className="text-right">Valor estimado</span>
      </div>
      {properties.map((p, i) => {
        const url = coverUrls[i];
        return (
          <Link
            key={p.id}
            href={`/propiedades/${p.id}` as never}
            className={`${cols} px-4 py-3 text-ink-900 transition-colors hover:bg-[var(--bg-muted)] ${
              i === 0 ? "" : "border-t border-ink-100"
            }`}
          >
            <div className="flex h-[42px] w-14 items-center justify-center overflow-hidden rounded-md bg-[var(--bg-subtle)] text-[var(--fg-subtle)]">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IcPhoto size={14} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-ink-900">
                {p.name}
              </p>
              {p.address && (
                <p className="mt-0.5 truncate text-[11px] text-[var(--fg-muted)]">
                  {p.address}
                </p>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-ink-900">
                {p.portfolio.client.name}
              </p>
              <p className="mono-label mt-0.5">{TYPE_LABEL[p.type] ?? p.type}</p>
            </div>
            <p className="truncate text-xs text-[var(--fg-muted)]">
              {p.city ?? "—"}
            </p>
            <div>
              <Badge tone={STATUS_TONE[p.operationalStatus] ?? "neutral"}>
                {STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus}
              </Badge>
            </div>
            <p className="num text-right text-[13px] font-medium text-ink-900">
              {formatPropertyTitleValue(p)}
            </p>
          </Link>
        );
      })}
    </Card>
  );
}

function PlaceholderArt({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pp-100 to-ink-100 px-3 text-center text-[13px] font-medium text-pp-700">
      {name.slice(0, 24)}
    </div>
  );
}
