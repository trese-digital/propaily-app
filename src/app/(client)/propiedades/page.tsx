import Link from "next/link";
import { cookies } from "next/headers";

import type { Prisma } from "@prisma/client";

import { db } from "@/server/db/client";
import { requireContext } from "@/server/auth/context";
import { getPropertyCoverUrl } from "@/server/properties/cover-photo";

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

const STATUS_TONE: Record<string, { bg: string; fg: string; dot: string }> = {
  active: { bg: "rgba(16,185,129,0.12)", fg: "#065F46", dot: "var(--color-ok)" },
  rented: { bg: "rgba(16,185,129,0.12)", fg: "#065F46", dot: "var(--color-ok)" },
  available: { bg: "rgba(59,130,246,0.12)", fg: "#1E40AF", dot: "var(--color-info)" },
  for_sale: { bg: "rgba(245,158,11,0.14)", fg: "#92400E", dot: "var(--color-warn)" },
  under_construction: { bg: "rgba(245,158,11,0.14)", fg: "#92400E", dot: "var(--color-warn)" },
  maintenance: { bg: "rgba(245,158,11,0.14)", fg: "#92400E", dot: "var(--color-warn)" },
  reserved: { bg: "var(--accent-soft)", fg: "var(--color-pp-700)", dot: "var(--color-pp-500)" },
  inactive: { bg: "var(--bg-subtle)", fg: "var(--fg-muted)", dot: "var(--color-ink-400)" },
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

  const view: PropertyView = cookieStore.get(VIEW_COOKIE)?.value === "list" ? "list" : "grid";

  const ciudadFilter = sp.ciudad?.trim() || "";
  const tipoFilter = sp.tipo && VALID_TYPES.has(sp.tipo) ? sp.tipo : "";
  const estadoFilter = sp.estado && VALID_STATUS.has(sp.estado) ? sp.estado : "";

  const baseWhere: Prisma.PropertyWhereInput = {
    portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
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

  const ciudadesRaw = await db.property.findMany({
    where: { ...baseWhere, city: { not: null } },
    distinct: ["city"],
    select: { city: true },
    orderBy: { city: "asc" },
  });
  const ciudades = ciudadesRaw
    .map((r) => r.city)
    .filter((c): c is string => !!c && c.trim().length > 0);

  const properties = await db.property.findMany({
    where,
    include: { portfolio: { include: { client: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const coverUrls = await Promise.all(
    properties.map((p) =>
      p.coverPhotoStorageKey ? getPropertyCoverUrl(p.coverPhotoStorageKey) : Promise.resolve(null),
    ),
  );

  const totalUnfiltered = await db.property.count({ where: baseWhere });
  const filtered = properties.length;
  const isFiltered = !!(ciudadFilter || tipoFilter || estadoFilter);

  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 28 }}>
        <div>
          <span className="mono-label">{ctx.membership.managementCompanyName}</span>
          <h1
            style={{
              margin: "8px 0 6px",
              font: "600 28px/1.1 var(--font-sans)",
              letterSpacing: "-0.025em",
              color: "var(--fg)",
            }}
          >
            Propiedades
          </h1>
          <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: 14 }}>
            {isFiltered ? `${filtered} de ${totalUnfiltered}` : `${totalUnfiltered} en total`}
          </p>
        </div>
        <Link
          href="/propiedades/nueva"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent)",
            color: "#fff",
            padding: "0 16px",
            height: 36,
            borderRadius: 8,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            border: `1px solid var(--accent)`,
            boxShadow: "var(--shadow-sm)",
            transition: "background var(--dur-fast) var(--ease)",
          }}
          className="hover:bg-(--accent-hover)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva propiedad
        </Link>
      </div>

      <FiltersBar
        ciudades={ciudades}
        selectedCity={ciudadFilter}
        selectedType={tipoFilter}
        selectedStatus={estadoFilter}
      />

      {totalUnfiltered === 0 ? (
        <EmptyState />
      ) : properties.length === 0 ? (
        <NoMatchState />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
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

type PropertyRow = Awaited<ReturnType<typeof db.property.findMany>>[number] & {
  portfolio: { client: { name: string } };
};

function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.inactive;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 999,
        background: tone.bg,
        color: tone.fg,
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: tone.dot }} />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function GridView({ properties, coverUrls }: { properties: PropertyRow[]; coverUrls: (string | null)[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      {properties.map((p, i) => {
        const url = coverUrls[i];
        return (
          <Link
            key={p.id}
            href={`/propiedades/${p.id}` as never}
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
            }}
            className="group hover:border-(--color-pp-300) hover:shadow-md"
          >
            <div style={{ aspectRatio: "16/10", background: "var(--bg-subtle)", position: "relative", overflow: "hidden" }}>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="group-hover:scale-[1.02] transition-transform"
                />
              ) : (
                <PlaceholderArt name={p.name} />
              )}
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <div>
                <span className="mono-label">
                  {(TYPE_LABEL[p.type] ?? p.type).toLowerCase()} · {p.portfolio.client.name}
                </span>
                <h3
                  style={{
                    margin: "6px 0 0",
                    font: "500 16px var(--font-sans)",
                    color: "var(--fg)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {p.name}
                </h3>
                {p.address && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: "var(--fg-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.address}
                  </p>
                )}
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <span className="mono-label" style={{ fontSize: 10 }}>
                    Valor fiscal
                  </span>
                  <div className="num" style={{ font: "600 18px var(--font-sans)", color: "var(--fg)", letterSpacing: "-0.01em", marginTop: 2 }}>
                    {fmtMoneyCents(p.fiscalValueCents)}
                  </div>
                </div>
                <StatusBadge status={p.operationalStatus} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ListView({ properties, coverUrls }: { properties: PropertyRow[]; coverUrls: (string | null)[] }) {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        className="mono-label"
        style={{
          display: "grid",
          gridTemplateColumns: "64px minmax(0,2.5fr) minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
          gap: 16,
          alignItems: "center",
          padding: "10px 16px",
          background: "var(--bg-muted)",
          borderBottom: "1px solid var(--border)",
          fontSize: 10,
        }}
      >
        <span></span>
        <span>Nombre</span>
        <span>Cliente · Tipo</span>
        <span>Ciudad</span>
        <span>Estatus</span>
        <span style={{ textAlign: "right" }}>Valor fiscal</span>
      </div>
      {properties.map((p, i) => {
        const url = coverUrls[i];
        return (
          <Link
            key={p.id}
            href={`/propiedades/${p.id}` as never}
            style={{
              display: "grid",
              gridTemplateColumns: "64px minmax(0,2.5fr) minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
              gap: 16,
              alignItems: "center",
              padding: "12px 16px",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              transition: "background var(--dur-fast) var(--ease)",
              color: "var(--fg)",
            }}
            className="hover:bg-(--bg-muted)"
          >
            <div
              style={{
                width: 56,
                height: 42,
                borderRadius: 6,
                background: "var(--bg-subtle)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-subtle)",
              }}
            >
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <PlaceholderIcon size={14} />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, font: "500 14px var(--font-sans)", color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </p>
              {p.address && (
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.address}
                </p>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.portfolio.client.name}
              </p>
              <p className="mono-label" style={{ marginTop: 2, fontSize: 10 }}>
                {TYPE_LABEL[p.type] ?? p.type}
              </p>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.city ?? "—"}
            </p>
            <StatusBadge status={p.operationalStatus} />
            <p className="num" style={{ margin: 0, font: "500 13px var(--font-sans)", color: "var(--fg)", textAlign: "right" }}>
              {fmtMoneyCents(p.fiscalValueCents)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function PlaceholderArt({ name }: { name: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, var(--color-pp-100) 0%, var(--color-ink-100) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-pp-700)",
        font: "500 13px var(--font-sans)",
      }}
    >
      {name.slice(0, 24)}
    </div>
  );
}

function PlaceholderIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px dashed var(--border-strong)",
        borderRadius: 12,
        padding: 48,
        textAlign: "center",
      }}
    >
      <p style={{ color: "var(--fg-muted)", margin: "0 0 16px", fontSize: 14 }}>
        No hay propiedades cargadas todavía.
      </p>
      <Link
        href="/propiedades/nueva"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--accent)",
          color: "#fff",
          padding: "0 16px",
          height: 36,
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          border: `1px solid var(--accent)`,
        }}
      >
        Crear la primera
      </Link>
    </div>
  );
}

function NoMatchState() {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 40,
        textAlign: "center",
      }}
    >
      <p style={{ color: "var(--fg-muted)", margin: 0, fontSize: 14 }}>
        Ninguna propiedad coincide con esos filtros.
      </p>
    </div>
  );
}
