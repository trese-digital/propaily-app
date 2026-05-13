/**
 * Detección de "staff GF" (operadores internos de GF Consultoría con acceso
 * cross-tenant al backoffice). Puente temporal hacia el futuro modelo de
 * permisos con PermissionGrant/PermissionTemplate (decisión Bloque 1).
 *
 * Hoy: miembro activo de la ManagementCompany llamada "GF Consultoría" con
 * rol elevado (super_admin / company_admin).
 *
 * Mañana: cuando ManagementCompany tenga flag `isPlatformOperator`, este
 * helper cambia su query sin tocar middleware ni layouts.
 */
import { dbBypass } from "@/server/db/scoped";

const GF_MC_NAME = "GF Consultoría";
const STAFF_ROLES = new Set(["super_admin", "company_admin"]);

export async function isGfStaff(userId: string): Promise<boolean> {
  const m = await dbBypass.membership.findFirst({
    where: {
      userId,
      status: "active",
      managementCompany: { name: GF_MC_NAME },
    },
    select: { role: true },
  });
  if (!m) return false;
  return STAFF_ROLES.has(m.role);
}
