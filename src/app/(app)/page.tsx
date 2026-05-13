import Link from "next/link";

import { db } from "@/server/db/client";
import { requireContext } from "@/server/auth/context";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatMxn(cents: bigint | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
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

export default async function HomePage() {
  const ctx = await requireContext();
  const companyFilter = {
    portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
  };

  const [propertyCount, portfolioCount, documentCount, recentProperties, valueAgg] =
    await Promise.all([
      db.property.count({ where: { ...companyFilter, deletedAt: null } }),
      db.portfolio.count({
        where: { client: { managementCompanyId: ctx.membership.managementCompanyId }, deletedAt: null },
      }),
      db.document.count({
        where: { property: { ...companyFilter, deletedAt: null }, deletedAt: null },
      }),
      db.property.findMany({
        where: { ...companyFilter, deletedAt: null },
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
          coverPhotoStorageKey: true,
        },
      }),
      db.property.aggregate({
        where: { ...companyFilter, deletedAt: null },
        _sum: { currentValueCents: true, fiscalValueCents: true },
      }),
    ]);

  const totalValue =
    valueAgg._sum.currentValueCents ?? valueAgg._sum.fiscalValueCents ?? 0n;

  return (
    <section style={{ padding: "28px 32px 56px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <span className="mono-label">{dateFmt.format(new Date())}</span>
        <h1
          style={{
            margin: "8px 0 8px",
            font: "600 32px/1.1 var(--font-sans)",
            letterSpacing: "-0.025em",
            color: "var(--fg)",
          }}
        >
          {greeting()}, {ctx.user.name?.split(" ")[0] ?? "Pablo"}.
        </h1>
        <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: 14, lineHeight: 1.55, maxWidth: 720 }}>
          {ctx.membership.managementCompanyName} · {propertyCount} propiedad
          {propertyCount === 1 ? "" : "es"} activa{propertyCount === 1 ? "" : "s"} en {portfolioCount}{" "}
          portafolio{portfolioCount === 1 ? "" : "s"}.
        </p>
      </div>

      {/* KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <Kpi label="Valor estimado" value={formatMxn(totalValue)} suffix="MXN · portafolio" spark />
        <Kpi label="Propiedades" value={numFmt.format(propertyCount)} suffix={`en ${portfolioCount} portafolio${portfolioCount === 1 ? "" : "s"}`} />
        <Kpi label="Documentos" value={numFmt.format(documentCount)} suffix="en biblioteca" />
        <Kpi label="Renta mensual" value="—" suffix="por configurar" muted />
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {/* Map preview */}
        <Card>
          <CardHeader title="Mapa del portafolio" subtitle={`${propertyCount} propiedad${propertyCount === 1 ? "" : "es"}`}>
            <Link
              href="/cartografia"
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--color-pp-700)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Abrir cartografía →
            </Link>
          </CardHeader>
          <div style={{ position: "relative", height: 320, overflow: "hidden", borderRadius: "0 0 10px 10px" }}>
            <MapPreview />
          </div>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader title="Accesos rápidos" />
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <QuickLink
              href="/propiedades/nueva"
              label="Crear propiedad"
              hint="Desde cero o desde un lote"
            />
            <QuickLink
              href="/propiedades"
              label="Ver portafolio"
              hint={`${propertyCount} en total`}
            />
            <QuickLink
              href="/cartografia"
              label="Explorar cartografía"
              hint="León, Gto · 1,507 colonias"
            />
          </div>

          <div
            style={{
              margin: 12,
              marginTop: "auto",
              padding: 14,
              borderRadius: 10,
              border: "1px solid var(--color-pp-200)",
              background: "var(--accent-soft)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--color-pp-500)",
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--color-pp-700)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Insights · próximamente
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-pp-700)", opacity: 0.85, lineHeight: 1.5 }}>
              Comparativos de rendimiento por colonia y servicios cercanos.
            </p>
          </div>
        </Card>
      </div>

      {/* Recent properties */}
      <Card>
        <CardHeader title="Propiedades recientes">
          <Link
            href="/propiedades"
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--color-pp-700)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Ver todas ({propertyCount}) →
          </Link>
        </CardHeader>
        {recentProperties.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--fg-muted)", fontSize: 14 }}>
            Aún no tienes propiedades.{" "}
            <Link href="/propiedades/nueva" style={{ color: "var(--color-pp-700)", fontWeight: 500 }}>
              Crear la primera →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
              padding: 16,
            }}
          >
            {recentProperties.map((p) => (
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

/* ── Sub-componentes locales ───────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "14px 16px 12px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ font: "600 14px var(--font-sans)", color: "var(--fg)", letterSpacing: "-0.005em" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  suffix,
  spark,
  muted,
}: {
  label: string;
  value: string;
  suffix: string;
  spark?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        position: "relative",
        overflow: "hidden",
        opacity: muted ? 0.7 : 1,
      }}
    >
      <span className="mono-label">{label}</span>
      <div
        className="num"
        style={{
          marginTop: 8,
          font: "600 26px/1 var(--font-sans)",
          letterSpacing: "-0.02em",
          color: muted ? "var(--fg-muted)" : "var(--fg)",
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--fg-muted)" }}>{suffix}</div>
      {spark && (
        <svg
          viewBox="0 0 100 24"
          style={{ position: "absolute", right: 12, bottom: 14, width: 80, height: 24, opacity: 0.7 }}
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-pp-500)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-pp-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,20 L12,18 L24,19 L36,14 L48,15 L60,10 L72,12 L84,6 L100,4 L100,24 L0,24 Z"
            fill="url(#sparkGrad)"
          />
          <path
            d="M0,20 L12,18 L24,19 L36,14 L48,15 L60,10 L72,12 L84,6 L100,4"
            stroke="var(--color-pp-500)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

function QuickLink({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <Link
      href={href as never}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--bg-muted)",
        transition: "border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)",
      }}
      className="hover:border-(--color-pp-300) hover:bg-(--accent-soft)"
    >
      <div style={{ flex: 1 }}>
        <div style={{ font: "500 13px var(--font-sans)", color: "var(--fg)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>{hint}</div>
      </div>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg-subtle)" }}>
        <path d="m9 6 6 6-6 6" />
      </svg>
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
  const statusLabel =
    status === "active" ? "Activa" : status === "vacant" ? "Vacante" : status === "rented" ? "Rentada" : status;
  const statusTone =
    status === "active" || status === "rented"
      ? { bg: "rgba(16,185,129,0.12)", fg: "#065F46", dot: "var(--color-ok)" }
      : { bg: "var(--bg-subtle)", fg: "var(--fg-muted)", dot: "var(--color-ink-400)" };

  return (
    <Link
      href={`/propiedades/${id}` as never}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--bg)",
        transition: "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
      }}
      className="hover:border-(--color-pp-300) hover:shadow-sm"
    >
      <div
        style={{
          height: 80,
          background:
            "linear-gradient(135deg, var(--color-pp-100) 0%, var(--color-ink-100) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-pp-700)",
          font: "500 13px var(--font-sans)",
        }}
      >
        {name.slice(0, 24)}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <span style={{ font: "500 13px var(--font-sans)", color: "var(--fg)" }}>{name}</span>
          <span className="mono num" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
            {formatMxn(value)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-muted)" }}>
            {city ?? "—"}
            {area ? ` · ${numFmt.format(Math.round(area.toNumber()))} m²` : ""}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "2px 7px",
              borderRadius: 999,
              background: statusTone.bg,
              color: statusTone.fg,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 999, background: statusTone.dot }} />
            {statusLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

function MapPreview() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, rgba(110,58,255,0.04) 0%, rgba(110,58,255,0) 60%), var(--color-ink-50)",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 800 320" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="block" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="var(--color-ink-25)" />
            <path d="M0 0 L80 0 M0 0 L0 80" stroke="var(--color-ink-200)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="320" fill="url(#block)" opacity="0.7" />
        <path d="M0,140 Q400,120 800,180" stroke="var(--color-ink-300)" strokeWidth="5" fill="none" opacity="0.7" />
        <path d="M200,0 Q220,160 280,320" stroke="var(--color-ink-300)" strokeWidth="5" fill="none" opacity="0.6" />
        <path d="M520,0 Q540,200 600,320" stroke="var(--color-ink-300)" strokeWidth="3" fill="none" opacity="0.45" />
        <path d="M120,60 L320,70 L340,210 L140,200 Z" fill="rgba(110,58,255,0.16)" stroke="var(--color-pp-500)" strokeWidth="1.5" />
        <path d="M380,90 L580,80 L600,240 L390,250 Z" fill="rgba(110,58,255,0.08)" stroke="var(--color-pp-500)" strokeWidth="1" opacity="0.7" />
      </svg>
      {[
        [28, 38],
        [60, 52],
        [44, 68],
        [72, 28],
        [16, 72],
      ].map(([x, y], i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -100%) rotate(-45deg)",
            width: 18,
            height: 18,
            borderRadius: "50% 50% 50% 2px / 50% 50% 50% 2px",
            background: "var(--color-pp-500)",
            boxShadow: "0 4px 10px rgba(110,58,255,0.35)",
            border: "2px solid #fff",
          }}
        />
      ))}
      <span
        className="mono"
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          fontSize: 10,
          color: "var(--fg-muted)",
          background: "rgba(255,255,255,0.75)",
          padding: "3px 7px",
          borderRadius: 4,
        }}
      >
        © OpenStreetMap · Propaily
      </span>
    </div>
  );
}
