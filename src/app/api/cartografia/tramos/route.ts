/**
 * GET /api/cartografia/tramos?bbox=&ano=2026
 * LineStrings con su valor fiscal/comercial dentro del bbox.
 */
import { NextResponse, type NextRequest } from "next/server";

import { dbApp } from "@/server/db/scoped";
import { parseBbox } from "@/server/cartografia/bbox";
import { requireAddon } from "@/server/access/require-addon";

type Row = {
  id: string;
  sector: number | null;
  vialidad: string | null;
  via_codigo: string | null;
  tramo_desc: string | null;
  tramo_code: string | null;
  valor_fiscal: string | null;
  valor_comercial_min: string | null;
  valor_comercial_max: string | null;
  valor_comercial_raw: string | null;
  incremento_pct_vs_anterior: string | null;
  observacion: string | null;
  geom: unknown;
};

export async function GET(request: NextRequest) {
  const gate = await requireAddon("cartografia");
  if (!gate.ok) return gate.response;

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

  const rows = await dbApp.$queryRaw<Row[]>`
    SELECT
        t.id::text                              AS id,
        t.sector,
        t.vialidad,
        t.via_codigo,
        t.tramo_desc,
        t.tramo_code,
        v.valor_fiscal::text                    AS valor_fiscal,
        v.valor_comercial_min::text             AS valor_comercial_min,
        v.valor_comercial_max::text             AS valor_comercial_max,
        v.valor_comercial_raw,
        v.incremento_pct_vs_anterior::text      AS incremento_pct_vs_anterior,
        v.observacion,
        public.ST_AsGeoJSON(t.geom)::json       AS geom
    FROM public.tramos t
    LEFT JOIN public.valores_tramo v
           ON v.tramo_id = t.id AND v.ano = ${ano}
    WHERE public.ST_Intersects(t.geom, public.ST_MakeEnvelope(${w}, ${s}, ${e}, ${n}, 4326))
    ORDER BY t.vialidad
    LIMIT 2000
  `;

  const num = (v: string | null) => (v == null ? null : Number(v));

  const features = rows.map((r) => {
    const props: Record<string, unknown> = {
      vialidad: r.vialidad,
      via_codigo: r.via_codigo,
      tramo_desc: r.tramo_desc,
      tramo_code: r.tramo_code,
      sector: r.sector,
      valor_fiscal: num(r.valor_fiscal),
      valor_comercial_min: num(r.valor_comercial_min),
      valor_comercial_max: num(r.valor_comercial_max),
      valor_comercial_raw: r.valor_comercial_raw,
      incremento_pct_vs_anterior: num(r.incremento_pct_vs_anterior),
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
