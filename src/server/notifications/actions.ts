"use server";

import { revalidatePath } from "next/cache";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function marcarAvisoLeido(
  id: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  if (!UUID_RE.test(id)) return { error: "Aviso inválido" };

  await withAppScope(appScope(ctx), (tx) =>
    // El filtro por userId impide marcar avisos de otro usuario de la misma MC.
    tx.notification.updateMany({
      where: { id, userId: ctx.user.id, readAt: null },
      data: { readAt: new Date() },
    }),
  );

  revalidatePath("/avisos");
  return { ok: true };
}

export async function marcarTodosLeidos(): Promise<{ ok: boolean }> {
  const ctx = await requireContext();

  await withAppScope(appScope(ctx), (tx) =>
    tx.notification.updateMany({
      where: { userId: ctx.user.id, channel: "in_app", readAt: null },
      data: { readAt: new Date() },
    }),
  );

  revalidatePath("/avisos");
  return { ok: true };
}
