"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { withTenant } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";

const PROP_TYPES = [
  "house",
  "apartment",
  "land",
  "commercial_space",
  "office",
  "warehouse",
  "industrial",
  "other",
] as const;

const OPERATIONAL_STATUSES = [
  "active",
  "available",
  "rented",
  "for_sale",
  "under_construction",
  "maintenance",
  "reserved",
  "inactive",
] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PropertySchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  type: z.enum(PROP_TYPES),
  operationalStatus: z.enum(OPERATIONAL_STATUSES).optional(),
  address: z.string().trim().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  landAreaSqm: z.coerce.number().nonnegative().optional(),
  builtAreaSqm: z.coerce.number().nonnegative().optional(),
  fiscalValueMxn: z.coerce.number().nonnegative().optional(),
  commercialValueMxn: z.coerce.number().nonnegative().optional(),
  insuranceValueMxn: z.coerce.number().nonnegative().optional(),
  expectedRentMxn: z.coerce.number().nonnegative().optional(),
  internalNotes: z.string().trim().optional(),
  cartoPredioId: z
    .string()
    .trim()
    .refine((v) => v === "" || UUID_RE.test(v), "predioId inválido")
    .optional(),
  cartoColoniaId: z
    .string()
    .trim()
    .refine((v) => v === "" || UUID_RE.test(v), "coloniaId inválido")
    .optional(),
});

const FIELDS = [
  "name",
  "type",
  "operationalStatus",
  "address",
  "latitude",
  "longitude",
  "landAreaSqm",
  "builtAreaSqm",
  "fiscalValueMxn",
  "commercialValueMxn",
  "insuranceValueMxn",
  "expectedRentMxn",
  "internalNotes",
  "cartoPredioId",
  "cartoColoniaId",
];

function readForm(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | undefined> = {};
  for (const k of FIELDS) {
    const v = formData.get(k);
    raw[k] = v === "" ? undefined : v ?? undefined;
  }
  return raw;
}

function toBigIntCents(mxn: number | undefined) {
  return mxn != null ? BigInt(Math.round(mxn * 100)) : null;
}

export type PropertyFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function crearPropiedad(
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const ctx = await requireContext();
  const parsed = PropertySchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = i.path.join(".");
      if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }
  const v = parsed.data;

  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const defaultPortfolio = await tx.portfolio.findFirst({
      where: { name: "General", status: "active" },
      orderBy: { createdAt: "asc" },
    });
    if (!defaultPortfolio) {
      return { error: "No hay portafolio por defecto. Corre seed-org.mjs." } as const;
    }

    const property = await tx.property.create({
      data: {
        portfolioId: defaultPortfolio.id,
        name: v.name,
        type: v.type,
        operationalStatus: v.operationalStatus ?? "active",
        address: v.address ?? null,
        latitude: v.latitude != null ? v.latitude.toString() : null,
        longitude: v.longitude != null ? v.longitude.toString() : null,
        landAreaSqm: v.landAreaSqm != null ? v.landAreaSqm.toString() : null,
        builtAreaSqm: v.builtAreaSqm != null ? v.builtAreaSqm.toString() : null,
        fiscalValueCents: toBigIntCents(v.fiscalValueMxn),
        commercialValueCents: toBigIntCents(v.commercialValueMxn),
        insuranceValueCents: toBigIntCents(v.insuranceValueMxn),
        expectedRentCents: toBigIntCents(v.expectedRentMxn),
        currency: "MXN",
        internalNotes: v.internalNotes ?? null,
        cartoPredioId: v.cartoPredioId && v.cartoPredioId !== "" ? v.cartoPredioId : null,
        cartoColoniaId: v.cartoColoniaId && v.cartoColoniaId !== "" ? v.cartoColoniaId : null,
        status: "active",
      },
    });
    return { propertyId: property.id } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/propiedades");
  redirect(`/propiedades/${result.propertyId}`);
}

export async function editarPropiedad(
  propertyId: string,
  _prev: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const ctx = await requireContext();
  const parsed = PropertySchema.safeParse(readForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = i.path.join(".");
      if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }
  const v = parsed.data;

  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const property = await tx.property.findFirst({
      where: { id: propertyId, deletedAt: null },
    });
    if (!property) return { error: "Propiedad no encontrada" } as const;

    await tx.property.update({
      where: { id: property.id },
      data: {
        name: v.name,
        type: v.type,
        operationalStatus: v.operationalStatus ?? property.operationalStatus,
        address: v.address ?? null,
        latitude: v.latitude != null ? v.latitude.toString() : null,
        longitude: v.longitude != null ? v.longitude.toString() : null,
        landAreaSqm: v.landAreaSqm != null ? v.landAreaSqm.toString() : null,
        builtAreaSqm: v.builtAreaSqm != null ? v.builtAreaSqm.toString() : null,
        fiscalValueCents: toBigIntCents(v.fiscalValueMxn),
        commercialValueCents: toBigIntCents(v.commercialValueMxn),
        insuranceValueCents: toBigIntCents(v.insuranceValueMxn),
        expectedRentCents: toBigIntCents(v.expectedRentMxn),
        internalNotes: v.internalNotes ?? null,
        cartoPredioId: v.cartoPredioId && v.cartoPredioId !== "" ? v.cartoPredioId : null,
        cartoColoniaId: v.cartoColoniaId && v.cartoColoniaId !== "" ? v.cartoColoniaId : null,
      },
    });
    return { propertyId: property.id } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/propiedades/${result.propertyId}`);
  revalidatePath("/propiedades");
  redirect(`/propiedades/${result.propertyId}`);
}

/**
 * Vincula una propiedad existente con un lote del catastro.
 * Si la propiedad no tiene lat/lng, se llenan con el centroide pasado.
 */
export async function vincularPropiedadConLote(
  propertyId: string,
  predioId: string,
  coloniaId: string,
  lat: number,
  lng: number,
  area: number | null,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  if (!UUID_RE.test(propertyId) || !UUID_RE.test(predioId) || !UUID_RE.test(coloniaId)) {
    return { error: "IDs inválidos" };
  }

  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const property = await tx.property.findFirst({
      where: { id: propertyId, deletedAt: null },
    });
    if (!property) return { error: "Propiedad no encontrada" } as const;

    await tx.property.update({
      where: { id: property.id },
      data: {
        cartoPredioId: predioId,
        cartoColoniaId: coloniaId,
        latitude: property.latitude ?? lat.toString(),
        longitude: property.longitude ?? lng.toString(),
        landAreaSqm:
          property.landAreaSqm ?? (area != null ? area.toString() : null),
      },
    });
    return { propertyId: property.id } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/propiedades/${result.propertyId}`);
  revalidatePath("/propiedades");
  return { ok: true };
}

export async function eliminarPropiedad(propertyId: string): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const property = await tx.property.findFirst({
      where: { id: propertyId, deletedAt: null },
    });
    if (!property) return { error: "Propiedad no encontrada" } as const;
    await tx.property.update({
      where: { id: property.id },
      data: { status: "deleted", deletedAt: new Date() },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/propiedades");
  redirect("/propiedades");
}
