"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Currency } from "@prisma/client";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * El contrato se cuelga de una Propiedad O de una Unidad (renta mixta,
 * decisión S2). El form manda un único campo `target` con prefijo:
 *   "prop:<uuid>"  → renta de la propiedad completa
 *   "unit:<uuid>"  → renta de una unidad
 */
const TargetSchema = z
  .string()
  .trim()
  .refine(
    (v) => /^(prop|unit):[0-9a-f-]{36}$/i.test(v) && UUID_RE.test(v.slice(5)),
    "Selecciona una propiedad o unidad",
  );

const LeaseSchema = z.object({
  target: TargetSchema,
  tenantName: z.string().trim().min(1, "Nombre del inquilino requerido"),
  tenantEmail: z.string().trim().email("Email inválido").optional().or(z.literal("")),
  monthlyRentMxn: z.coerce.number().positive("La renta debe ser mayor a 0"),
  securityDepositMxn: z.coerce.number().nonnegative().optional(),
  paymentDay: z.coerce.number().int().min(1).max(31),
  startDate: z.string().trim().min(1, "Fecha de inicio requerida"),
  endDate: z.string().trim().min(1, "Fecha de fin requerida"),
  notes: z.string().trim().optional(),
  activate: z.string().optional(), // checkbox: "on" = crear como activo
});

export type LeaseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const mxnToCents = (mxn: number) => BigInt(Math.round(mxn * 100));

/**
 * Genera el calendario de pagos: un RentPayment por mes calendario entre
 * `start` y `end` (inclusive). El día de vencimiento es `paymentDay`, salvo
 * que el mes sea más corto — entonces el último día del mes (decisión S2-D).
 */
function buildPaymentSchedule(
  start: Date,
  end: Date,
  paymentDay: number,
  amountCents: bigint,
  currency: Currency,
) {
  const payments: Array<{
    amountCents: bigint;
    currency: Currency;
    periodMonth: number;
    periodYear: number;
    dueDate: Date;
    status: "pending";
  }> = [];
  let y = start.getUTCFullYear();
  let m = start.getUTCMonth(); // 0-11
  const endY = end.getUTCFullYear();
  const endM = end.getUTCMonth();
  while (y < endY || (y === endY && m <= endM)) {
    const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const day = Math.min(paymentDay, daysInMonth);
    payments.push({
      amountCents,
      currency,
      periodMonth: m + 1,
      periodYear: y,
      dueDate: new Date(Date.UTC(y, m, day)),
      status: "pending",
    });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    if (payments.length > 600) break; // tope de seguridad (~50 años)
  }
  return payments;
}

export async function crearContrato(
  _prev: LeaseFormState,
  formData: FormData,
): Promise<LeaseFormState> {
  const ctx = await requireContext();

  const parsed = LeaseSchema.safeParse({
    target: formData.get("target"),
    tenantName: formData.get("tenantName"),
    tenantEmail: formData.get("tenantEmail") || "",
    monthlyRentMxn: formData.get("monthlyRentMxn"),
    securityDepositMxn: formData.get("securityDepositMxn") || undefined,
    paymentDay: formData.get("paymentDay"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    notes: formData.get("notes") || undefined,
    activate: formData.get("activate") || undefined,
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

  const start = new Date(`${v.startDate}T00:00:00.000Z`);
  const end = new Date(`${v.endDate}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: "Fechas inválidas", fieldErrors: { startDate: "Revisa las fechas" } };
  }
  if (end <= start) {
    return {
      error: "La fecha de fin debe ser posterior al inicio",
      fieldErrors: { endDate: "Debe ser posterior al inicio" },
    };
  }

  const [kind, targetId] = v.target.split(":") as ["prop" | "unit", string];
  const rentCents = mxnToCents(v.monthlyRentMxn);

  const result = await withAppScope(appScope(ctx), async (tx) => {
    // El target debe ser visible para este scope (RLS lo garantiza; el
    // findFirst da además un error claro si no es accesible).
    if (kind === "prop") {
      const prop = await tx.property.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!prop) return { error: "La propiedad no existe o no es accesible." } as const;
    } else {
      const unit = await tx.unit.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!unit) return { error: "La unidad no existe o no es accesible." } as const;
    }

    const lease = await tx.lease.create({
      data: {
        propertyId: kind === "prop" ? targetId : null,
        unitId: kind === "unit" ? targetId : null,
        tenantName: v.tenantName,
        tenantEmail: v.tenantEmail ? v.tenantEmail : null,
        monthlyRentCents: rentCents,
        currency: "MXN",
        paymentDay: v.paymentDay,
        startDate: start,
        endDate: end,
        securityDepositCents:
          v.securityDepositMxn != null ? mxnToCents(v.securityDepositMxn) : null,
        status: v.activate === "on" ? "active" : "draft",
        notes: v.notes ?? null,
      },
    });

    // Calendario de pagos auto-generado (decisión S2-D).
    const schedule = buildPaymentSchedule(
      start,
      end,
      v.paymentDay,
      rentCents,
      "MXN",
    );
    if (schedule.length > 0) {
      await tx.rentPayment.createMany({
        data: schedule.map((p) => ({ ...p, leaseId: lease.id })),
      });
    }

    return { leaseId: lease.id } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/rentas");
  redirect(`/rentas/${result.leaseId}`);
}

export async function cancelarContrato(
  leaseId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const lease = await tx.lease.findFirst({
      where: { id: leaseId, deletedAt: null },
      select: { id: true },
    });
    if (!lease) return { error: "Contrato no encontrado" } as const;

    await tx.lease.update({
      where: { id: lease.id },
      data: { status: "cancelled" },
    });
    // Los pagos futuros pendientes se cancelan; el histórico se conserva.
    await tx.rentPayment.updateMany({
      where: {
        leaseId: lease.id,
        status: "pending",
        dueDate: { gte: new Date() },
      },
      data: { status: "cancelled" },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/rentas");
  revalidatePath(`/rentas/${leaseId}`);
  return { ok: true };
}
