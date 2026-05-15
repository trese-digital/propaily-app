"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

/**
 * Valuaciones — lado cliente (S6).
 *
 * El cliente NO escribe `Valuation` (eso es servicio profesional de GF, ver
 * `admin-actions.ts`). Sólo puede **solicitar** una valuación/actualización:
 * crea un `ValuationRequest` que aparece en la cola del backoffice GF.
 *
 * RLS: `ValuationRequest` se aísla vía `is_my_property(propertyId)` — el
 * `withAppScope` garantiza que sólo se cree contra propiedades del scope.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RequestSchema = z.object({
  propertyId: z.string().regex(UUID_RE, "Propiedad inválida"),
  notes: z.string().trim().max(1000, "Máximo 1000 caracteres").optional(),
});

export type ValuationRequestState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function solicitarValuacion(
  _prev: ValuationRequestState,
  formData: FormData,
): Promise<ValuationRequestState> {
  const ctx = await requireContext();

  const parsed = RequestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = i.path.join(".");
      if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Revisa los campos marcados", fieldErrors };
  }
  const { propertyId, notes } = parsed.data;

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const prop = await tx.property.findFirst({
      where: { id: propertyId, deletedAt: null },
      select: { id: true },
    });
    if (!prop) return { error: "La propiedad no existe o no es accesible." } as const;

    // Una solicitud activa a la vez por propiedad — evita ruido en la cola GF.
    const open = await tx.valuationRequest.findFirst({
      where: { propertyId, status: { in: ["pending", "in_progress"] } },
      select: { id: true },
    });
    if (open) {
      return {
        error: "Ya hay una solicitud de valuación en curso para esta propiedad.",
      } as const;
    }

    await tx.valuationRequest.create({
      data: {
        propertyId,
        requesterId: ctx.user.id,
        status: "pending",
        notes: notes ?? null,
      },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/propiedades/${propertyId}`);
  revalidatePath("/valuaciones");
  return { ok: true };
}

/** El solicitante puede cancelar una solicitud aún pendiente. */
export async function cancelarSolicitud(
  requestId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const req = await tx.valuationRequest.findFirst({
      where: { id: requestId },
      select: { id: true, status: true, propertyId: true },
    });
    if (!req) return { error: "Solicitud no encontrada" } as const;
    if (req.status !== "pending") {
      return { error: "Sólo se pueden cancelar solicitudes pendientes." } as const;
    }
    await tx.valuationRequest.update({
      where: { id: req.id },
      data: { status: "cancelled", completedAt: new Date() },
    });
    return { propertyId: req.propertyId } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/propiedades/${result.propertyId}`);
  revalidatePath("/valuaciones");
  return { ok: true };
}
