"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { withTenant } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";

const UNIT_TYPES = [
  "apartment",
  "commercial_space",
  "office",
  "warehouse",
  "room",
  "other",
] as const;

const UnitSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().trim().min(1, "Nombre requerido"),
  type: z.enum(UNIT_TYPES),
  areaSqm: z.coerce.number().nonnegative().optional(),
  monthlyRentMxn: z.coerce.number().nonnegative().optional(),
  currentTenantName: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
});

function readForm(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | undefined> = {};
  for (const k of [
    "propertyId",
    "name",
    "type",
    "areaSqm",
    "monthlyRentMxn",
    "currentTenantName",
    "internalNotes",
  ]) {
    const v = formData.get(k);
    raw[k] = v === "" ? undefined : v ?? undefined;
  }
  return raw;
}

export type UnitFormState = { error?: string; ok?: boolean; ts?: number };

async function checkPropertyOwnership(propertyId: string, mcId: string) {
  return withTenant(mcId, (tx) =>
    tx.property.findFirst({ where: { id: propertyId, deletedAt: null } }),
  );
}

export async function crearUnidad(
  _prev: UnitFormState,
  formData: FormData,
): Promise<UnitFormState> {
  const ctx = await requireContext();
  const parsed = UnitSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const property = await checkPropertyOwnership(
    v.propertyId,
    ctx.membership.managementCompanyId,
  );
  if (!property) return { error: "Propiedad no encontrada" };

  await withTenant(ctx.membership.managementCompanyId, (tx) =>
    tx.unit.create({
      data: {
        propertyId: property.id,
        name: v.name,
        type: v.type,
        areaSqm: v.areaSqm != null ? v.areaSqm.toString() : null,
        monthlyRentCents:
          v.monthlyRentMxn != null ? BigInt(Math.round(v.monthlyRentMxn * 100)) : null,
        currency: "MXN",
        currentTenantName: v.currentTenantName ?? null,
        internalNotes: v.internalNotes ?? null,
        operationalStatus: "active",
        status: "active",
      },
    }),
  );

  revalidatePath(`/propiedades/${property.id}`);
  return { ok: true, ts: Date.now() };
}

export async function editarUnidad(
  unitId: string,
  _prev: UnitFormState,
  formData: FormData,
): Promise<UnitFormState> {
  const ctx = await requireContext();
  // En edición no recibimos propertyId del form; lo resolvemos por unitId.
  const existing = await withTenant(ctx.membership.managementCompanyId, (tx) =>
    tx.unit.findFirst({ where: { id: unitId, deletedAt: null } }),
  );
  if (!existing) return { error: "Unidad no encontrada" };

  // Reutilizamos el schema pero inyectamos propertyId desde la DB.
  const formObj = readForm(formData);
  formObj.propertyId = existing.propertyId;
  const parsed = UnitSchema.safeParse(formObj);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  await withTenant(ctx.membership.managementCompanyId, (tx) =>
    tx.unit.update({
      where: { id: unitId },
      data: {
        name: v.name,
        type: v.type,
        areaSqm: v.areaSqm != null ? v.areaSqm.toString() : null,
        monthlyRentCents:
          v.monthlyRentMxn != null ? BigInt(Math.round(v.monthlyRentMxn * 100)) : null,
        currentTenantName: v.currentTenantName ?? null,
        internalNotes: v.internalNotes ?? null,
      },
    }),
  );

  revalidatePath(`/propiedades/${existing.propertyId}`);
  return { ok: true, ts: Date.now() };
}

export async function eliminarUnidad(
  unitId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const unit = await tx.unit.findFirst({ where: { id: unitId, deletedAt: null } });
    if (!unit) return { error: "Unidad no encontrada" } as const;
    await tx.unit.update({
      where: { id: unit.id },
      data: { status: "deleted", deletedAt: new Date() },
    });
    return { propertyId: unit.propertyId } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/propiedades/${result.propertyId}`);
  return { ok: true };
}
