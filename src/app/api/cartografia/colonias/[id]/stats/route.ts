/**
 * GET /api/cartografia/colonias/[id]/stats
 *
 * Resumen agregado de la colonia: nº de lotes, área típica, propiedades de
 * Propaily vinculadas. Pensado para enriquecer el inspector del visor.
 */
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/server/db/client";
import { requireUser } from "@/server/auth/require-user";

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
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json(
      { error: { code: "INVALID_UUID", message: "id inválido" } },
      { status: 400 },
    );
  }

  const rows = await db.$queryRaw<Row[]>`
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

  // Propiedades de Propaily vinculadas a esta colonia (sin filtrar por tenant
  // porque estas estadísticas son del catastro público, no de un cliente).
  const numPropiedadesPropaily = await db.property.count({
    where: { cartoColoniaId: id, deletedAt: null, status: { not: "deleted" } },
  });

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
