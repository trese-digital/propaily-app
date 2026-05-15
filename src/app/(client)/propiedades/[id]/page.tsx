import Link from "next/link";
import { notFound } from "next/navigation";

import { withAppScope } from "@/server/db/scoped";
import { appScope, requireContext } from "@/server/auth/context";
import { DocumentsSection, type DocumentRow } from "./documents-section";
import { CoverPhoto } from "./cover-photo";
import { PhotoGallery, type PhotoRow } from "./photo-gallery";
import { UnitsSection, type UnitRow } from "./units-section";
import { getPropertyCoverUrl } from "@/server/properties/cover-photo";
import { getPhotoUrl } from "@/server/properties/photos";

const TYPE_LABEL: Record<string, string> = {
  land: "Terreno",
  house: "Casa habitación",
  apartment: "Departamento",
  commercial_space: "Local comercial",
  office: "Oficina",
  warehouse: "Bodega",
  industrial: "Industrial",
  other: "Otro",
};

function fmtMoneyCents(c: bigint | null) {
  if (c == null) return "—";
  const n = Number(c) / 100;
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

function fmtArea(d: string | null) {
  if (d == null) return "—";
  const n = Number(d);
  if (!Number.isFinite(n)) return "—";
  if (n >= 10000) return `${(n / 10000).toFixed(2)} ha`;
  return `${n.toLocaleString("es-MX", { maximumFractionDigits: 2 })} m²`;
}

export default async function PropiedadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireContext();
  const { id } = await params;

  const p = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        portfolio: { include: { client: true } },
        units: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
      },
    }),
  );
  if (!p) notFound();

  const unitRows: UnitRow[] = p.units.map((u) => ({
    id: u.id,
    name: u.name,
    type: u.type,
    areaSqm: u.areaSqm?.toString() ?? null,
    monthlyRentCents: u.monthlyRentCents,
    currentTenantName: u.currentTenantName,
    operationalStatus: u.operationalStatus,
    internalNotes: u.internalNotes,
  }));

  type CartoRow = {
    colonia: string | null;
    sector: number | null;
    tipo_zona: string | null;
    descripcion_zona: string | null;
    valor_fiscal: string | null;
    valor_com_min: string | null;
    valor_com_max: string | null;
    predio_area: string | null;
  };
  // El catastro (schema public) no tiene RLS — no requiere withTenant.
  // Pero el catastroId que viajamos ya viene de p, que SÍ pasó por RLS arriba,
  // así que esta query catastral es segura.
  const { carto, documents, photos } = await withAppScope(
    appScope(ctx),
    async (tx) => {
      let carto: CartoRow | null = null;
      if (p.cartoColoniaId || p.cartoPredioId) {
        const rows = await tx.$queryRaw<CartoRow[]>`
          SELECT
            c.nombre                              AS colonia,
            c.sector,
            v.tipo_zona,
            v.descripcion_zona,
            v.valor_fiscal::text                  AS valor_fiscal,
            v.valor_comercial_min::text           AS valor_com_min,
            v.valor_comercial_max::text           AS valor_com_max,
            pr.area_m2::text                      AS predio_area
          FROM public.colonias c
          LEFT JOIN public.valores_colonia v
                 ON v.colonia_id = c.id AND v.ano = 2026
          LEFT JOIN public.predios pr
                 ON pr.id = ${p.cartoPredioId ?? null}::uuid
          WHERE c.id = ${p.cartoColoniaId ?? null}::uuid
          LIMIT 1
        `;
        carto = rows[0] ?? null;
      }

      const documents = await tx.document.findMany({
        where: { propertyId: p.id, status: { not: "deleted" }, deletedAt: null },
        include: { versions: { orderBy: { version: "desc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
      });

      const photos = await tx.propertyPhoto.findMany({
        where: { propertyId: p.id },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      });
      return { carto, documents, photos };
    },
  );
  const documentRows: DocumentRow[] = documents.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    sensitivity: d.sensitivity,
    createdAt: d.createdAt.toISOString(),
    versions: d.versions.map((v) => ({
      fileName: v.fileName,
      sizeBytes: v.sizeBytes,
      contentType: v.contentType,
    })),
  }));

  const hasGeo = p.latitude != null && p.longitude != null;
  const mapHref = hasGeo
    ? (`/cartografia?lat=${p.latitude}&lng=${p.longitude}` as const)
    : null;

  const coverUrl = p.coverPhotoStorageKey
    ? await getPropertyCoverUrl(p.coverPhotoStorageKey)
    : null;

  const photoUrls = await Promise.all(photos.map((ph) => getPhotoUrl(ph.storageKey)));
  const photoRows: PhotoRow[] = photos.map((ph, i) => ({
    id: ph.id,
    url: photoUrls[i],
    caption: ph.caption,
  }));

  const num = (v: string | null | undefined) => (v == null ? null : Number(v));
  const cartoValorFiscal = num(carto?.valor_fiscal ?? null);
  const cartoArea = num(carto?.predio_area ?? null);
  const fiscalSugerido =
    cartoValorFiscal != null && cartoArea != null
      ? Math.round(cartoValorFiscal * cartoArea)
      : null;

  const statusTone =
    p.operationalStatus === "active" || p.operationalStatus === "rented"
      ? { bg: "rgba(16,185,129,0.16)", fg: "#fff", dot: "var(--color-ok)" }
      : { bg: "rgba(255,255,255,0.16)", fg: "#fff", dot: "var(--color-ink-300)" };

  return (
    <section>
      {/* Hero — cover + meta overlay */}
      <div style={{ position: "relative", height: 320, background: "var(--color-ink-100)" }}>
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={p.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, var(--color-pp-100) 0%, var(--color-ink-100) 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(14,10,22,0.0) 35%, rgba(14,10,22,0.7) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 28,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#fff",
          }}
        >
          <Link
            href="/propiedades"
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              padding: "5px 10px",
              borderRadius: 6,
              background: "rgba(14,10,22,0.45)",
              backdropFilter: "blur(8px)",
            }}
          >
            ← Propiedades
          </Link>
        </div>

        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            bottom: 22,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            color: "#fff",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 9px",
                borderRadius: 999,
                background: statusTone.bg,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                backdropFilter: "blur(6px)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 999, background: statusTone.dot }} />
              {p.operationalStatus === "active" ? "Activa" : p.operationalStatus}
            </span>
            <h1
              style={{
                margin: "10px 0 6px",
                font: "600 32px var(--font-sans)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              {p.name}
            </h1>
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                letterSpacing: "0.04em",
              }}
            >
              <span>{TYPE_LABEL[p.type] ?? p.type}</span>
              <span>· {p.portfolio.client.name}</span>
              {p.city && <span>· {p.city}</span>}
              {carto && <span>· Vinculada al catastro ✓</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {hasGeo && mapHref && (
              <Link
                href={mapHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontSize: 13,
                  fontWeight: 500,
                  backdropFilter: "blur(6px)",
                  whiteSpace: "nowrap",
                }}
              >
                Ver en mapa
              </Link>
            )}
            <Link
              href={`/propiedades/${p.id}/editar` as never}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 34,
                padding: "0 14px",
                borderRadius: 8,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                boxShadow: "var(--shadow-sm)",
                whiteSpace: "nowrap",
              }}
            >
              Editar
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 28px 56px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 24 }}>
        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          {/* Catastro panel */}
          {carto ? (
            <Panel title="Catastro vinculado" hint="área real prevalece sobre catastro">
              <div style={{ marginBottom: 14 }}>
                <div style={{ font: "600 17px var(--font-sans)", color: "var(--fg)" }}>
                  {carto.colonia ?? "—"}
                </div>
                <div className="mono-label" style={{ marginTop: 4 }}>
                  {carto.sector != null ? `Sector ${carto.sector}` : ""}
                  {carto.tipo_zona ? ` · ${carto.tipo_zona}` : ""}
                  {carto.descripcion_zona ? ` · ${carto.descripcion_zona}` : ""}
                </div>
              </div>
              <StatGrid>
                <Stat
                  k="Fiscal $/m²"
                  v={cartoValorFiscal != null ? `$${cartoValorFiscal.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` : "—"}
                />
                <Stat
                  k="Área catastro (ref.)"
                  v={cartoArea != null ? `${cartoArea.toLocaleString("es-MX", { maximumFractionDigits: 2 })} m²` : "—"}
                />
                <Stat
                  k="Comercial $/m²"
                  v={
                    num(carto.valor_com_min) != null
                      ? `$${num(carto.valor_com_min)?.toLocaleString("es-MX")}–$${num(carto.valor_com_max)?.toLocaleString("es-MX")}`
                      : "—"
                  }
                />
                {fiscalSugerido != null && (
                  <Stat
                    k="Fiscal sugerido"
                    v={`$${fiscalSugerido.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`}
                    highlight
                  />
                )}
              </StatGrid>
              <p className="mono" style={{ marginTop: 14, fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.5 }}>
                ⓘ La lotificación catastral es aproximada. La superficie real registrada
                ({p.landAreaSqm ? `${Number(p.landAreaSqm).toLocaleString("es-MX")} m²` : "—"})
                es la que se usa para los cálculos de valuación.
              </p>
            </Panel>
          ) : (
            <div
              style={{
                background: "var(--accent-soft)",
                border: "1px dashed var(--color-pp-300)",
                borderRadius: 12,
                padding: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <span className="mono-label" style={{ color: "var(--color-pp-700)" }}>
                  Sin vincular al catastro
                </span>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-pp-700)" }}>
                  Vincula esta propiedad con su lote para traer valores fiscales y dimensiones.
                </p>
              </div>
              <Link
                href={`/cartografia?linkProperty=${p.id}` as never}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 8,
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Vincular con lote
              </Link>
            </div>
          )}

          {/* Datos generales */}
          <Panel title="Datos">
            <StatGrid>
              <Stat k="Tipo" v={TYPE_LABEL[p.type] ?? p.type} />
              <Stat k="Estado operativo" v={p.operationalStatus} />
              <Stat k="Superficie terreno" v={fmtArea(p.landAreaSqm?.toString() ?? null)} />
              <Stat k="Superficie construida" v={fmtArea(p.builtAreaSqm?.toString() ?? null)} />
              <Stat k="Latitud" v={p.latitude?.toString() ?? "—"} />
              <Stat k="Longitud" v={p.longitude?.toString() ?? "—"} />
              <Stat k="Valor seguro" v={fmtMoneyCents(p.insuranceValueCents)} />
              <Stat k="Renta esperada" v={fmtMoneyCents(p.expectedRentCents)} />
            </StatGrid>
            {p.internalNotes && (
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <span className="mono-label">Notas internas</span>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--fg)", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
                  {p.internalNotes}
                </p>
              </div>
            )}
          </Panel>

          {/* Foto principal — para subir/cambiar */}
          <Panel title="Foto principal">
            <CoverPhoto propertyId={p.id} coverUrl={coverUrl} propertyName={p.name} />
          </Panel>

          <PhotoGallery propertyId={p.id} photos={photoRows} />

          <UnitsSection propertyId={p.id} units={unitRows} />

          <DocumentsSection propertyId={p.id} documents={documentRows} />
        </div>

        {/* Side rail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80, alignSelf: "flex-start" }}>
          <ValueCard label="Valor fiscal" value={fmtMoneyCents(p.fiscalValueCents)} primary />
          <ValueCard label="Valor comercial" value={fmtMoneyCents(p.commercialValueCents)} />

          {hasGeo && (
            <Panel title="Ubicación" actions={mapHref ? <MiniLink href={mapHref}>Abrir lote</MiniLink> : null}>
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
                <span>LAT {p.latitude?.toString()}</span>
                <span>LON {p.longitude?.toString()}</span>
                {p.address && <span style={{ color: "var(--fg)", fontFamily: "var(--font-sans)", letterSpacing: 0, marginTop: 6, fontSize: 13 }}>{p.address}</span>}
              </div>
            </Panel>
          )}

          <Panel title="Equipo">
            <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)" }}>
              {ctx.user.name ?? ctx.user.email}
              <br />
              <span className="mono-label">{ctx.membership.role}</span>
            </p>
          </Panel>
        </aside>
      </div>
    </section>
  );
}

/* ── Helpers ───────────────────────────────────── */

function Panel({
  title,
  hint,
  actions,
  children,
}: {
  title: string;
  hint?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
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
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "600 14px var(--font-sans)", color: "var(--fg)", letterSpacing: "-0.005em" }}>
            {title}
          </div>
          {hint && <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
        {actions}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 14,
      }}
    >
      {children}
    </div>
  );
}

