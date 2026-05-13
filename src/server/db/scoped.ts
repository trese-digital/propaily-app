/**
 * Clientes Prisma con awareness de RLS (Fase 4).
 *
 * Tres roles DB:
 *   1. gfc (default `db`)        — superuser, owner, bypassea RLS. Reservado
 *                                  para migraciones, seeds y mantenimiento.
 *                                  NO usar desde route handlers / actions.
 *   2. propaily_app (`dbApp`)     — sujeto a RLS. Las queries SOLO devuelven
 *                                  filas de la ManagementCompany cuyo id se
 *                                  haya seteado en `app.management_company_id`
 *                                  vía SET LOCAL.
 *   3. propaily_bypass (`dbBypass`) — BYPASSRLS. Vista cross-tenant para el
 *                                  backoffice GF. Cada uso debería emparejarse
 *                                  con AuditLog.
 *
 * Uso desde el portal cliente:
 *
 *   import { withTenant } from "@/server/db/scoped";
 *   const properties = await withTenant(mcId, (tx) =>
 *     tx.property.findMany({ where: { ... } })
 *   );
 *
 * Uso desde el backoffice GF (cross-tenant):
 *
 *   import { dbBypass } from "@/server/db/scoped";
 *   const tenants = await dbBypass.managementCompany.findMany();
 *
 * Notas:
 * - `withTenant` abre una `$transaction` y ejecuta `set_config(..., true)`
 *   antes del callback. `true` = is_local → el setting se descarta al
 *   commit/rollback, así que no contamina conexiones que vuelven al pool.
 * - El callback debe usar el `tx` que recibe — NO el `db` global.
 * - Si la query falla, la transacción rolea back; el setting nunca persiste.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaApp?: PrismaClient;
  prismaBypass?: PrismaClient;
};

export const dbApp =
  globalForPrisma.prismaApp ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_APP ?? process.env.DATABASE_URL } },
  });

export const dbBypass =
  globalForPrisma.prismaBypass ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL_BYPASS ?? process.env.DATABASE_URL },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaApp = dbApp;
  globalForPrisma.prismaBypass = dbBypass;
}

/**
 * Ejecuta `fn` en una transacción que tiene `app.management_company_id`
 * seteado a `managementCompanyId`. Las queries dentro de `fn` están sujetas
 * a las policies RLS — sólo verán filas de esa ManagementCompany.
 *
 * Usar el `tx` recibido (no el `dbApp` global) para que el SET tenga efecto.
 */
export async function withTenant<T>(
  managementCompanyId: string,
  fn: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>,
): Promise<T> {
  return dbApp.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.management_company_id', ${managementCompanyId}, true)`;
    return fn(tx);
  });
}
