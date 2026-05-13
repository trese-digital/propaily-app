/**
 * GET /api/cartografia/predios?colonia_id=UUID
 *
 * Predios cuya colonia_id coincide (pre-calculado vía ST_Contains).
 */
import { NextResponse, type NextRequest } from "next/server";

import { dbApp } from "@/server/db/scoped";
import { requireAddon } from "@/server/access/require-addon";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = { id: string; area_m2: string | null; geom: unknown };

export async function GET(request: NextRequest) {
  const gate = await requireAddon("cartografia");
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const cid = searchParams.get("colonia_id");
  if (!cid) {
    return NextResponse.json(
      { error: { code: "MISSING_PARAM", message: "Parámetro `colonia_id` obligatorio" } },
      { status: 400 },
    );
  }
  if (!UUID_RE.test(cid)) {
    return NextResponse.json(
      { error: { code: "INVALID_UUID", message: "colonia_id inválido" } },
      { status: 400 },
    );
  }

  const rows = await dbApp.$queryRaw<Row[]>`
    SELECT
        p.id::text                      AS id,
        p.area_m2::text                 AS area_m2,
        public.ST_AsGeoJSON(p.geom)::json AS geom
    FROM public.predios p
    WHERE p.colonia_id = ${cid}::uuid
    LIMIT 5000
  `;

  const features = rows.map((r) => ({
    type: "Feature" as const,
    id: r.id,
    properties: { area_m2: r.area_m2 == null ? null : Number(r.area_m2) },
    geometry: r.geom,
  }));

  return NextResponse.json({
    type: "FeatureCollection",
    features,
    count: features.length,
  });
}
