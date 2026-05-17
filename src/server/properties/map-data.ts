/**
 * Datos para el mapa base (CORE) — pines de las propiedades del tenant.
 *
 * El mapa base es del CORE (todos los planes), distinto del visor de catastro
 * (`/cartografia`, addon). Sólo necesita id/nombre/coordenadas y un valor para
 * mostrar en el pin. RLS scopea por ManagementCompany (+ Client si family
 * office) vía `withAppScope`.
 */
import { appScope, type AppContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { formatPropertyTitleValue } from "@/lib/property-value";

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  available: "Disponible",
  rented: "Rentada",
  for_sale: "En venta",
  under_construction: "En construcción",
  maintenance: "Mantenimiento",
  reserved: "Reservada",
  inactive: "Inactiva",
};

export type MapProperty = {
  id: string;
  name: string;
  address: string | null;
  type: string;
  status: string;
  value: string;
  lat: number;
  lng: number;
};

export type MapPropertyUnlocated = {
  id: string;
  name: string;
  address: string | null;
  status: string;
  value: string;
};

export type MapData = {
  located: MapProperty[];
  unlocated: MapPropertyUnlocated[];
};

/** Propiedades del tenant separadas en ubicadas (con lat/lng) y sin ubicar. */
export async function getMapProperties(ctx: AppContext): Promise<MapData> {
  const rows = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findMany({
      where: { status: { not: "deleted" }, deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        address: true,
        type: true,
        operationalStatus: true,
        latitude: true,
        longitude: true,
        commercialValueCents: true,
        purchasePriceCents: true,
        fiscalValueCents: true,
      },
    }),
  );

  const located: MapProperty[] = [];
  const unlocated: MapPropertyUnlocated[] = [];

  for (const p of rows) {
    const value = formatPropertyTitleValue(p);
    const status = STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus;
    const lat = p.latitude != null ? Number(p.latitude) : null;
    const lng = p.longitude != null ? Number(p.longitude) : null;

    // Coordenada válida: ambas presentes y dentro de rango geográfico.
    if (
      lat != null &&
      lng != null &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      located.push({
        id: p.id,
        name: p.name,
        address: p.address,
        type: p.type,
        status,
        value,
        lat,
        lng,
      });
    } else {
      unlocated.push({
        id: p.id,
        name: p.name,
        address: p.address,
        status,
        value,
      });
    }
  }

  return { located, unlocated };
}
