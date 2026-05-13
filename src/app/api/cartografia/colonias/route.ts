/**
 * GET /api/cartografia/colonias?bbox=west,south,east,north&ano=2026
 *
 * Reemplaza el endpoint del FastAPI legacy.
 * Devuelve GeoJSON FeatureCollection recortado al bbox.
 */
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/server/db/client";
import { requireUser } from "@/server/auth/require-user";
import { parseBbox } from "@/server/cartografia/bbox";

type Row = {
  id: string;
  sector: number | null;
  colonia: string | null;
  uso_suelo: string | null;
  area_m2: string | null;
  tipo_zona: string | null;
  tipo_zona_norm: string | null;
  descripcion_zona: string | null;
  valor_fiscal: string | null;
  valor_comercial_min: string | null;
  valor_comercial_max: string | null;
  valor_comercial_raw: string | null;
  incremento_pct_vs_anterior: string | null;
  aplica_tramos: boolean | null;
  observacion: string | null;
  geom: unknown;
};

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const parsed = parseBbox(searchParams.get("bbox"));
  if (!parsed.ok) {
    return NextResponse.json(
      { error: { code: parsed.code, message: parsed.message } },
      { status: parsed.code === "BBOX_TOO_LARGE" ? 413 : 400 },
    );
  }
  const ano = Number(searchParams.get("ano") ?? "2026");
  if (!Number.isFinite(ano) || ano < 2020 || ano > 2100) {
    return NextResponse.json(
      { error: { code: "INVALID_YEAR", message: "ano fuera de rango" } },
      { status: 400 },
    );
  }
  const { w, s, e, n } = parsed.bbox;

  const rows = await db.$queryRaw<Row[]>`
    SELECT
        c.id::text                              AS id,
        c.sector,
        c.nombre                                AS colonia,
        c.uso_suelo,
        c.area_m2::text                         AS area_m2,
        v.tipo_zona,
        v.tipo_zona_norm,
        v.descripcion_zona,
        v.valor_fiscal::text                    AS valor_fiscal,
        v.valor_comercial_min::text             AS valor_comercial_min,
        v.valor_comercial_max::text             AS valor_comercial_max,
        v.valor_comercial_raw,
        v.incremento_pct_vs_anterior::text      AS incremento_pct_vs_anterior,
        v.aplica_tramos,
        v.observacion,
        public.ST_AsGeoJSON(c.geom)::json       AS geom
    FROM public.colonias c
    LEFT JOIN public.valores_colonia v
           ON v.colonia_id = c.id AND v.ano = ${ano}
    WHERE public.ST_Intersects(c.geom, public.ST_MakeEnvelope(${w}, ${s}, ${e}, ${n}, 4326))
    ORDER BY c.sector
    LIMIT 2000
  `;

  const num = (v: string | null) => (v == null ? null : Number(v));

  const features = rows.map((r) => {
    const props: Record<string, unknown> = {
      sector: r.sector,
      colonia: r.colonia,
      uso_suelo: r.uso_suelo,
      area_m2: num(r.area_m2),
      tipo_zona: r.tipo_zona,
      tipo_zona_norm: r.tipo_zona_norm,
      descripcion_zona: r.descripcion_zona,
      valor_fiscal: num(r.valor_fiscal),
      valor_comercial_min: num(r.valor_comercial_min),
      valor_comercial_max: num(r.valor_comercial_max),
      valor_comercial_raw: r.valor_comercial_raw,
      incremento_pct_vs_anterior: num(r.incremento_pct_vs_anterior),
      aplica_tramos: r.aplica_tramos,
      observacion: r.observacion,
    };
    for (const k of Object.keys(props)) if (props[k] == null) delete props[k];
    return { type: "Feature" as const, id: r.id, properties: props, geometry: r.geom };
  });

  return NextResponse.json({
    type: "FeatureCollection",
    features,
    bbox: [w, s, e, n],
    count: features.length,
  });
}
