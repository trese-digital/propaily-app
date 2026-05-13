"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { db } from "@/server/db/client";
import { requireContext } from "@/server/auth/context";
import { createAdminClient } from "@/lib/supabase/server";

const BUCKET = "propaily-documents";
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const MAX_INPUT = 25 * 1024 * 1024;
const COVER_MAX_WIDTH = 1600;
const COVER_QUALITY = 80;

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
  if (!ALLOWED_MIME.includes(file.type))
    return { error: "Formato no soportado (JPG, PNG, WebP, GIF, HEIC)" };
  if (file.size > MAX_INPUT) return { error: "La imagen excede 25 MB" };

  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
      deletedAt: null,
    },
  });
  if (!property) return { error: "Propiedad no encontrada" };

  // Optimizo: resize + webp
  const inputBuf = Buffer.from(await file.arrayBuffer());
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

  await db.property.update({
    where: { id: property.id },
    data: { coverPhotoStorageKey: storageKey },
  });

  revalidatePath(`/propiedades/${property.id}`);
  revalidatePath("/propiedades");
  return { ok: true, ts: Date.now() };
}

export async function getPropertyCoverUrl(storageKey: string): Promise<string | null> {
  if (!storageKey) return null;
  const sb = createAdminClient();
  const signed = await sb.storage.from(BUCKET).createSignedUrl(storageKey, 60 * 60); // 1h
  if (signed.error) return null;
  return signed.data.signedUrl;
}
