"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { withAppScope } from "@/server/db/scoped";
import { appScope, requireContext } from "@/server/auth/context";
import { createAdminClient } from "@/lib/supabase/server";

const BUCKET = "propaily-documents";
// Formatos válidos detectados por sharp (no por el header del browser).
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "gif", "heif"]);
const MAX_INPUT = 10 * 1024 * 1024; // 10 MB (regla AGENTS.md §4)
const COVER_MAX_WIDTH = 1600;
const COVER_QUALITY = 80;
// TTL para signed URLs de imágenes mostradas en página (regla AGENTS.md §3).
// Documentos descargables siguen usando 60s; imágenes inline 15 min.
const IMAGE_SIGNED_TTL_SECONDS = 60 * 15;

export type SetCoverPhotoState = { error?: string; ok?: boolean; ts?: number };

export async function setPropertyCoverPhoto(
  _prev: SetCoverPhotoState,
  formData: FormData,
): Promise<SetCoverPhotoState> {
  const ctx = await requireContext();

  const propertyId = String(formData.get("propertyId") ?? "");
  const file = formData.get("file");
  if (!propertyId) return { error: "propertyId requerido" };
  if (!(file instanceof File) || file.size === 0) return { error: "Selecciona una imagen" };
  if (file.size > MAX_INPUT) return { error: "La imagen excede 10 MB" };

  const property = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findFirst({ where: { id: propertyId, deletedAt: null } }),
  );
  if (!property) return { error: "Propiedad no encontrada" };

  // Validación de formato real con sharp (no por file.type del browser).
  const inputBuf = Buffer.from(await file.arrayBuffer());
  const probe = sharp(inputBuf, { failOn: "none" });
  let meta;
  try {
    meta = await probe.metadata();
  } catch {
    return { error: "Archivo no es una imagen válida" };
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
    return { error: "Formato no soportado (JPG, PNG, WebP, GIF, HEIC)" };
  }

  // Optimizo: resize + webp
  const optimized = await sharp(inputBuf, { failOn: "none" })
    .rotate()
    .resize({ width: COVER_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: COVER_QUALITY, effort: 4 })
    .toBuffer();

  const storageKey = `${ctx.membership.managementCompanyId}/property/${property.id}/cover.webp`;

  const sb = createAdminClient();
  // Si había una portada con otra extensión, la quito.
  if (property.coverPhotoStorageKey && property.coverPhotoStorageKey !== storageKey) {
    await sb.storage.from(BUCKET).remove([property.coverPhotoStorageKey]);
  }

  const up = await sb.storage.from(BUCKET).upload(storageKey, optimized, {
    contentType: "image/webp",
    upsert: true,
  });
  if (up.error) return { error: up.error.message };

  await withAppScope(appScope(ctx), (tx) =>
    tx.property.update({
      where: { id: property.id },
      data: { coverPhotoStorageKey: storageKey },
    }),
  );

  revalidatePath(`/propiedades/${property.id}`);
  revalidatePath("/propiedades");
  return { ok: true, ts: Date.now() };
}

export async function getPropertyCoverUrl(storageKey: string): Promise<string | null> {
  if (!storageKey) return null;
  const sb = createAdminClient();
  const signed = await sb.storage.from(BUCKET).createSignedUrl(storageKey, IMAGE_SIGNED_TTL_SECONDS);
  if (signed.error) return null;
  return signed.data.signedUrl;
}
