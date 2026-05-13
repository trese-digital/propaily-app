/**
 * Crea el bucket privado "propaily-documents" en Supabase Storage.
 *
 * Estructura de paths:
 *   {management_company_id}/{entity_type}/{entity_id}/{document_id}/v{version}-{filename}
 *
 * El bucket es PRIVADO. Los archivos se sirven con signed URLs (60s).
 *
 * Uso: node scripts/seed-storage.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "propaily-documents";

const sb = createClient(URL, SERVICE, { auth: { persistSession: false } });

try {
  const list = await sb.storage.listBuckets();
  if (list.error) throw list.error;
  const found = list.data.find((b) => b.name === BUCKET);
  if (found) {
    console.log(`[OK] Bucket "${BUCKET}" ya existía. public=${found.public}`);
  } else {
    const created = await sb.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: 26214400, // 25 MB por archivo
      // Sin allowedMimeTypes — permitir cualquier archivo de oficina.
    });
    if (created.error) throw created.error;
    console.log(`[OK] Bucket "${BUCKET}" creado (privado, 25 MB max).`);
  }
  console.log("\nReady. Storage configurado.");
} catch (e) {
  console.error("FAIL:", e?.message ?? e);
  process.exit(1);
}
