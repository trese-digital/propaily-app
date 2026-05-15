/**
 * Verifica el aislamiento RLS de los family offices (S2).
 *
 * Conecta como `propaily_app` (rol sujeto a RLS) y comprueba que:
 *   - cada family office, con su `app.client_id` seteado, ve SÓLO su Client
 *     y sus portafolios — no los de los otros family offices;
 *   - un operador GF (sin `app.client_id`) ve los 3.
 *
 * Uso:  node scripts/verify-fo-isolation.mjs
 */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

// dbOwner — conexión gfc (owner): para leer los ids sin RLS.
const dbOwner = new PrismaClient();
// dbApp — conexión propaily_app: SUJETA a RLS. Es la que prueba el aislamiento.
const dbApp = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_APP } },
});

/** Ejecuta `fn` con el scope de RLS seteado (MC + opcionalmente Client). */
async function withScope(mcId, clientId, fn) {
  return dbApp.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.management_company_id', ${mcId}, true)`;
    if (clientId) {
      await tx.$executeRaw`SELECT set_config('app.client_id', ${clientId}, true)`;
    }
    return fn(tx);
  });
}

let failures = 0;
function check(label, ok, detail) {
  console.log(`${ok ? "  ✓" : "  ✗ FALLA"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

try {
  const mc = await dbOwner.managementCompany.findFirst({
    where: { name: "GF Consultoría" },
  });
  if (!mc) throw new Error('No existe la MC "GF Consultoría".');

  const foNames = [
    "Grupo Velazquez",
    "Familia Gorozpe Velazquez",
    "Familia Torres Santa Maria",
  ];
  const clients = await dbOwner.client.findMany({
    where: { managementCompanyId: mc.id, name: { in: foNames } },
    select: { id: true, name: true },
  });
  if (clients.length !== 3) {
    throw new Error(`Esperaba 3 family offices, encontré ${clients.length}. Corre seed-family-offices.mjs.`);
  }

  console.log("\n── Cada family office ve SÓLO lo suyo ─────────────────");
  for (const c of clients) {
    const visibleClients = await withScope(mc.id, c.id, (tx) =>
      tx.client.findMany({ select: { id: true, name: true } }),
    );
    check(
      `${c.name}: ve 1 Client`,
      visibleClients.length === 1 && visibleClients[0]?.id === c.id,
      `vio ${visibleClients.length} (${visibleClients.map((x) => x.name).join(", ")})`,
    );

    const visiblePortfolios = await withScope(mc.id, c.id, (tx) =>
      tx.portfolio.findMany({ select: { clientId: true } }),
    );
    const allOwn = visiblePortfolios.every((p) => p.clientId === c.id);
    check(
      `${c.name}: todos sus portafolios son propios`,
      allOwn,
      `${visiblePortfolios.length} portafolios visibles`,
    );

    // Membership (S2b): un family office sólo ve los memberships de su Client.
    const visibleMemberships = await withScope(mc.id, c.id, (tx) =>
      tx.membership.findMany({ select: { clientId: true } }),
    );
    check(
      `${c.name}: sólo ve memberships de su Client`,
      visibleMemberships.length > 0 &&
        visibleMemberships.every((m) => m.clientId === c.id),
      `${visibleMemberships.length} memberships visibles`,
    );

    // Intento cruzado: ¿puede ver el Client de OTRO family office por id?
    const other = clients.find((x) => x.id !== c.id);
    const leaked = await withScope(mc.id, c.id, (tx) =>
      tx.client.findFirst({ where: { id: other.id } }),
    );
    check(
      `${c.name}: NO puede leer a "${other.name}"`,
      leaked === null,
      leaked ? "¡FUGA! lo vio" : undefined,
    );
  }

  console.log("\n── El operador GF ve los 3 ────────────────────────────");
  const operatorView = await withScope(mc.id, null, (tx) =>
    tx.client.findMany({ where: { name: { in: foNames } }, select: { name: true } }),
  );
  check(
    "Operador (sin app.client_id) ve los 3 family offices",
    operatorView.length === 3,
    `vio ${operatorView.length}`,
  );

  console.log(
    `\n${failures === 0 ? "✅ TODO OK — aislamiento correcto." : `❌ ${failures} fallo(s).`}`,
  );
  process.exit(failures === 0 ? 0 : 1);
} catch (e) {
  console.error("FAIL:", e?.message ?? e);
  process.exit(1);
} finally {
  await dbOwner.$disconnect();
  await dbApp.$disconnect();
}
