/**
 * Seed de la estructura family-office (S2 / decisión "ambos portales").
 *
 * Crea bajo la ManagementCompany "GF Consultoría":
 *   - 2 operadores GF (Membership.clientId = null → ven toda la MC):
 *       admin@propaily.com  · company_admin   (backoffice /admin)
 *       pablo@propaily.com  · company_operator (administra los family offices)
 *   - 3 family offices, cada uno = un Client + portafolio "General" + un usuario
 *     login (Membership.clientId = su Client, rol owner → ve SOLO lo suyo).
 *
 * Idempotente. Requiere que exista la MC "GF Consultoría" (corre seed-org.mjs
 * antes si hace falta). Las contraseñas son temporales — cámbiense al entrar.
 *
 * Uso:  node scripts/seed-family-offices.mjs
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
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

// Contraseña temporal — Supabase exige >= 6 caracteres.
const PASSWORD = "123456";

const OPERATORS = [
  { email: "admin@propaily.com", name: "Pablo Torres", role: "company_admin" },
  { email: "pablo@propaily.com", name: "Pablo Torres", role: "company_operator" },
];

// type: ClientType — los 3 son "family office" → family.
const FAMILY_OFFICES = [
  { clientName: "Grupo Velazquez", email: "grupovelazquez@propaily.com", userName: "Grupo Velazquez" },
  { clientName: "Familia Gorozpe Velazquez", email: "gorver@propaily.com", userName: "Familia Gorozpe Velazquez" },
  { clientName: "Familia Torres Santa Maria", email: "torres@propaily.com", userName: "Familia Torres Santa Maria" },
];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const db = new PrismaClient();

/** Crea o actualiza un usuario en Supabase Auth. Devuelve el usuario. */
async function ensureAuthUser(email, name) {
  const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (list.error) throw list.error;
  const found = list.data.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (found) {
    const upd = await supabase.auth.admin.updateUserById(found.id, {
      email_confirm: true,
      password: PASSWORD,
      user_metadata: { name },
    });
    if (upd.error) throw upd.error;
    return upd.data.user;
  }
  const created = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { name },
  });
  if (created.error) throw created.error;
  return created.data.user;
}

/** Sincroniza el usuario de Supabase con propaily.User. */
async function ensurePrismaUser(authUser, name) {
  return db.user.upsert({
    where: { id: authUser.id },
    update: { email: authUser.email, name, status: "active" },
    create: { id: authUser.id, email: authUser.email, name, status: "active" },
  });
}

try {
  // 1) ManagementCompany operadora.
  const mc = await db.managementCompany.findFirst({
    where: { name: "GF Consultoría" },
  });
  if (!mc) {
    console.error('No existe la MC "GF Consultoría". Corre `node scripts/seed-org.mjs` primero.');
    process.exit(1);
  }
  if (!mc.isPlatformOperator) {
    await db.managementCompany.update({
      where: { id: mc.id },
      data: { isPlatformOperator: true },
    });
  }
  console.log(`[OK] ManagementCompany: ${mc.name} (${mc.id})`);

  // 2) Operadores GF (clientId = null).
  for (const op of OPERATORS) {
    const authUser = await ensureAuthUser(op.email, op.name);
    const user = await ensurePrismaUser(authUser, op.name);
    await db.membership.upsert({
      where: {
        userId_managementCompanyId: {
          userId: user.id,
          managementCompanyId: mc.id,
        },
      },
      update: { role: op.role, status: "active", clientId: null },
      create: {
        userId: user.id,
        managementCompanyId: mc.id,
        role: op.role,
        status: "active",
      },
    });
    console.log(`[OK] Operador GF: ${op.email} · ${op.role}`);
  }

  // 3) Family offices: Client + Portfolio + usuario login.
  for (const fo of FAMILY_OFFICES) {
    let client = await db.client.findFirst({
      where: { managementCompanyId: mc.id, name: fo.clientName },
    });
    if (!client) {
      client = await db.client.create({
        data: {
          managementCompanyId: mc.id,
          name: fo.clientName,
          type: "family",
          primaryEmail: fo.email,
          status: "active",
        },
      });
      console.log(`[OK] Client creado: ${client.name} (${client.id})`);
    } else {
      console.log(`[OK] Client ya existía: ${client.name} (${client.id})`);
    }

    let portfolio = await db.portfolio.findFirst({
      where: { clientId: client.id, name: "General" },
    });
    if (!portfolio) {
      portfolio = await db.portfolio.create({
        data: {
          clientId: client.id,
          name: "General",
          description: "Portafolio inicial",
          status: "active",
        },
      });
      console.log(`     portafolio "General" creado (${portfolio.id})`);
    }

    const authUser = await ensureAuthUser(fo.email, fo.userName);
    const user = await ensurePrismaUser(authUser, fo.userName);
    await db.membership.upsert({
      where: {
        userId_managementCompanyId: {
          userId: user.id,
          managementCompanyId: mc.id,
        },
      },
      update: { role: "owner", status: "active", clientId: client.id },
      create: {
        userId: user.id,
        managementCompanyId: mc.id,
        role: "owner",
        status: "active",
        clientId: client.id,
      },
    });
    console.log(`[OK] Login family office: ${fo.email} → ${client.name}`);
  }

  console.log("\n──────────────────────────────────────────────");
  console.log("Listo. Cuentas (contraseña temporal: " + PASSWORD + "):");
  console.log("  Backoffice:   admin@propaily.com");
  console.log("  Operador FO:  pablo@propaily.com");
  for (const fo of FAMILY_OFFICES) console.log(`  Family office: ${fo.email}  → ${fo.clientName}`);
  console.log("Login: http://localhost:3000/login");
} catch (e) {
  console.error("FAIL:", e?.message ?? e);
  process.exit(1);
} finally {
  await db.$disconnect();
}
