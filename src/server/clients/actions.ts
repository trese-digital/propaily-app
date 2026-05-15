"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const CLIENT_TYPES = [
  "individual",
  "company",
  "trust",
  "family",
  "other",
] as const;

const ClientSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  type: z.enum(CLIENT_TYPES),
  primaryEmail: z
    .string()
    .trim()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional(),
  taxId: z.string().trim().optional(),
  fiscalAddress: z.string().trim().optional(),
  administrativeContact: z.string().trim().optional(),
  legalContact: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
});

const FIELDS = [
  "name",
  "type",
  "primaryEmail",
  "phone",
  "taxId",
  "fiscalAddress",
  "administrativeContact",
  "legalContact",
  "internalNotes",
] as const;

function readForm(formData: FormData) {
  const raw: Record<string, FormDataEntryValue | undefined> = {};
  for (const k of FIELDS) {
    const v = formData.get(k);
    raw[k] = v === "" ? undefined : (v ?? undefined);
  }
  // primaryEmail acepta "" para el schema (.or(literal(""))).
  if (raw.primaryEmail === undefined) raw.primaryEmail = "";
  return raw;
}

export type ClientFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parse(formData: FormData) {
  const parsed = ClientSchema.safeParse(readForm(formData));
  if (parsed.success) return { ok: true as const, data: parsed.data };
  const fieldErrors: Record<string, string> = {};
  for (const i of parsed.error.issues) {
    const k = i.path.join(".");
    if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
  }
  return { ok: false as const, fieldErrors };
}

function toData(v: z.infer<typeof ClientSchema>) {
  return {
    name: v.name,
    type: v.type,
    primaryEmail: v.primaryEmail ? v.primaryEmail : null,
    phone: v.phone ?? null,
    taxId: v.taxId ?? null,
    fiscalAddress: v.fiscalAddress ?? null,
    administrativeContact: v.administrativeContact ?? null,
    legalContact: v.legalContact ?? null,
    internalNotes: v.internalNotes ?? null,
  };
}

export async function crearCliente(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const ctx = await requireContext();
  // Sólo operadores GF dan de alta clientes. Un usuario family office está
  // acotado a su propio Client — la RLS WITH CHECK lo bloquearía igual.
  if (ctx.accessScope !== "gf") {
    return { error: "No tienes permiso para crear clientes." };
  }
  const p = parse(formData);
  if (!p.ok) return { error: "Revisa los campos marcados", fieldErrors: p.fieldErrors };

  const client = await withAppScope(appScope(ctx), (tx) =>
    tx.client.create({
      data: {
        managementCompanyId: ctx.membership.managementCompanyId,
        status: "active",
        ...toData(p.data),
      },
    }),
  );

  revalidatePath("/clientes");
  redirect(`/clientes/${client.id}`);
}

export async function editarCliente(
  clientId: string,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const ctx = await requireContext();
  const p = parse(formData);
  if (!p.ok) return { error: "Revisa los campos marcados", fieldErrors: p.fieldErrors };

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const existing = await tx.client.findFirst({
      where: { id: clientId, deletedAt: null },
    });
    if (!existing) return { error: "Cliente no encontrado" } as const;
    await tx.client.update({
      where: { id: existing.id },
      data: toData(p.data),
    });
    return { ok: true } as const;
  });

  if ("error" in result) return result;
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clientId}`);
  redirect(`/clientes/${clientId}`);
}
