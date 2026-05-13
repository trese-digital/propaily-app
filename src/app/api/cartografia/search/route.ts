/**
 * GET /api/cartografia/search?q=...&limit=10
 *
 * Autocomplete unificado sobre colonias + tramos (vialidad).
 */
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/server/db/client";
import { requireAddon } from "@/server/access/require-addon";

type Row = {
  rank: number;
  type: "colonia" | "tramo";
  id: string;
  label: string | null;
  sublabel: string | null;
  lat: string | null;
  lng: string | null;
  bbox_geom: string | null;
};

export async function GET(request: NextRequest) {
  const gate = await requireAddon("cartografia");
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json(
      { error: { code: "QUERY_TOO_SHORT", message: "`q` requiere al menos 2 caracteres" } },
      { status: 400 },
    );
  }
  const limitParam = Number(searchParams.get("limit") ?? "10");
  const limit = Math.min(25, Math.max(1, Number.isFinite(limitParam) ? limitParam : 10));
  const like = `%${q}%`;
  const prefix = `${q}%`;

  const rows = await db.$queryRaw<Row[]>`
    WITH col AS (
        SELECT
          CASE
            WHEN c.nombre ILIKE ${prefix} THEN 0
            WHEN c.sector::text = ${q} THEN 0
            WHEN c.sector::text ILIKE ${like} THEN 1
            ELSE 1
          END AS rank,
          'colonia'::text          AS type,
          c.id::text               AS id,
          c.nombre                 AS label,
          ('Sector ' || c.sector::text)::text AS sublabel,
          public.ST_Y(c.centroide)::text  AS lat,
          public.ST_X(c.centroide)::text  AS lng,
          public.ST_AsGeoJSON(public.ST_Envelope(c.geom))::text AS bbox_geom
        FROM public.colonias c
        WHERE c.nombre ILIKE ${like}
           OR c.sector::text ILIKE ${like}
        LIMIT ${limit}
    ),
    tr AS (
        SELECT
          CASE WHEN t.vialidad ILIKE ${prefix} OR t.via_codigo ILIKE ${prefix} THEN 0 ELSE 1 END AS rank,
          'tramo'::text            AS type,
          t.id::text               AS id,
          t.vialidad               AS label,
          COALESCE(NULLIF(t.tramo_desc, ''), t.via_codigo, '') AS sublabel,
          public.ST_Y(public.ST_LineInterpolatePoint(public.ST_LineMerge(t.geom), 0.5))::text AS lat,
          public.ST_X(public.ST_LineInterpolatePoint(public.ST_LineMerge(t.geom), 0.5))::text AS lng,
          public.ST_AsGeoJSON(public.ST_Envelope(t.geom))::text AS bbox_geom
        FROM public.tramos t
        WHERE t.vialidad ILIKE ${like} OR t.via_codigo ILIKE ${like}
        LIMIT ${limit}
    )
    SELECT * FROM col
    UNION ALL
    SELECT * FROM tr
    ORDER BY rank, label
    LIMIT ${limit}
  `;

  const results = rows.map((r) => ({
    type: r.type,
    id: r.id,
    label: r.label,
    sublabel: r.sublabel || null,
    center: r.lat != null && r.lng != null ? [Number(r.lng), Number(r.lat)] : null,
    bbox: r.bbox_geom,
  }));

  return NextResponse.json({ q, count: results.length, results });
}
