/**
 * Geo-resolución para comparables — determina colonia y sector desde lat/lng.
 *
 * Usa $queryRaw cross-schema: consulta public.colonias (catastro) para
 * resolver las coordenadas a colonia UUID + número de sector.
 */

import { dbBypass } from "@/server/db/scoped";

export type GeoResolution = {
  coloniaId: string;
  sectorNumber: number;
  coloniaNombre: string;
} | null;

/**
 * Dado lat/lng, busca en qué colonia del catastro cae el punto.
 * Retorna coloniaId + sectorNumber, o null si no cae en ninguna colonia.
 *
 * Usa ST_Contains con PostGIS para determinar si el punto está dentro
 * de la geometría de alguna colonia en León.
 */
export async function resolveCoordinates(
  latitude: number,
  longitude: number
): Promise<GeoResolution> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  try {
    // Query cross-schema: public.colonias (catastro) desde propaily
    const result = await dbBypass.$queryRaw<{
      id: string;
      sector: number;
      nombre: string;
    }[]>`
      SELECT
        c.id::text AS id,
        c.sector,
        c.nombre
      FROM public.colonias c
      WHERE ST_Contains(
        c.geom,
        ST_SetSRID(ST_MakePoint(${longitude}::real, ${latitude}::real), 4326)
      )
      LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }

    const colonia = result[0];
    return {
      coloniaId: colonia.id,
      sectorNumber: colonia.sector,
      coloniaNombre: colonia.nombre,
    };
  } catch (error) {
    console.error("[geo] Error al resolver coordenadas:", error);
    return null;
  }
}

/**
 * Wrapper para uso en formularios: convierte strings a numbers y maneja errores.
 */
export async function resolveFromFormData(
  latStr: string | undefined,
  lngStr: string | undefined
): Promise<GeoResolution> {
  if (!latStr || !lngStr) {
    return null;
  }

  const lat = parseFloat(latStr.trim());
  const lng = parseFloat(lngStr.trim());

  return await resolveCoordinates(lat, lng);
}