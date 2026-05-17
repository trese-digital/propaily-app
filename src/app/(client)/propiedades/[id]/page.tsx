import Link from "next/link";
import { notFound } from "next/navigation";

import { withAppScope } from "@/server/db/scoped";
import { appScope, requireContext } from "@/server/auth/context";
import { DocumentsSection, type DocumentRow } from "./documents-section";
import { CoverPhoto } from "./cover-photo";
import { PhotoGallery, type PhotoRow } from "./photo-gallery";
import { UnitsSection, type UnitRow } from "./units-section";
import {
  ValuationsSection,
  type OpenRequest,
  type ValuationItem,
} from "./valuations-section";
import { getPropertyCoverUrl } from "@/server/properties/cover-photo";
import { getPhotoUrl } from "@/server/properties/photos";
import { formatPropertyTitleValueFull } from "@/lib/property-value";
import { Badge, type BadgeTone, Button, Card, CardHeader, CardBody, Kpi } from "@/components/ui";

const VALUATION_TYPE_LABEL: Record<string, string> = {
  professional: "Profesional GF",
  commercial: "Comercial",
  fiscal: "Fiscal",
  insurance: "Seguro",
  manual: "Manual",
};

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
  const { carto, documents, photos, valuations, openReq } = await withAppScope(
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

      const valuations = await tx.valuation.findMany({
        where: { propertyId: p.id, deletedAt: null },
        orderBy: { valuationDate: "desc" },
      });

      const openReq = await tx.valuationRequest.findFirst({
        where: { propertyId: p.id, status: { in: ["pending", "in_progress"] } },
        orderBy: { createdAt: "desc" },
      });
      return { carto, documents, photos, valuations, openReq };
    },
  );

  const valuationItems: ValuationItem[] = valuations.map((v) => ({
    id: v.id,
    typeLabel: VALUATION_TYPE_LABEL[v.type] ?? v.type,
    valueLabel: fmtMoneyCents(v.valueCents),
    dateLabel: v.valuationDate.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    source: v.source,
    isOfficial: v.isOfficial,
  }));

  const openRequest: OpenRequest | null = openReq
    ? {
        id: openReq.id,
        statusLabel: openReq.status === "in_progress" ? "En progreso" : "Pendiente",
        tone: openReq.status === "in_progress" ? "info" : "warn",
        createdLabel: openReq.createdAt.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        cancelable: openReq.status === "pending",
      }
    : null;
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

  const getStatusBadgeTone = (status: string): BadgeTone => {
    if (status === "active" || status === "rented") return "ok";
    if (status === "available") return "info";
    if (status === "reserved") return "violet";
    if (status === "inactive") return "neutral";
    return "warn";
  };

  return (
    <section>
      {/* Hero — cover + meta overlay */}
      <div className="relative h-80 bg-ink-100">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pp-100 to-ink-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900/70" />
        <div className="absolute top-[18px] left-7 flex items-center gap-2 text-white">
          <Link
            href="/propiedades"
            className="mono text-[11px] tracking-[0.12em] uppercase text-white/80 px-[10px] py-[5px] rounded-md bg-ink-900/45 backdrop-blur-md hover:text-white/90 transition-colors"
          >
            ← Propiedades
          </Link>
        </div>

        <div className="absolute left-7 right-7 bottom-[22px] flex items-end justify-between gap-6 text-white">
          <div className="min-w-0">
            <Badge
              tone={getStatusBadgeTone(p.operationalStatus)}
              className="mb-[10px] backdrop-blur-md"
            >
              {p.operationalStatus === "active" ? "Activa" : p.operationalStatus}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-[-0.025em] leading-tight mb-1.5">
              {p.name}
            </h1>
            <div className="mono text-xs text-white/85 flex gap-4 flex-wrap tracking-wider">
              <span>{TYPE_LABEL[p.type] ?? p.type}</span>
              <span>· {p.portfolio.client.name}</span>
              {p.city && <span>· {p.city}</span>}
              {carto && <span>· Vinculada al catastro ✓</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {hasGeo && mapHref && (
              <Link
                href={mapHref}
                className="inline-flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium tracking-[-0.005em] transition-colors cursor-pointer rounded-lg bg-transparent text-white border border-white/25 hover:bg-white/10 backdrop-blur-md"
              >
                Ver en mapa
              </Link>
            )}
            <Link
              href={`/propiedades/${p.id}/editar` as never}
              className="inline-flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium tracking-[-0.005em] transition-colors cursor-pointer rounded-lg bg-pp-500 text-white border border-transparent hover:bg-pp-600 shadow-[0_1px_2px_rgba(27,8,83,0.2)]"
            >
              Editar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-7 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        {/* Main column */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Catastro panel */}
          {carto ? (
            <Card>
              <CardHeader
                title="Catastro vinculado"
                action={<span className="text-xs text-ink-500">área real prevalece sobre catastro</span>}
              />
              <CardBody>
                <div className="mb-3.5">
                  <div className="text-[17px] font-semibold text-ink-900">
                    {carto.colonia ?? "—"}
                  </div>
                  <div className="mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mt-1">
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
                <p className="mono text-[11px] text-ink-500 mt-3.5 leading-relaxed">
                  ⓘ La lotificación catastral es aproximada. La superficie real registrada
                  ({p.landAreaSqm ? `${Number(p.landAreaSqm).toLocaleString("es-MX")} m²` : "—"})
                  es la que se usa para los cálculos de valuación.
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="bg-pp-50 border border-dashed border-pp-300 rounded-xl p-4.5 flex items-center justify-between gap-4">
              <div>
                <span className="mono text-[11px] uppercase tracking-[0.1em] text-pp-700">
                  Sin vincular al catastro
                </span>
                <p className="mt-1 text-sm text-pp-700">
                  Vincula esta propiedad con su lote para traer valores fiscales y dimensiones.
                </p>
              </div>
              <Link
                href={`/cartografia?linkProperty=${p.id}` as never}
                className="inline-flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium tracking-[-0.005em] transition-colors cursor-pointer rounded-lg bg-pp-500 text-white border border-transparent hover:bg-pp-600 shadow-[0_1px_2px_rgba(27,8,83,0.2)] whitespace-nowrap"
              >
                Vincular con lote
              </Link>
            </div>
          )}

          {/* Datos generales */}
          <Card>
            <CardHeader title="Datos" />
            <CardBody>
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
                <div className="mt-4.5 pt-3.5 border-t border-ink-100">
                  <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink-500">Notas internas</span>
                  <p className="mt-1.5 text-sm text-ink-900 whitespace-pre-wrap leading-relaxed">
                    {p.internalNotes}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Foto principal — para subir/cambiar */}
          <Card>
            <CardHeader title="Foto principal" />
            <CardBody>
              <CoverPhoto propertyId={p.id} coverUrl={coverUrl} propertyName={p.name} />
            </CardBody>
          </Card>

          <PhotoGallery propertyId={p.id} photos={photoRows} />

          <UnitsSection propertyId={p.id} units={unitRows} />

          <ValuationsSection
            propertyId={p.id}
            valuations={valuationItems}
            openRequest={openRequest}
          />

          <DocumentsSection propertyId={p.id} documents={documentRows} />
        </div>

        {/* Side rail */}
        <aside className="flex flex-col gap-3.5 sticky top-20 self-start">
          <ValueCard label="Valor estimado" value={formatPropertyTitleValueFull(p)} primary />
          <ValueCard label="Valor fiscal" value={fmtMoneyCents(p.fiscalValueCents)} />

          {hasGeo && (
            <Card>
              <CardHeader
                title="Ubicación"
                action={mapHref ? <MiniLink href={mapHref}>Abrir lote</MiniLink> : null}
              />
              <CardBody>
                <div className="mono text-xs text-ink-500 flex flex-col gap-1">
                  <span>LAT {p.latitude?.toString()}</span>
                  <span>LON {p.longitude?.toString()}</span>
                  {p.address && (
                    <span className="text-ink-900 font-sans tracking-normal mt-1.5 text-sm">
                      {p.address}
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Equipo" />
            <CardBody>
              <p className="m-0 text-sm text-ink-500">
                {ctx.user.name ?? ctx.user.email}
                <br />
                <span className="mono text-[11px] uppercase tracking-[0.1em]">{ctx.membership.role}</span>
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </section>
  );
}

/* ── Helpers ───────────────────────────────────── */

function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
      {children}
    </div>
  );
}

function Stat({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div>
      <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink-500">{k}</span>
      <div
        className={`num mt-1 font-medium text-sm tracking-[-0.005em] break-words ${
          highlight ? "text-pp-700" : "text-ink-900"
        }`}
      >
        {v}
      </div>
    </div>
  );
}

function ValueCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4.5 ${
        primary
          ? "bg-ink-900 text-white border-0"
          : "bg-white text-ink-900 border border-ink-100"
      }`}
    >
      {primary && (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pp-700 via-pp-500 to-pp-300"
        />
      )}
      <span
        className={`mono text-[11px] uppercase tracking-[0.1em] ${
          primary ? "text-white/55" : "text-ink-500"
        }`}
      >
        {label}
      </span>
      <div
        className={`num mt-2 text-[26px] font-semibold tracking-[-0.025em] ${
          primary ? "text-white" : "text-ink-900"
        }`}
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
      className="mono text-[11px] tracking-[0.08em] uppercase text-pp-700 hover:text-pp-800 transition-colors"
    >
      {children}
    </Link>
  );
}
