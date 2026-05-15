/**
 * Seed de la organización inicial: Platform "GFC" + ManagementCompany
 * "GF Consultoría" + Membership del admin como company_admin.
 *
 * Idempotente. Asume que seed-admin.mjs ya corrió.
 *
 * Uso: node scripts/seed-org.mjs
 */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pablo.torres.sm@gmail.com";

const db = new PrismaClient();

try {
  // Platform (GFC)
  let platform = await db.platform.findFirst({ where: { name: "GFC" } });
  if (!platform) {
    platform = await db.platform.create({ data: { name: "GFC" } });
    console.log(`[OK] Platform creada: ${platform.id}`);
  } else {
    console.log(`[OK] Platform ya existía: ${platform.id}`);
  }

  // ManagementCompany (GF Consultoría)
  let mc = await db.managementCompany.findFirst({
    where: { platformId: platform.id, name: "GF Consultoría" },
  });
  if (!mc) {
    mc = await db.managementCompany.create({
      data: {
        platformId: platform.id,
        name: "GF Consultoría",
        legalName: "GF Consultoría S.A. de C.V.",
        primaryColor: "#070B1F",
        accentColor: "#00B6D4",
        reportFooter: "GF Consultoría · León, Gto.",
        // GF Consultoría es la MC operadora de la plataforma (S2).
        isPlatformOperator: true,
        status: "active",
      },
    });
    console.log(`[OK] ManagementCompany creada: ${mc.id}`);
  } else {
    // Asegura el flag en instalaciones previas a S2.
    mc = await db.managementCompany.update({
      where: { id: mc.id },
      data: { isPlatformOperator: true },
    });
    console.log(`[OK] ManagementCompany ya existía (isPlatformOperator=true): ${mc.id}`);
  }

  // Admin Membership
  const user = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!user) {
    console.error(`Admin user no existe (${ADMIN_EMAIL}). Corre seed-admin.mjs primero.`);
    process.exit(1);
  }
  const m = await db.membership.upsert({
    where: { userId_managementCompanyId: { userId: user.id, managementCompanyId: mc.id } },
    update: { role: "company_admin", status: "active" },
    create: {
      userId: user.id,
      managementCompanyId: mc.id,
      role: "company_admin",
      status: "active",
    },
  });
  console.log(`[OK] Membership admin: ${m.id} (role=${m.role})`);

  // Cliente demo + portafolio demo para tener algo donde colgar propiedades.
  let demoClient = await db.client.findFirst({
    where: { managementCompanyId: mc.id, name: "Portafolio interno GFC" },
  });
  if (!demoClient) {
    demoClient = await db.client.create({
      data: {
        managementCompanyId: mc.id,
        name: "Portafolio interno GFC",
        type: "company",
        primaryEmail: ADMIN_EMAIL,
        internalNotes: "Cliente por defecto para propiedades sin cliente asignado",
        status: "active",
      },
    });
    console.log(`[OK] Cliente demo creado: ${demoClient.id}`);
  } else {
    console.log(`[OK] Cliente demo ya existía: ${demoClient.id}`);
  }

  let demoPortfolio = await db.portfolio.findFirst({
    where: { clientId: demoClient.id, name: "General" },
  });
  if (!demoPortfolio) {
    demoPortfolio = await db.portfolio.create({
      data: {
        clientId: demoClient.id,
        name: "General",
        description: "Portafolio por defecto",
        status: "active",
      },
    });
    console.log(`[OK] Portafolio demo creado: ${demoPortfolio.id}`);
  } else {
    console.log(`[OK] Portafolio demo ya existía: ${demoPortfolio.id}`);
  }

  console.log("\nReady. Usuario admin ya puede crear propiedades.");
} catch (e) {
  console.error("FAIL:", e?.message ?? e);
  process.exit(1);
} finally {
  await db.$disconnect();
}
