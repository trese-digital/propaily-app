/**
 * GET /api/cartografia/mis-predios?bbox=w,s,e,n
 *
 * Devuelve los predios catastrales (public.predios) vinculados a Properties
 * del ManagementCompany del usuario autenticado, intersectados contra el bbox.
 *
 * Scope multi-tenant: User → Membership → ManagementCompany → Client →
 * Portfolio → Property.cartoPredioId → public.predios.
 */
import { NextResponse, type NextRequest } from "next/server";

import { withAppScope } from "@/server/db/scoped";
import { parseBbox } from "@/server/cartografia/bbox";
import { requireAddon } from "@/server/access/require-addon";

type Row = {
  predio_id: string;
  area_m2: string | null;
  geom: unknown;
  property_id: string;
  property_name: string;
};

export async function GET(request: NextRequest) {
  // Sesión + membership + addon "cartografia" verificados aquí (regla AGENTS.md §17).
  const gate = await requireAddon("cartografia");
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const bboxResult = parseBbox(searchParams.get("bbox"));
  if (!bboxResult.ok) {
    return NextResponse.json(
      { error: { code: bboxResult.code, message: bboxResult.message } },
      { status: 400 },
    );
  }
  const { w, s, e, n } = bboxResult.bbox;
  const mcId = gate.managementCompanyId;

  // El JOIN cruza schemas (propaily.Property → public.predios). withAppScope
  // setea app.management_company_id (+ app.client_id si es family office) para
  // que RLS filtre Property/Portfolio/Client. El filtro explícito por
  // managementCompanyId queda como defensa redundante en el WHERE.
  const rows = await withAppScope(
    { managementCompanyId: mcId, clientId: gate.clientId },
    (tx) =>
    tx.$queryRaw<Row[]>`
      SELECT
          p.id::text                       AS predio_id,
          p.area_m2::text                  AS area_m2,
          public.ST_AsGeoJSON(p.geom)::json AS geom,
          prop.id::text                    AS property_id,
          prop.name                        AS property_name
      FROM propaily."Property" prop
      JOIN propaily."Portfolio" port ON port.id = prop."portfolioId"
      JOIN propaily."Client"    cli  ON cli.id  = port."clientId"
      JOIN public.predios        p   ON p.id    = prop."cartoPredioId"
      WHERE cli."managementCompanyId" = ${mcId}::uuid
        AND prop."cartoPredioId" IS NOT NULL
        AND prop."deletedAt" IS NULL
        AND port."deletedAt" IS NULL
        AND cli."deletedAt"  IS NULL
        AND p.geom && public.ST_MakeEnvelope(${w}, ${s}, ${e}, ${n}, 4326)
      LIMIT 2000
    `,
  );

  const features = rows.map((r) => ({
    type: "Feature" as const,
    id: r.predio_id,
    properties: {
      predioId: r.predio_id,
      propertyId: r.property_id,
      propertyName: r.property_name,
      area_m2: r.area_m2 == null ? null : Number(r.area_m2),
    },
    geometry: r.geom,
  }));

  return NextResponse.json(
    {
      type: "FeatureCollection",
      features,
      count: features.length,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=30",
      },
    },
  );
}
