/**
 * Smoke del helper `withTenant` / `dbBypass` (Fase 4.3).
 * Usa los mismos fixtures que test-rls.mjs.
 */
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PrismaClient } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const dbApp = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_APP } },
});
const dbBypass = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_BYPASS } },
});
const dbOwner = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function withTenant(mcId, fn) {
  return dbApp.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.management_company_id', ${mcId}, true)`;
    return fn(tx);
  });
}

async function main() {
  // Recuperar fixtures creados por test-rls.mjs.
  const mcs = await dbOwner.managementCompany.findMany({
    where: { name: { in: ["RLS Test · MC_A", "RLS Test · MC_B"] } },
    orderBy: { name: "asc" },
  });
  if (mcs.length !== 2) {
    throw new Error(
      "Faltan fixtures. Corre scripts/test-rls.mjs antes para crearlos.",
    );
  }
  const [mcA, mcB] = mcs;

  const checks = [];

  const propsA = await withTenant(mcA.id, (tx) =>
    tx.property.findMany({
      where: { name: { startsWith: "RLS Test · Prop_" } },
      select: { name: true },
    }),
  );
  checks.push({
    label: "withTenant(A) → sólo Prop_A",
    ok: propsA.length === 1 && propsA[0].name === "RLS Test · Prop_A",
    got: propsA.map((p) => p.name),
  });

  const propsB = await withTenant(mcB.id, (tx) =>
    tx.property.findMany({
      where: { name: { startsWith: "RLS Test · Prop_" } },
      select: { name: true },
    }),
  );
  checks.push({
    label: "withTenant(B) → sólo Prop_B",
    ok: propsB.length === 1 && propsB[0].name === "RLS Test · Prop_B",
    got: propsB.map((p) => p.name),
  });

  // dbApp directo (sin withTenant) → fail-closed.
  const propsDirect = await dbApp.property.findMany({
    where: { name: { startsWith: "RLS Test · Prop_" } },
    select: { name: true },
  });
  checks.push({
    label: "dbApp directo sin SET → 0 rows",
    ok: propsDirect.length === 0,
    got: propsDirect.map((p) => p.name),
  });

  // dbBypass → ve todo cross-tenant.
  const propsBypass = await dbBypass.property.findMany({
    where: { name: { startsWith: "RLS Test · Prop_" } },
    select: { name: true },
    orderBy: { name: "asc" },
  });
  checks.push({
    label: "dbBypass → ve A y B",
    ok: propsBypass.length === 2,
    got: propsBypass.map((p) => p.name),
  });

  // dbOwner (gfc, owner sin FORCE) → ve todo (back door esperado).
  const propsOwner = await dbOwner.property.findMany({
    where: { name: { startsWith: "RLS Test · Prop_" } },
    select: { name: true },
    orderBy: { name: "asc" },
  });
  checks.push({
    label: "dbOwner (gfc, NO FORCE) → ve todo (back door)",
    ok: propsOwner.length === 2,
    got: propsOwner.map((p) => p.name),
  });

  let allOk = true;
  for (const c of checks) {
    const mark = c.ok ? "✓" : "✗";
    console.log(`  ${mark} ${c.label}`);
    if (!c.ok) {
      allOk = false;
      console.log(`     got: ${JSON.stringify(c.got)}`);
    }
  }
  console.log();
  if (!allOk) {
    console.error("Helper RLS FAIL");
    process.exit(1);
  }
  console.log("Helper RLS PASS ✓");
}

main()
  .catch((e) => {
    console.error("FAIL:", e);
    process.exit(1);
  })
  .finally(async () => {
    await dbApp.$disconnect();
    await dbBypass.$disconnect();
    await dbOwner.$disconnect();
  });
