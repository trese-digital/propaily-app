/**
 * GET /api/cartografia/colonias/[id]/stats
 *
 * Resumen agregado de la colonia: nº de lotes, área típica, propiedades de
 * Propaily vinculadas. Pensado para enriquecer el inspector del visor.
 */
import { NextResponse, type NextRequest } from "next/server";

// Mezcla queries: public.predios (sin RLS) + propaily.Property.count (con RLS).
// Para la query a propaily usamos withTenant; para catastro basta dbApp.
import { dbApp, withTenant } from "@/server/db/scoped";
import { requireAddon } from "@/server/access/require-addon";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = {
  num_lotes: number | bigint | null;
  area_avg: string | null;
  area_p50: string | null;
  area_min: string | null;
  area_max: string | null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAddon("cartografia");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: { code: "INVALID_UUID", message: "id inválido" } },
      { status: 400 },
    );
  }

  const rows = await dbApp.$queryRaw<Row[]>`
    SELECT
        COUNT(*)                                                       AS num_lotes,
        AVG(area_m2)::text                                             AS area_avg,
        (percentile_cont(0.5) WITHIN GROUP (ORDER BY area_m2))::text   AS area_p50,
        MIN(area_m2)::text                                             AS area_min,
        MAX(area_m2)::text                                             AS area_max
    FROM public.predios
    WHERE colonia_id = ${id}::uuid
      AND area_m2 IS NOT NULL
  `;
  const r = rows[0];

  // Propiedades de Propaily vinculadas a esta colonia. RLS hace que el count
  // sea el del tenant activo, lo que en realidad es lo que queremos para
  // mostrar al cliente ("tienes X propiedades en esta colonia"). Antes el
  // comentario decía "sin filtrar por tenant" pero esa era la lectura cuando
  // el código corría como gfc — ahora con RLS el filtro es automático.
  const numPropiedadesPropaily = await withTenant(gate.managementCompanyId, (tx) =>
    tx.property.count({
      where: { cartoColoniaId: id, deletedAt: null, status: { not: "deleted" } },
    }),
  );

  const num = (v: string | null) => (v == null ? null : Number(v));

  return NextResponse.json({
    num_lotes: r ? Number(r.num_lotes ?? 0) : 0,
    area_avg: r ? num(r.area_avg) : null,
    area_p50: r ? num(r.area_p50) : null,
    area_min: r ? num(r.area_min) : null,
    area_max: r ? num(r.area_max) : null,
    num_propiedades_propaily: numPropiedadesPropaily,
  });
}
