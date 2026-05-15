"use server";

import { revalidatePath } from "next/cache";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

/** Marca un pago como confirmado (registra la fecha de pago). */
export async function registrarPago(
  paymentId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const payment = await tx.rentPayment.findFirst({
      where: { id: paymentId, deletedAt: null },
      select: { id: true, leaseId: true, status: true },
    });
    if (!payment) return { error: "Pago no encontrado" } as const;
    if (payment.status === "cancelled") {
      return { error: "El pago está cancelado" } as const;
    }
    await tx.rentPayment.update({
      where: { id: payment.id },
      data: { status: "confirmed", paidAt: new Date() },
    });
    return { leaseId: payment.leaseId } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/rentas/${result.leaseId}`);
  revalidatePath("/rentas");
  return { ok: true };
}

/** Revierte un pago confirmado a pendiente. */
export async function revertirPago(
  paymentId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const payment = await tx.rentPayment.findFirst({
      where: { id: paymentId, deletedAt: null },
      select: { id: true, leaseId: true },
    });
    if (!payment) return { error: "Pago no encontrado" } as const;
    await tx.rentPayment.update({
      where: { id: payment.id },
      data: { status: "pending", paidAt: null },
    });
    return { leaseId: payment.leaseId } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/rentas/${result.leaseId}`);
  return { ok: true };
}

/** Cancela un pago individual (queda fuera de la cobranza). */
export async function cancelarPago(
  paymentId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const payment = await tx.rentPayment.findFirst({
      where: { id: paymentId, deletedAt: null },
      select: { id: true, leaseId: true },
    });
    if (!payment) return { error: "Pago no encontrado" } as const;
    await tx.rentPayment.update({
      where: { id: payment.id },
      data: { status: "cancelled" },
    });
    return { leaseId: payment.leaseId } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/rentas/${result.leaseId}`);
  return { ok: true };
}
