"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type {
  ComparableTipo,
  PropertyType,
  ComparableLocationStatus,
  Currency,
} from "@prisma/client";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { dbBypass } from "@/server/db/scoped";
import { logAdminAccess } from "@/server/audit/log";
import { resolveFromFormData, type GeoResolution } from "./geo";

/**
 * Comparables — backoffice GF (Bloque 3).
 *
 * Gestión de comparables de mercado para inteligencia inmobiliaria.
 * Solo staff GF puede acceder (no es tenant-scoped).
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const COMPARABLE_TIPOS: ComparableTipo[] = [
  "avaluo",
  "pagina_web",
  "portal_inmobiliario",
  "valuacion_propaily",
  "otro",
];

const PROPERTY_TYPES: PropertyType[] = [
  "house",
  "apartment",
  "land",
  "commercial_space",
  "office",
  "warehouse",
  "industrial",
  "other",
];

const ComparableSchema = z.object({
  valueMxn: z.coerce.number().positive("El valor debe ser mayor a 0"),
  comparableDate: z.string().trim().min(1, "Fecha requerida"),
  tipo: z.enum(COMPARABLE_TIPOS),
  propertyType: z.enum(PROPERTY_TYPES),
  landAreaSqm: z.coerce.number().positive().optional(),
  builtAreaSqm: z.coerce.number().positive().optional(),
  ageYears: z.coerce.number().int().min(0).max(200).optional(),
  usoSuelo: z.string().trim().max(100).optional(),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),
  // Override manual de colonia/sector
  coloniaIdManual: z.string().regex(UUID_RE).optional(),
  sectorNumberManual: z.coerce.number().int().min(1).max(999).optional(),
  address: z.string().trim().max(500).optional(),
  source: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const CsvRowSchema = z.object({
  valor: z.coerce.number().positive(),
  fecha: z.string().trim().min(1),
  tipo: z.enum(COMPARABLE_TIPOS),
  tipo_inmueble: z.enum(PROPERTY_TYPES),
  m2_terreno: z.coerce.number().positive().optional(),
  m2_construccion: z.coerce.number().positive().optional(),
  antiguedad_anios: z.coerce.number().int().min(0).max(200).optional(),
  uso_suelo: z.string().trim().max(100).optional(),
  latitud: z.coerce.number().optional(),
  longitud: z.coerce.number().optional(),
  direccion: z.string().trim().max(500).optional(),
  fuente: z.string().trim().max(200).optional(),
  notas: z.string().trim().max(2000).optional(),
});

export type ComparableFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type CsvUploadResult = {
  ok?: boolean;
  error?: string;
  created?: number;
  errors?: string[];
};

const mxnToCents = (mxn: number) => BigInt(Math.round(mxn * 100));

/** Exige sesión + rol staff GF. Lanza si no lo es. */
async function requireGfStaff() {
  const ctx = await requireContext();
  if (!(await isGfStaff(ctx.user.id))) {
    throw new Error("Acción restringida al staff de GF.");
  }
  return ctx;
}

/** Determina status de ubicación basado en coordenadas y override manual. */
function determineLocationStatus(
  hasCoords: boolean,
  hasManualOverride: boolean,
  geoResolved: boolean
): ComparableLocationStatus {
  if (hasManualOverride) {
    return "colonia_manual";
  }
  if (hasCoords && geoResolved) {
    return "geolocalizado";
  }
  return "sin_ubicar";
}

/**
 * Crea un comparable individual desde el formulario.
 */
export async function crearComparable(
  _prev: ComparableFormState,
  formData: FormData
): Promise<ComparableFormState> {
  const ctx = await requireGfStaff();

  const parsed = ComparableSchema.safeParse({
    valueMxn: formData.get("valueMxn"),
    comparableDate: formData.get("comparableDate"),
    tipo: formData.get("tipo"),
    propertyType: formData.get("propertyType"),
    landAreaSqm: formData.get("landAreaSqm") || undefined,
    builtAreaSqm: formData.get("builtAreaSqm") || undefined,
    ageYears: formData.get("ageYears") || undefined,
    usoSuelo: formData.get("usoSuelo") || undefined,
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
    coloniaIdManual: formData.get("coloniaIdManual") || undefined,
    sectorNumberManual: formData.get("sectorNumberManual") || undefined,
    address: formData.get("address") || undefined,
    source: formData.get("source") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }

  const data = parsed.data;

  // Validar fecha
  const comparableDate = new Date(`${data.comparableDate}T00:00:00.000Z`);
  if (Number.isNaN(comparableDate.getTime())) {
    return {
      error: "Fecha inválida",
      fieldErrors: { comparableDate: "Fecha inválida" },
    };
  }

  // Geo-resolución si hay coordenadas
  const hasCoords = data.latitude && data.longitude;
  let geoResolution: GeoResolution = null;

  if (hasCoords) {
    geoResolution = await resolveFromFormData(data.latitude, data.longitude);
  }

  // Determinar colonia/sector finales (manual override o geo-resuelto)
  const hasManualOverride = data.coloniaIdManual && data.sectorNumberManual;
  const coloniaId = hasManualOverride
    ? data.coloniaIdManual!
    : geoResolution?.coloniaId ?? null;
  const sectorNumber = hasManualOverride
    ? data.sectorNumberManual!
    : geoResolution?.sectorNumber ?? null;

  const locationStatus = determineLocationStatus(
    !!hasCoords,
    !!hasManualOverride,
    !!geoResolution
  );

  const comparable = await dbBypass.comparable.create({
    data: {
      valueCents: mxnToCents(data.valueMxn),
      currency: "MXN",
      comparableDate,
      tipo: data.tipo,
      propertyType: data.propertyType,
      landAreaSqm: data.landAreaSqm ?? null,
      builtAreaSqm: data.builtAreaSqm ?? null,
      ageYears: data.ageYears ?? null,
      usoSuelo: data.usoSuelo ?? null,
      latitude: hasCoords ? data.latitude : null,
      longitude: hasCoords ? data.longitude : null,
      coloniaId,
      sectorNumber,
      locationStatus,
      address: data.address ?? null,
      source: data.source ?? null,
      notes: data.notes ?? null,
      createdById: ctx.user.id,
    },
  });

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "create",
    entityType: "Comparable",
    entityId: comparable.id,
    metadata: {
      tipo: data.tipo,
      propertyType: data.propertyType,
      valueCents: comparable.valueCents.toString(),
      locationStatus,
    },
  });

  revalidatePath("/admin/comparables");
  return { ok: true };
}

