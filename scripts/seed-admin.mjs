/**
 * Crea el usuario admin inicial en Supabase Auth + propaily.User.
 *
 * Uso:
 *   ADMIN_EMAIL=pablo.torres.sm@gmail.com ADMIN_PASSWORD=GFC2026admin \
 *     node scripts/seed-admin.mjs
 *
 * Idempotente: si el email ya existe en Supabase, sólo actualiza Prisma.
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pablo.torres.sm@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "GFC2026admin";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Pablo Torres";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const db = new PrismaClient();

async function ensureAuthUser() {
  // Buscar existente
  const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (list.error) throw list.error;
  const found = list.data.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  if (found) {
    // Asegurar que esté confirmado y la pwd sea la esperada (opcional)
    const upd = await supabase.auth.admin.updateUserById(found.id, {
      email_confirm: true,
      password: ADMIN_PASSWORD,
      user_metadata: { name: ADMIN_NAME },
    });
    if (upd.error) throw upd.error;
    return upd.data.user;
  }
  const created = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { name: ADMIN_NAME },
  });
  if (created.error) throw created.error;
  return created.data.user;
}

async function ensurePrismaUser(authUser) {
  return db.user.upsert({
    where: { id: authUser.id },
    update: { email: authUser.email, name: ADMIN_NAME, status: "active" },
    create: { id: authUser.id, email: authUser.email, name: ADMIN_NAME, status: "active" },
  });
}

try {
  const u = await ensureAuthUser();
  console.log(`[OK] Supabase user: ${u.email} (${u.id})`);
  const p = await ensurePrismaUser(u);
  console.log(`[OK] Prisma user:   ${p.email} (${p.id}) status=${p.status}`);
  console.log("\nLogin URL: http://localhost:3000/login");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Pwd:   ${ADMIN_PASSWORD}`);
} catch (e) {
  console.error("FAIL:", e?.message ?? e);
  process.exit(1);
} finally {
  await db.$disconnect();
}
