/**
 * Smoke test del spike RLS.
 *
 * Verifica que las policies de Client / Portfolio / Property aíslan
 * correctamente por `app.management_company_id` y que `propaily_bypass`
 * ve todo cross-tenant.
 *
 * Crea (si no existen) dos ManagementCompanies temporales — _A y _B —
 * con su cadena Client → Portfolio → Property. Limpia al final.
 *
 * Uso: node scripts/test-rls.mjs
 */
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const { Client: PgClient } = pg;

// Conexión como superuser (gfc) para preparar fixtures.
const ownerUrl = process.env.DATABASE_URL.split("?")[0];
// Conexiones con los roles RLS-aware.
const appUrl = ownerUrl.replace(
  /^postgresql:\/\/[^:]+:[^@]+@/,
  "postgresql://propaily_app:propaily_app_dev_2026@",
);
const bypassUrl = ownerUrl.replace(
  /^postgresql:\/\/[^:]+:[^@]+@/,
  "postgresql://propaily_bypass:propaily_bypass_dev_2026@",
);

function uuid() {
  return crypto.randomUUID();
}

async function run() {
  const setup = new PgClient({ connectionString: ownerUrl });
  await setup.connect();

  // ---- 1) Fixtures ----
  const platformId = (
    await setup.query(`SELECT id FROM propaily."Platform" LIMIT 1`)
  ).rows[0]?.id;
  if (!platformId) {
    throw new Error("No Platform en DB — corre scripts/seed-org.mjs primero");
  }

  // Idempotencia: si ya existen, los reusamos.
  const ensureMc = async (name) => {
    const r = await setup.query(
      `SELECT id FROM propaily."ManagementCompany" WHERE name = $1`,
      [name],
    );
    if (r.rows[0]) return r.rows[0].id;
    const id = uuid();
    await setup.query(
      `INSERT INTO propaily."ManagementCompany"(id, "platformId", name, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'active', NOW(), NOW())`,
      [id, platformId, name],
    );
    return id;
  };
  const ensureClient = async (mcId, name) => {
    const r = await setup.query(
      `SELECT id FROM propaily."Client" WHERE "managementCompanyId" = $1 AND name = $2`,
      [mcId, name],
    );
    if (r.rows[0]) return r.rows[0].id;
    const id = uuid();
    await setup.query(
      `INSERT INTO propaily."Client"(id, "managementCompanyId", name, type, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'company', 'active', NOW(), NOW())`,
      [id, mcId, name],
    );
    return id;
  };
  const ensurePortfolio = async (clientId, name) => {
    const r = await setup.query(
      `SELECT id FROM propaily."Portfolio" WHERE "clientId" = $1 AND name = $2`,
      [clientId, name],
    );
    if (r.rows[0]) return r.rows[0].id;
    const id = uuid();
    await setup.query(
      `INSERT INTO propaily."Portfolio"(id, "clientId", name, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'active', NOW(), NOW())`,
      [id, clientId, name],
    );
    return id;
  };
  const ensureProperty = async (portfolioId, name) => {
    const r = await setup.query(
      `SELECT id FROM propaily."Property" WHERE "portfolioId" = $1 AND name = $2`,
      [portfolioId, name],
    );
    if (r.rows[0]) return r.rows[0].id;
    const id = uuid();
    await setup.query(
      `INSERT INTO propaily."Property"(id, "portfolioId", name, type, "operationalStatus", currency, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'house', 'active', 'MXN', 'active', NOW(), NOW())`,
      [id, portfolioId, name],
    );
    return id;
  };

  const mcA = await ensureMc("RLS Test · MC_A");
  const mcB = await ensureMc("RLS Test · MC_B");
  const clA = await ensureClient(mcA, "RLS Test · Cliente_A");
  const clB = await ensureClient(mcB, "RLS Test · Cliente_B");
  const poA = await ensurePortfolio(clA, "RLS Test · Pf_A");
  const poB = await ensurePortfolio(clB, "RLS Test · Pf_B");
  const prA = await ensureProperty(poA, "RLS Test · Prop_A");
  const prB = await ensureProperty(poB, "RLS Test · Prop_B");

  await setup.end();
  console.log(`Fixtures listos. mcA=${mcA} mcB=${mcB}\n`);

  // ---- 2) Verificar como propaily_app ----
  const tests = [];

  async function appQuery(label, mcId, expectedNames) {
    const c = new PgClient({ connectionString: appUrl });
    await c.connect();
    try {
      await c.query("BEGIN");
      if (mcId !== null) {
        // set_config(name, value, is_local=true) ≡ SET LOCAL, pero permite
        // placeholder $1 que `SET LOCAL` no acepta.
        await c.query(`SELECT set_config('app.management_company_id', $1, true)`, [mcId]);
      }
      const r = await c.query(
        `SELECT name FROM propaily."Property" WHERE name LIKE 'RLS Test · Prop_%' ORDER BY name`,
      );
      const got = r.rows.map((x) => x.name);
      const ok =
        got.length === expectedNames.length &&
        got.every((n, i) => n === expectedNames[i]);
      tests.push({ label, ok, expected: expectedNames, got });
      await c.query("COMMIT");
    } finally {
      await c.end();
    }
  }

  await appQuery("app + SET mcA → ve solo Prop_A", mcA, ["RLS Test · Prop_A"]);
  await appQuery("app + SET mcB → ve solo Prop_B", mcB, ["RLS Test · Prop_B"]);
  await appQuery("app sin SET → ve 0 (fail-closed)", null, []);

  // ---- 3) Verificar como propaily_bypass ----
  const bypass = new PgClient({ connectionString: bypassUrl });
  await bypass.connect();
  const all = await bypass.query(
    `SELECT name FROM propaily."Property" WHERE name LIKE 'RLS Test · Prop_%' ORDER BY name`,
  );
  await bypass.end();
  tests.push({
    label: "bypass → ve A y B",
    ok: all.rows.length === 2,
    expected: ["RLS Test · Prop_A", "RLS Test · Prop_B"],
    got: all.rows.map((x) => x.name),
  });

  // ---- 4) Reporte ----
  console.log("Resultados:");
  let allOk = true;
  for (const t of tests) {
    const mark = t.ok ? "✓" : "✗";
    console.log(`  ${mark} ${t.label}`);
    if (!t.ok) {
      allOk = false;
      console.log(`     expected: ${JSON.stringify(t.expected)}`);
      console.log(`     got:      ${JSON.stringify(t.got)}`);
    }
  }
  console.log();
  if (!allOk) {
    console.error("RLS spike FAIL");
    process.exit(1);
  }
  console.log("RLS spike PASS ✓");
}

run().catch((e) => {
  console.error("FAIL:", e);
  process.exit(1);
});
