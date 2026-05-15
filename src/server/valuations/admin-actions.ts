"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ValuationType } from "@prisma/client";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { dbBypass } from "@/server/db/scoped";
import { logAdminAccess } from "@/server/audit/log";

/**
 * Valuaciones — lado backoffice GF (S6).
 *
 * El servicio profesional de GF: analistas registran `Valuation` (append-only)
 * y atienden la cola de `ValuationRequest`. Es trabajo cross-tenant, así que:
 *  - se exige rol staff GF (`isGfStaff`),
 *  - se usa `dbBypass` (salta RLS, vista cross-tenant),
 *  - cada acción se registra en `AuditLog` con la MC de la propiedad.
 *
 * Decisión Bloque 1-2: una valuación nueva actualiza el valor "actual"
 * denormalizado de la `Property` (`currentValueCents`) y, según el tipo, su
 * columna específica (fiscal / comercial / seguro).
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALUATION_TYPES = [
  "professional",
  "commercial",
  "fiscal",
  "insurance",
  "manual",
] as const;

const ValuationSchema = z.object({
  propertyId: z.string().regex(UUID_RE, "Propiedad inválida"),
  requestId: z.string().regex(UUID_RE).optional(),
  type: z.enum(VALUATION_TYPES),
  valueMxn: z.coerce.number().positive("El valor debe ser mayor a 0"),
  valuationDate: z.string().trim().min(1, "Fecha requerida"),
  source: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
  isOfficial: z.string().optional(), // checkbox: "on"
});

export type ValuationFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
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

/** MC dueña de una propiedad — para etiquetar el AuditLog. */
async function mcOfProperty(propertyId: string): Promise<string | null> {
  const p = await dbBypass.property.findUnique({
    where: { id: propertyId },
    select: { portfolio: { select: { client: { select: { managementCompanyId: true } } } } },
  });
  return p?.portfolio.client.managementCompanyId ?? null;
}

/**
 * Registra una `Valuation` (append-only) y actualiza los valores
 * denormalizados de la propiedad. Si viene ligada a un `ValuationRequest`,
 * lo marca como completado.
 */
export async function registrarValuacion(
  _prev: ValuationFormState,
  formData: FormData,
): Promise<ValuationFormState> {
  const ctx = await requireGfStaff();

  const parsed = ValuationSchema.safeParse({
    propertyId: formData.get("propertyId"),
    requestId: formData.get("requestId") || undefined,
    type: formData.get("type"),
    valueMxn: formData.get("valueMxn"),
    valuationDate: formData.get("valuationDate"),
    source: formData.get("source") || undefined,
    notes: formData.get("notes") || undefined,
    isOfficial: formData.get("isOfficial") || undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = i.path.join(".");
      if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }
  const v = parsed.data;

  const date = new Date(`${v.valuationDate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { error: "Fecha inválida", fieldErrors: { valuationDate: "Fecha inválida" } };
  }

  const prop = await dbBypass.property.findUnique({
    where: { id: v.propertyId },
    select: { id: true, deletedAt: true },
  });
  if (!prop || prop.deletedAt) {
    return { error: "La propiedad no existe." };
  }

  const valueCents = mxnToCents(v.valueMxn);
  const type = v.type as ValuationType;

  // Valor "actual" denormalizado + columna específica por tipo.
  const propData: {
    currentValueCents: bigint;
    fiscalValueCents?: bigint;
    commercialValueCents?: bigint;
    insuranceValueCents?: bigint;
  } = { currentValueCents: valueCents };
  if (type === "fiscal") propData.fiscalValueCents = valueCents;
  if (type === "commercial") propData.commercialValueCents = valueCents;
  if (type === "insurance") propData.insuranceValueCents = valueCents;

  const valuation = await dbBypass.$transaction(async (tx) => {
    const created = await tx.valuation.create({
      data: {
        propertyId: v.propertyId,
        type,
        valueCents,
        currency: "MXN",
        valuationDate: date,
        source: v.source ?? "GF Consultoría",
        notes: v.notes ?? null,
        isOfficial: v.isOfficial === "on",
        approvalStatus: "not_required",
      },
    });
    await tx.property.update({ where: { id: v.propertyId }, data: propData });

    if (v.requestId) {
      await tx.valuationRequest.updateMany({
        where: { id: v.requestId, status: { in: ["pending", "in_progress"] } },
        data: {
          status: "completed",
          completedAt: new Date(),
          response: `Valuación registrada · ${type}`,
        },
      });
    }
    return created;
  });

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "create",
    entityType: "Valuation",
    entityId: valuation.id,
    managementCompanyId: (await mcOfProperty(v.propertyId)) ?? undefined,
    metadata: { propertyId: v.propertyId, type, valueCents: valueCents.toString() },
  });

  revalidatePath("/admin/avaluos");
  revalidatePath(`/propiedades/${v.propertyId}`);
  return { ok: true };
}

/** Toma una solicitud de la cola: pending → in_progress. */
export async function tomarSolicitud(
  requestId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireGfStaff();

  const req = await dbBypass.valuationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, propertyId: true },
  });
  if (!req) return { error: "Solicitud no encontrada" };
  if (req.status !== "pending") {
    return { error: "Sólo se pueden tomar solicitudes pendientes." };
  }

  await dbBypass.valuationRequest.update({
    where: { id: req.id },
    data: { status: "in_progress" },
  });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "update",
    entityType: "ValuationRequest",
    entityId: req.id,
    managementCompanyId: (await mcOfProperty(req.propertyId)) ?? undefined,
    metadata: { transition: "pending→in_progress" },
  });

  revalidatePath("/admin/avaluos");
  return { ok: true };
}

/** Cierra una solicitud sin registrar valuación (p. ej. rechazada o resuelta aparte). */
export async function completarSolicitud(
  requestId: string,
  response: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireGfStaff();

  const req = await dbBypass.valuationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, propertyId: true },
  });
  if (!req) return { error: "Solicitud no encontrada" };
  if (req.status === "completed" || req.status === "cancelled") {
    return { error: "La solicitud ya está cerrada." };
  }

  await dbBypass.valuationRequest.update({
    where: { id: req.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      response: response.trim() || "Atendida por GF.",
    },
  });
  await logAdminAccess({
    actorId: ctx.user.id,
    action: "update",
    entityType: "ValuationRequest",
    entityId: req.id,
    managementCompanyId: (await mcOfProperty(req.propertyId)) ?? undefined,
    metadata: { transition: `${req.status}→completed` },
  });

  revalidatePath("/admin/avaluos");
  return { ok: true };
}
