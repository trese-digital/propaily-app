/**
 * Portafolio Demo — siembra (o borra) el dataset de demostración de la PWA mobile.
 *
 * Crea bajo la ManagementCompany "GF Consultoría":
 *   - Client  "Portafolio Demo — Familia Mendoza"  (type: family)
 *       internalNotes contiene el tag PORTAFOLIO_DEMO → así se identifica y borra.
 *   - Portfolio "Portafolio Demo"
 *   - 4 propiedades + sus contratos (Lease) + pagos de renta (RentPayment).
 *
 * Espeja `src/features/mobile/demo-data.ts` — las 21 pantallas leen de ese
 * módulo en Fase 1; este seed deja los mismos datos en la DB para la Fase 2.
 *
 * Uso:
 *   node scripts/demo-portfolio.mjs          → borra lo previo y vuelve a sembrar
 *   node scripts/demo-portfolio.mjs --wipe   → solo borra el Portafolio Demo
 */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

const DEMO_TAG = "PORTAFOLIO_DEMO";
const db = new PrismaClient();

const M = (millions) => BigInt(Math.round(millions * 1_000_000)) * 100n;
const PESOS = (n) => BigInt(n) * 100n;

const PROPERTIES = [
  {
    name: "Casa Polanco 412",
    type: "house",
    operationalStatus: "rented",
    address: "Polanco V Sección",
    city: "Ciudad de México",
    state: "CDMX",
    landAreaSqm: 218,
    currentValueCents: M(8.4),
    fiscalValueCents: M(5.18),
    expectedRentCents: PESOS(38000),
    lease: { tenant: "Sofía Mendoza", rent: 38000, day: 1 },
  },
  {
    name: "Loft Condesa",
    type: "apartment",
    operationalStatus: "rented",
    address: "Condesa",
    city: "Ciudad de México",
    state: "CDMX",
    landAreaSqm: 92,
    currentValueCents: M(3.2),
    expectedRentCents: PESOS(19500),
    lease: { tenant: "Carlos y Mariana", rent: 19500, day: 1 },
  },
  {
    name: "Edificio Roma 88 · A-302",
    type: "apartment",
    operationalStatus: "rented",
    address: "Roma Norte",
    city: "Ciudad de México",
    state: "CDMX",
    landAreaSqm: 1420,
    currentValueCents: M(48),
    expectedRentCents: PESOS(24500),
    lease: { tenant: "Daniel Reyes", rent: 24500, day: 15 },
  },
  {
    name: "Local Del Valle 12",
    type: "commercial_space",
    operationalStatus: "available",
    address: "Del Valle",
    city: "Ciudad de México",
    state: "CDMX",
    landAreaSqm: 180,
    currentValueCents: M(6.1),
    expectedRentCents: PESOS(32000),
    lease: null,
  },
];

async function findManagementCompany() {
  const mc =
    (await db.managementCompany.findFirst({ where: { name: "GF Consultoría" } })) ??
    (await db.managementCompany.findFirst({ where: { isPlatformOperator: true } })) ??
    (await db.managementCompany.findFirst());
  if (!mc) {
    throw new Error(
      "No hay ninguna ManagementCompany. Corre scripts/seed-org.mjs primero.",
    );
  }
  return mc;
}

async function wipe() {
  const clients = await db.client.findMany({
    where: { internalNotes: { contains: DEMO_TAG } },
    include: { portfolios: { include: { properties: true } } },
  });
  for (const c of clients) {
    for (const p of c.portfolios) {
      // Property → Lease/RentPayment es onDelete: Cascade.
      await db.property.deleteMany({ where: { portfolioId: p.id } });
      await db.portfolio.delete({ where: { id: p.id } });
    }
    await db.client.delete({ where: { id: c.id } });
  }
  console.log(`Portafolio Demo borrado (${clients.length} client(s)).`);
}

async function seed() {
  await wipe();
  const mc = await findManagementCompany();

  const client = await db.client.create({
    data: {
      managementCompanyId: mc.id,
      name: "Portafolio Demo — Familia Mendoza",
      type: "family",
      primaryEmail: "pablo@gfc.mx",
      internalNotes: `${DEMO_TAG} · dataset de demostración de la PWA mobile. Borrable con scripts/demo-portfolio.mjs --wipe.`,
    },
  });

  const portfolio = await db.portfolio.create({
    data: {
      clientId: client.id,
      name: "Portafolio Demo",
      description: "Datos de demostración para la PWA mobile (app.propaily.com).",
    },
  });

  const now = new Date();
  for (const p of PROPERTIES) {
    const property = await db.property.create({
      data: {
        portfolioId: portfolio.id,
        name: p.name,
        type: p.type,
        operationalStatus: p.operationalStatus,
        address: p.address,
        city: p.city,
        state: p.state,
        country: "México",
        landAreaSqm: p.landAreaSqm,
        currency: "MXN",
        currentValueCents: p.currentValueCents,
        fiscalValueCents: p.fiscalValueCents ?? null,
        expectedRentCents: p.expectedRentCents,
        internalNotes: DEMO_TAG,
      },
    });

    if (p.lease) {
      const lease = await db.lease.create({
        data: {
          propertyId: property.id,
          tenantName: p.lease.tenant,
          monthlyRentCents: PESOS(p.lease.rent),
          currency: "MXN",
          paymentDay: p.lease.day,
          startDate: new Date(2024, 5, 1),
          endDate: new Date(2027, 4, 31),
          status: "active",
          notes: DEMO_TAG,
        },
      });
      // 3 últimos pagos: 2 confirmados + 1 pendiente del mes en curso.
      for (let i = 2; i >= 0; i--) {
        const due = new Date(now.getFullYear(), now.getMonth() - i, p.lease.day);
        await db.rentPayment.create({
          data: {
            leaseId: lease.id,
            amountCents: PESOS(p.lease.rent),
            currency: "MXN",
            periodMonth: due.getMonth() + 1,
            periodYear: due.getFullYear(),
            dueDate: due,
            paidAt: i > 0 ? due : null,
            status: i > 0 ? "confirmed" : "pending",
            notes: DEMO_TAG,
          },
        });
      }
    }
  }

  console.log(
    `Portafolio Demo sembrado: client ${client.id}, portfolio ${portfolio.id}, ${PROPERTIES.length} propiedades.`,
  );
}

const run = process.argv.includes("--wipe") ? wipe : seed;
run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
