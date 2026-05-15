/**
 * Detección de "staff GF" — operadores internos con acceso cross-tenant al
 * backoffice. Puente hacia el modelo de permisos granular (PermissionGrant),
 * que se implementa en S6/S8.
 *
 * Staff GF = miembro activo de una ManagementCompany operadora de plataforma
 * (`isPlatformOperator = true`) con rol de staff (ver `roles.ts`).
 *
 * Antes (pre-S2) esto se detectaba por el nombre literal "GF Consultoría";
 * ahora usa el flag `isPlatformOperator` (decisión S2-C).
 */
import { isGfStaffRole } from "@/server/auth/roles";
import { dbBypass } from "@/server/db/scoped";

export async function isGfStaff(userId: string): Promise<boolean> {
  const m = await dbBypass.membership.findFirst({
    where: {
      userId,
      status: "active",
      managementCompany: { isPlatformOperator: true },
      // clientId null = operador. Un membership acotado a un Client (portal
      // family office) NUNCA es staff, aunque su rol fuera de staff — así
      // `accessScope: "client"` y staff son excluyentes por construcción.
      clientId: null,
    },
    select: { role: true },
  });
  if (!m) return false;
  return isGfStaffRole(m.role);
}