function Stat({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div>
      <span className="mono-label">{k}</span>
      <div
        className="num"
        style={{
          marginTop: 4,
          font: "500 14px var(--font-sans)",
          color: highlight ? "var(--color-pp-700)" : "var(--fg)",
          letterSpacing: "-0.005em",
          wordBreak: "break-word",
        }}
      >
        {v}
      </div>
    </div>
  );
}

function ValueCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div
      style={{
        background: primary ? "var(--color-ink-900)" : "var(--bg)",
        color: primary ? "#fff" : "var(--fg)",
        border: primary ? "none" : "1px solid var(--border)",
        borderRadius: 12,
        padding: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {primary && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 3,
            background: "linear-gradient(90deg, var(--color-pp-700) 0%, var(--color-pp-500) 50%, var(--color-pp-300) 100%)",
          }}
        />
      )}
      <span
        className="mono-label"
        style={{ color: primary ? "rgba(255,255,255,0.55)" : "var(--fg-muted)" }}
      >
        {label}
      </span>
      <div
        className="num"
        style={{
          marginTop: 8,
          font: "600 26px var(--font-sans)",
          letterSpacing: "-0.025em",
          color: primary ? "#fff" : "var(--fg)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href as never}
      className="mono"
      style={{
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-pp-700)",
      }}
    >
      {children}
    </Link>
  );
}
