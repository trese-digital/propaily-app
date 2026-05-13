"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { db } from "@/server/db/client";
import { requireContext } from "@/server/auth/context";
import { createAdminClient } from "@/lib/supabase/server";

const BUCKET = "propaily-documents";
// Formatos válidos detectados por sharp (no por header del browser).
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "gif", "heif"]);
const MAX_PHOTOS_PER_PROPERTY = 24;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB (regla AGENTS.md §4)
const MAX_DIMENSION = 2000; // px
const WEBP_QUALITY = 82;
// TTL para signed URLs inline (regla AGENTS.md §3): imágenes 15 min, docs 60s.
const IMAGE_SIGNED_TTL_SECONDS = 60 * 15;

export type AddPhotoState = {
  error?: string;
  ok?: boolean;
  ts?: number;
  uploaded?: number;
  failed?: number;
};

function sanitize(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 60);
}

/**
 * Optimiza una imagen: rotación auto (orientación EXIF), resize a 2000px máx
 * en el lado mayor, conversión a WebP con calidad 82.
 * Reduce típicamente el peso 60-80%.
 */
async function optimizeImage(buf: Buffer): Promise<{ data: Buffer; width: number; height: number }> {
  const img = sharp(buf, { failOn: "none" }).rotate(); // respeta EXIF orientation
  const meta = await img.metadata();
  const needsResize =
    (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;

  const pipeline = needsResize
    ? img.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    : img;

  const out = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer({ resolveWithObject: true });

  return {
    data: out.data,
    width: out.info.width,
    height: out.info.height,
  };
}

async function uploadOnePhoto(opts: {
  propertyId: string;
  managementCompanyId: string;
  file: File;
  displayOrder: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { propertyId, managementCompanyId, file, displayOrder } = opts;

  if (file.size > MAX_SIZE) {
    return { ok: false, error: `${file.name} excede 10 MB` };
  }

  const inputBuf = Buffer.from(await file.arrayBuffer());

  // Validación de formato real con sharp (no por file.type del browser).
  let meta;
  try {
    meta = await sharp(inputBuf, { failOn: "none" }).metadata();
  } catch {
    return { ok: false, error: `${file.name} no es una imagen válida` };
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
    return { ok: false, error: `Formato no soportado: ${file.name}` };
  }

  const optimized = await optimizeImage(inputBuf);

  const photoId = crypto.randomUUID();
  const baseName = sanitize(file.name.replace(/\.[^.]+$/, "")) || "photo";
  const storageKey = `${managementCompanyId}/property/${propertyId}/gallery/${photoId}-${baseName}.webp`;

  const sb = createAdminClient();
  const up = await sb.storage.from(BUCKET).upload(storageKey, optimized.data, {
    contentType: "image/webp",
    upsert: false,
  });
  if (up.error) return { ok: false, error: up.error.message };

  await db.propertyPhoto.create({
    data: {
      id: photoId,
      propertyId,
      storageKey,
      displayOrder,
      sizeBytes: optimized.data.length,
      contentType: "image/webp",
      width: optimized.width,
      height: optimized.height,
    },
  });
  return { ok: true };
}

export async function addPropertyPhoto(
  _prev: AddPhotoState,
  formData: FormData,
): Promise<AddPhotoState> {
  const ctx = await requireContext();
  const propertyId = String(formData.get("propertyId") ?? "");
  const files = formData.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);

  if (!propertyId) return { error: "propertyId requerido" };
  if (files.length === 0) return { error: "Selecciona al menos una imagen" };

  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
      deletedAt: null,
    },
  });
  if (!property) return { error: "Propiedad no encontrada" };

  const photoCount = await db.propertyPhoto.count({ where: { propertyId: property.id } });
  const availableSlots = MAX_PHOTOS_PER_PROPERTY - photoCount;
  if (availableSlots <= 0) {
    return { error: `Máximo ${MAX_PHOTOS_PER_PROPERTY} fotos por propiedad` };
  }

  const toUpload = files.slice(0, availableSlots);
  const skipped = files.length - toUpload.length;

  let uploaded = 0;
  const errors: string[] = [];
  for (let i = 0; i < toUpload.length; i++) {
    const r = await uploadOnePhoto({
      propertyId: property.id,
      managementCompanyId: ctx.membership.managementCompanyId,
      file: toUpload[i],
      displayOrder: photoCount + i,
    });
    if (r.ok) uploaded++;
    else errors.push(r.error);
  }

  revalidatePath(`/propiedades/${property.id}`);

  if (uploaded === 0) {
    return { error: errors[0] ?? "No se pudo subir ninguna foto" };
  }
  return {
    ok: true,
    ts: Date.now(),
    uploaded,
    failed: errors.length + skipped,
    error:
      errors.length || skipped > 0
        ? `${uploaded} subidas, ${errors.length + skipped} no procesadas${skipped > 0 ? ` (cupo de ${MAX_PHOTOS_PER_PROPERTY})` : ""}`
        : undefined,
  };
}

export async function deletePropertyPhoto(photoId: string): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  const photo = await db.propertyPhoto.findFirst({
    where: {
      id: photoId,
      property: {
        portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
      },
    },
    select: { id: true, propertyId: true, storageKey: true },
  });
  if (!photo) return { error: "Foto no encontrada" };

  const sb = createAdminClient();
  await sb.storage.from(BUCKET).remove([photo.storageKey]);
  await db.propertyPhoto.delete({ where: { id: photo.id } });

  revalidatePath(`/propiedades/${photo.propertyId}`);
  return { ok: true };
}

export async function getPhotoUrl(storageKey: string): Promise<string | null> {
  const sb = createAdminClient();
  const signed = await sb.storage.from(BUCKET).createSignedUrl(storageKey, IMAGE_SIGNED_TTL_SECONDS);
  if (signed.error) return null;
  return signed.data.signedUrl;
}

export async function setPropertyCoverFromPhoto(
  photoId: string,
): Promise<{ ok?: boolean; error?: string }> {
  const ctx = await requireContext();
  const photo = await db.propertyPhoto.findFirst({
    where: {
      id: photoId,
      property: {
        portfolio: { client: { managementCompanyId: ctx.membership.managementCompanyId } },
      },
    },
  });
  if (!photo) return { error: "Foto no encontrada" };

  await db.property.update({
    where: { id: photo.propertyId },
    data: { coverPhotoStorageKey: photo.storageKey },
  });

  revalidatePath(`/propiedades/${photo.propertyId}`);
  revalidatePath("/propiedades");
  return { ok: true };
}
