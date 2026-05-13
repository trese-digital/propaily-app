/**
 * Smoke test rápido de las API routes de cartografía: hace login con el SDK
 * de Supabase (anon key) y usa el access_token como Bearer.
 *
 * Uso: node scripts/smoke-api.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = "pablo.torres.sm@gmail.com";
const PWD = "GFC2026admin";

const sb = createClient(URL, ANON, { auth: { persistSession: false } });
const { data, error } = await sb.auth.signInWithPassword({ email: EMAIL, password: PWD });
if (error) {
  console.error("login fail:", error.message);
  process.exit(1);
}
console.log(`login OK · user.id=${data.user.id}`);

// Re-construye la cookie que @supabase/ssr espera. Para simplicidad usamos
// el access_token como Authorization: Bearer — funciona porque createServerClient
// de Supabase también acepta ese header.
const token = data.session.access_token;
const APP = "http://localhost:3000";
async function check(url) {
  const r = await fetch(`${APP}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const ct = r.headers.get("content-type") ?? "";
  const body = ct.includes("json") ? await r.json() : (await r.text()).slice(0, 200);
  console.log(
    `${r.status}  ${url}  ${
      typeof body === "object" && body && "count" in body
        ? `count=${body.count}`
        : JSON.stringify(body).slice(0, 80)
    }`,
  );
  return { status: r.status, body };
}

await check("/api/cartografia/colonias?bbox=-101.71,21.13,-101.69,21.15&ano=2026");
await check("/api/cartografia/tramos?bbox=-101.71,21.13,-101.69,21.15&ano=2026");
await check("/api/cartografia/search?q=jardines");
