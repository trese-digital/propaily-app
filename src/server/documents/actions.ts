"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fileTypeFromBuffer } from "file-type";

import { withTenant } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { createAdminClient } from "@/lib/supabase/server";

const BUCKET = "propaily-documents";
// MIME válidos para documentos (PDF + imágenes comunes). Se valida con bytes reales,
// no con el header del browser (regla AGENTS.md §4).
const ALLOWED_DOC_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB para PDFs (regla AGENTS.md §4)

const DOC_CATEGORIES = [
  "deed",
  "purchase_contract",
  "lease_contract",
  "commercial_valuation",
  "fiscal_valuation",
  "identification",
  "power_of_attorney",
  "bank_statement",
  "tax",
  "insurance",
  "floor_plan",
  "maintenance",
  "payment_proof",
  "legal",
  "other",
] as const;

const UploadSchema = z.object({
  name: z.string().trim().min(1),
  category: z.enum(DOC_CATEGORIES),
  sensitivity: z.enum(["normal", "sensitive"]).default("normal"),
  propertyId: z.string().uuid(),
});

export type UploadDocumentState = { error?: string; ok?: boolean; ts?: number };

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

export async function uploadDocument(
  _prev: UploadDocumentState,
  formData: FormData,
): Promise<UploadDocumentState> {
  const ctx = await requireContext();

  const parsed = UploadSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    sensitivity: formData.get("sensitivity") || "normal",
    propertyId: formData.get("propertyId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const v = parsed.data;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo" };
  }
  if (file.size > MAX_DOC_BYTES) {
    return { error: "El archivo excede 25 MB" };
  }

  // Validación de MIME por bytes reales (regla AGENTS.md §4 — no confiar en file.type).
  const fileBuf = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(fileBuf);
  if (!detected || !ALLOWED_DOC_MIMES.has(detected.mime)) {
    return { error: "Formato no soportado (PDF, JPG, PNG, WebP, HEIC)" };
  }

  // withTenant abre $transaction y setea app.management_company_id — todas las
  // queries de adentro respetan RLS y rolean back juntas si algo falla.
  const sb = createAdminClient();
  const filename = sanitizeFilename(file.name);

  try {
    const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
      const property = await tx.property.findFirst({
        where: { id: v.propertyId, deletedAt: null },
      });
      if (!property) return { error: "Propiedad no encontrada" } as const;

      const d = await tx.document.create({
        data: {
          propertyId: property.id,
          name: v.name,
          category: v.category,
          sensitivity: v.sensitivity,
          approvalStatus: "not_required",
          status: "active",
        },
      });
      const version = 1;
      const storageKey = `${ctx.membership.managementCompanyId}/property/${property.id}/${d.id}/v${version}-${filename}`;

      // Upload a Supabase (usamos el contentType detectado por bytes, no por header).
      const up = await sb.storage.from(BUCKET).upload(storageKey, fileBuf, {
        contentType: detected.mime,
        upsert: false,
      });
      if (up.error) throw new Error(up.error.message);

      const dv = await tx.documentVersion.create({
        data: {
          documentId: d.id,
          version,
          storageKey,
          fileName: filename,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          uploadedById: ctx.user.id,
        },
      });

      await tx.document.update({
        where: { id: d.id },
        data: { currentVersionId: dv.id },
      });

      return { propertyId: property.id } as const;
    });

    if ("error" in result) return result;
    revalidatePath(`/propiedades/${result.propertyId}`);
    return { ok: true, ts: Date.now() };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al subir" };
  }
}

export async function getDocumentSignedUrl(documentId: string): Promise<{ url?: string; error?: string }> {
  const ctx = await requireContext();
  const d = await withTenant(ctx.membership.managementCompanyId, (tx) =>
    tx.document.findFirst({
      where: { id: documentId, status: { not: "deleted" } },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    }),
  );
  if (!d || !d.versions[0]) return { error: "Documento no encontrado" };

  const sb = createAdminClient();
  const signed = await sb.storage.from(BUCKET).createSignedUrl(d.versions[0].storageKey, 60);
  if (signed.error) return { error: signed.error.message };
  return { url: signed.data.signedUrl };
}

const EditSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  category: z.enum(DOC_CATEGORIES),
  sensitivity: z.enum(["normal", "sensitive"]),
});

export type EditDocumentState = { error?: string; ok?: boolean; ts?: number };

export async function editDocument(
  documentId: string,
  _prev: EditDocumentState,
  formData: FormData,
): Promise<EditDocumentState> {
  const ctx = await requireContext();
  const parsed = EditSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    sensitivity: formData.get("sensitivity") || "normal",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const d = await tx.document.findFirst({
      where: { id: documentId, status: { not: "deleted" } },
      select: { id: true, propertyId: true },
    });
    if (!d) return { error: "Documento no encontrado" } as const;
    await tx.document.update({
      where: { id: d.id },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        sensitivity: parsed.data.sensitivity,
      },
    });
    return { propertyId: d.propertyId } as const;
  });

  if ("error" in result) return result;
  if (result.propertyId) revalidatePath(`/propiedades/${result.propertyId}`);
  return { ok: true, ts: Date.now() };
}

export async function deleteDocument(documentId: string): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  const result = await withTenant(ctx.membership.managementCompanyId, async (tx) => {
    const d = await tx.document.findFirst({
      where: { id: documentId, status: { not: "deleted" } },
      select: { id: true, propertyId: true },
    });
    if (!d) return { error: "Documento no encontrado" } as const;
    // Soft delete (los archivos quedan en storage para auditoría).
    await tx.document.update({
      where: { id: d.id },
      data: { status: "deleted", deletedAt: new Date() },
    });
    return { propertyId: d.propertyId } as const;
  });

  if ("error" in result) return result;
  if (result.propertyId) revalidatePath(`/propiedades/${result.propertyId}`);
  return { ok: true };
}
