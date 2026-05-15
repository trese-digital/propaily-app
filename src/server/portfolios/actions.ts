"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PortfolioSchema = z.object({
  clientId: z.string().trim().refine((v) => UUID_RE.test(v), "Cliente inválido"),
  name: z.string().trim().min(1, "Nombre requerido"),
  description: z.string().trim().optional(),
});

export type PortfolioFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

export async function crearPortafolio(
  _prev: PortfolioFormState,
  formData: FormData,
): Promise<PortfolioFormState> {
  const ctx = await requireContext();
  const parsed = PortfolioSchema.safeParse({
    clientId: formData.get("clientId"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
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
    // El Cliente debe ser visible para este scope (RLS); si no, no es accesible.
    const client = await tx.client.findFirst({
      where: { id: v.clientId, deletedAt: null },
    });
    if (!client) {
      return { error: "El cliente no existe o no es accesible." } as const;
    }
    await tx.portfolio.create({
      data: {
        clientId: client.id,
        name: v.name,
        description: v.description ?? null,
        status: "active",
      },
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath(`/clientes/${v.clientId}`);
  revalidatePath("/clientes");
  return { ok: true };
}