/**
 * Parsea una línea CSV para crear un comparable.
 */
async function parseComparableFromCsv(
  row: Record<string, string>,
  rowIndex: number
): Promise<{ comparable?: any; error?: string }> {
  try {
    const parsed = CsvRowSchema.safeParse(row);
    if (!parsed.success) {
      return {
        error: `Fila ${rowIndex + 2}: ${parsed.error.issues.map(i => i.message).join(", ")}`,
      };
    }

    const data = parsed.data;

    // Validar fecha
    const comparableDate = new Date(`${data.fecha}T00:00:00.000Z`);
    if (Number.isNaN(comparableDate.getTime())) {
      return { error: `Fila ${rowIndex + 2}: Fecha inválida "${data.fecha}"` };
    }

    // Geo-resolución si hay coordenadas
    let geoResolution: GeoResolution = null;
    const hasCoords = data.latitud && data.longitud;

    if (hasCoords) {
      geoResolution = await resolveFromFormData(
        data.latitud?.toString(),
        data.longitud?.toString()
      );
    }

    const locationStatus = determineLocationStatus(
      !!hasCoords,
      false, // CSV no soporta override manual
      !!geoResolution
    );

    return {
      comparable: {
        valueCents: mxnToCents(data.valor),
        currency: "MXN" as Currency,
        comparableDate,
        tipo: data.tipo,
        propertyType: data.tipo_inmueble,
        landAreaSqm: data.m2_terreno ?? null,
        builtAreaSqm: data.m2_construccion ?? null,
        ageYears: data.antiguedad_anios ?? null,
        usoSuelo: data.uso_suelo ?? null,
        latitude: hasCoords ? data.latitud : null,
        longitude: hasCoords ? data.longitud : null,
        coloniaId: geoResolution?.coloniaId ?? null,
        sectorNumber: geoResolution?.sectorNumber ?? null,
        locationStatus,
        address: data.direccion ?? null,
        source: data.fuente ?? null,
        notes: data.notas ?? null,
      },
    };
  } catch (error) {
    return { error: `Fila ${rowIndex + 2}: Error inesperado - ${error}` };
  }
}

/**
 * Procesa upload CSV para crear múltiples comparables.
 */
export async function uploadComparablesCsv(
  csvContent: string
): Promise<CsvUploadResult> {
  const ctx = await requireGfStaff();

  if (!csvContent.trim()) {
    return { error: "Archivo CSV vacío" };
  }

  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    return { error: "El archivo debe tener al menos una cabecera y una fila de datos" };
  }

  // Parsear CSV
  const [header, ...dataLines] = lines;
  const columns = header.split(',').map(col => col.trim().toLowerCase());

  // Validar cabecera esperada
  const expectedColumns = [
    'valor', 'fecha', 'tipo', 'tipo_inmueble', 'm2_terreno', 'm2_construccion',
    'antiguedad_anios', 'uso_suelo', 'latitud', 'longitud', 'direccion', 'fuente', 'notas'
  ];

  const missingColumns = expectedColumns.filter(col => !columns.includes(col));
  if (missingColumns.length > 0) {
    return { error: `Columnas faltantes en CSV: ${missingColumns.join(', ')}` };
  }

  // Procesar filas
  const errors: string[] = [];
  const validComparables: any[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const values = line.split(',').map(v => v.trim());

    if (values.length !== columns.length) {
      errors.push(`Fila ${i + 2}: Número incorrecto de columnas (esperadas ${columns.length}, encontradas ${values.length})`);
      continue;
    }

    // Crear objeto row
    const row: Record<string, string> = {};
    for (let j = 0; j < columns.length; j++) {
      row[columns[j]] = values[j];
    }

    const result = await parseComparableFromCsv(row, i);
    if (result.error) {
      errors.push(result.error);
    } else if (result.comparable) {
      validComparables.push({
        ...result.comparable,
        createdById: ctx.user.id,
      });
    }
  }

  // Si hay demasiados errores, abortar
  if (errors.length > 0 && validComparables.length === 0) {
    return { error: "No se pudieron procesar filas válidas", errors };
  }

  // Crear comparables válidos en batch
  let created = 0;
  if (validComparables.length > 0) {
    const result = await dbBypass.comparable.createMany({
      data: validComparables,
      skipDuplicates: true,
    });
    created = result.count;

    await logAdminAccess({
      actorId: ctx.user.id,
      action: "create_bulk",
      entityType: "Comparable",
      metadata: {
        csvRowsProcessed: dataLines.length,
        csvRowsCreated: created,
        csvRowsErrors: errors.length,
      },
    });
  }

  revalidatePath("/admin/comparables");

  return {
    ok: true,
    created,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limitar errores mostrados
  };
}