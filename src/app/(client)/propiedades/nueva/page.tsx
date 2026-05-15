import Link from "next/link";

import { requireContext } from "@/server/auth/context";
import { dbApp } from "@/server/db/scoped";
import { listPortfolioOptions } from "@/server/portfolios/list";
import { PropertyForm } from "@/components/property-form";

export default async function NuevaPropiedadPage({
  searchParams,
}: {
  searchParams: Promise<{
    lat?: string;
    lng?: string;
    area?: string;
    predioId?: string;
    coloniaId?: string;
  }>;
}) {
  const sp = await searchParams;
  const ctx = await requireContext();
  const portfolios = await listPortfolioOptions(ctx);

  // Si viene predioId/coloniaId, traemos info del catastro para mostrarla en el form.
  let cartoCtx: {
    coloniaName: string | null;
    sector: number | null;
    valorFiscal: number | null;
    valorComMin: number | null;
    valorComMax: number | null;
  } | null = null;
  if (sp.coloniaId) {
    try {
      // Solo schema public (sin RLS) — dbApp tiene grants suficientes.
      const rows = await dbApp.$queryRaw<
        Array<{
          nombre: string | null;
          sector: number | null;
          valor_fiscal: string | null;
          valor_com_min: string | null;
          valor_com_max: string | null;
        }>
      >`
        SELECT c.nombre, c.sector,
               v.valor_fiscal::text          AS valor_fiscal,
               v.valor_comercial_min::text   AS valor_com_min,
               v.valor_comercial_max::text   AS valor_com_max
        FROM public.colonias c
        LEFT JOIN public.valores_colonia v
               ON v.colonia_id = c.id AND v.ano = 2026
        WHERE c.id = ${sp.coloniaId}::uuid
      `;
      const r = rows[0];
      if (r) {
        cartoCtx = {
          coloniaName: r.nombre,
          sector: r.sector,
          valorFiscal: r.valor_fiscal == null ? null : Number(r.valor_fiscal),
          valorComMin: r.valor_com_min == null ? null : Number(r.valor_com_min),
          valorComMax: r.valor_com_max == null ? null : Number(r.valor_com_max),
        };
      }
    } catch {
      // Silencioso: si falla, dejamos cartoCtx en null.
    }
  }

  // Pre-llenado del valor fiscal estimado si tenemos área + $/m² de la colonia.
  const area = sp.area ? Number(sp.area) : null;
  const estFiscalMxn =
    area != null && cartoCtx?.valorFiscal != null
      ? Math.round(area * cartoCtx.valorFiscal)
      : null;

  return (
    <section className="max-w-3xl mx-auto px-7 py-12">
        <p className="font-mono text-[11px] tracking-widest text-slate uppercase mb-2">
          <Link href="/propiedades" className="hover:text-navy">
            ← Propiedades
          </Link>
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight m-0 mb-2">
          Nueva propiedad
        </h1>
        <p className="text-slate mb-6">
          Datos básicos. Detalles operativos y documentos vienen después.
        </p>

        {cartoCtx ? (
          <div className="bg-navy text-white rounded-xl p-5 mb-6 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-0.5 gfc-bar" />
            <p className="font-mono text-[10px] text-slate-2 tracking-[0.16em] uppercase mb-2">
              Vinculado al catastro
            </p>
            <p className="font-display text-xl font-medium mb-1">
              {cartoCtx.coloniaName ?? "Colonia desconocida"}
            </p>
            <p className="font-mono text-[11px] text-slate-2">
              {cartoCtx.sector != null ? `Sector ${cartoCtx.sector}` : ""}
              {cartoCtx.valorFiscal != null
                ? ` · Fiscal $${cartoCtx.valorFiscal.toLocaleString("es-MX", { maximumFractionDigits: 2 })}/m²`
                : ""}
              {cartoCtx.valorComMin != null && cartoCtx.valorComMax != null
                ? ` · Comercial $${cartoCtx.valorComMin.toLocaleString("es-MX")}–$${cartoCtx.valorComMax.toLocaleString("es-MX")}/m²`
                : ""}
            </p>
            {estFiscalMxn != null ? (
              <p className="font-mono text-[11px] text-lime mt-2">
                Valor fiscal sugerido: $
                {estFiscalMxn.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
              </p>
            ) : null}
          </div>
        ) : null}

        <PropertyForm
          mode="create"
          portfolios={portfolios}
          defaults={{
            name: "",
            portfolioId: portfolios.length === 1 ? portfolios[0].id : "",
            type: "land",
            operationalStatus: "active",
            address: "",
            latitude: sp.lat ?? "",
            longitude: sp.lng ?? "",
            landAreaSqm: sp.area ?? "",
            builtAreaSqm: "",
            fiscalValueMxn: estFiscalMxn != null ? String(estFiscalMxn) : "",
            commercialValueMxn: "",
            insuranceValueMxn: "",
            expectedRentMxn: "",
            internalNotes: "",
            cartoPredioId: sp.predioId ?? "",
            cartoColoniaId: sp.coloniaId ?? "",
          }}
        />
    </section>
  );
}
