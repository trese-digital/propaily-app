"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { MaintenanceCategory, MaintenanceStatus, Priority } from "@prisma/client";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const CATEGORIES: MaintenanceCategory[] = [
  "plumbing",
  "electrical",
  "painting",
  "carpentry",
  "cleaning",
  "gardening",
  "structural",
  "other",
];
const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];
const STATUSES: MaintenanceStatus[] = [
  "new",
  "under_review",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RequestSchema = z.object({
  propertyId: z.string().regex(UUID_RE, "Selecciona una propiedad"),
  title: z.string().trim().min(1, "Título requerido").max(160),
  description: z.string().trim().min(1, "Describe el problema").max(2000),
  category: z.enum(CATEGORIES as [MaintenanceCategory, ...MaintenanceCategory[]]),
  priority: z.enum(PRIORITIES as [Priority, ...Priority[]]),
  estimatedCostMxn: z.coerce.number().nonnegative().optional(),
});

export type MaintenanceFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

const mxnToCents = (mxn: number) => BigInt(Math.round(mxn * 100));

export async function crearSolicitudMantenimiento(
  _prev: MaintenanceFormState,
  formData: FormData,
): Promise<MaintenanceFormState> {
  const ctx = await requireContext();

  const parsed = RequestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    estimatedCostMxn: formData.get("estimatedCostMxn") || undefined,
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

  const result = await withAppScope(appScope(ctx), async (tx) => {
    // RLS garantiza que la propiedad sea del tenant; el findFirst da el
    // mensaje claro si no es accesible.
    const prop = await tx.property.findFirst({
      where: { id: v.propertyId, deletedAt: null },
      select: { id: true },
    });
    if (!prop) return { error: "La propiedad no existe o no es accesible." } as const;

    await tx.maintenanceRequest.create({
      data: {
        propertyId: prop.id,
        requesterId: ctx.user.id,
        title: v.title,
        description: v.description,
        category: v.category,
        priority: v.priority,
        status: "new",
        estimatedCostCents:
          v.estimatedCostMxn != null ? mxnToCents(v.estimatedCostMxn) : null,
      },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/mantenimiento");
  return { ok: true };
}

export async function cambiarEstadoMantenimiento(
  id: string,
  status: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  if (!UUID_RE.test(id)) return { error: "Solicitud inválida" };
  if (!STATUSES.includes(status as MaintenanceStatus)) {
    return { error: "Estado inválido" };
  }
  const next = status as MaintenanceStatus;

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const req = await tx.maintenanceRequest.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!req) return { error: "Solicitud no encontrada" } as const;

    await tx.maintenanceRequest.update({
      where: { id: req.id },
      data: {
        status: next,
        completedAt: next === "completed" ? new Date() : null,
      },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/mantenimiento");
  return { ok: true };
}
