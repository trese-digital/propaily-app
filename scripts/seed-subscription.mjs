/**
 * Seed / actualización de la Subscription de una ManagementCompany.
 * Idempotente.
 *
 * Uso:
 *   node scripts/seed-subscription.mjs                    → lista MCs y su Subscription actual
 *   node scripts/seed-subscription.mjs <id|nombre> <plan> [cartografia] [insights] [calculadoras]
 *
 * Ejemplos:
 *   node scripts/seed-subscription.mjs "GF Consultoría" enterprise cartografia insights calculadoras
 *   node scripts/seed-subscription.mjs "Family Piloto"  pro cartografia
 *
 * Plan: starter | growth | pro | enterprise | custom
 */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const VALID_PLANS = new Set(["starter", "growth", "pro", "enterprise", "custom"]);

const db = new PrismaClient();

async function listAll() {
  const mcs = await db.managementCompany.findMany({
    select: { id: true, name: true, subscription: true },
    orderBy: { name: "asc" },
  });
  if (mcs.length === 0) {
    console.log("(sin ManagementCompanies en la DB)");
    return;
  }
  console.log("ManagementCompanies:");
  for (const mc of mcs) {
    const sub = mc.subscription;
    if (!sub) {
      console.log(`  · ${mc.name}  [${mc.id}]  →  SIN suscripción`);
    } else {
      const addons =
        [
          sub.cartografiaEnabled && "cartografia",
          sub.insightsEnabled && "insights",
          sub.calculadorasEnabled && "calculadoras",
        ]
          .filter(Boolean)
          .join(", ") || "(ninguno)";
      console.log(
        `  · ${mc.name}  [${mc.id}]  →  ${sub.plan}/${sub.status}  addons: ${addons}`,
      );
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await listAll();
    console.log(
      '\nUso: node scripts/seed-subscription.mjs <id|nombre> <plan> [cartografia] [insights] [calculadoras]',
    );
    return;
  }

  const [target, plan, ...flagArgs] = args;
  if (!plan || !VALID_PLANS.has(plan)) {
    console.error(
      `Plan inválido o ausente. Permitidos: ${[...VALID_PLANS].join(", ")}`,
    );
    process.exit(1);
  }
  const flags = new Set(flagArgs);

  const mcs = await db.managementCompany.findMany({ select: { id: true, name: true } });
  const mc = mcs.find((m) => m.id === target || m.name === target);
  if (!mc) {
    console.error(`No encontré ManagementCompany con id o nombre "${target}"`);
    console.error(`Disponibles: ${mcs.map((m) => m.name).join(" | ") || "(ninguna)"}`);
    process.exit(1);
  }

  const data = {
    plan,
    status: "active",
    cartografiaEnabled: flags.has("cartografia"),
    insightsEnabled: flags.has("insights"),
    calculadorasEnabled: flags.has("calculadoras"),
    source: "manual_gf",
  };

  const sub = await db.subscription.upsert({
    where: { managementCompanyId: mc.id },
    update: data,
    create: { ...data, managementCompanyId: mc.id },
  });

  console.log(
    `[OK] Subscription para "${mc.name}" → plan=${sub.plan} addons=[${[
      sub.cartografiaEnabled && "cartografia",
      sub.insightsEnabled && "insights",
      sub.calculadorasEnabled && "calculadoras",
    ]
      .filter(Boolean)
      .join(", ") || "ninguno"}]`,
  );
}

main()
  .catch((e) => {
    console.error("FAIL:", e?.message ?? e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
