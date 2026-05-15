/**
 * Capa semántica sobre el enum `Role` de Prisma.
 *
 * Decisión S2-B: el enum NO se renombra — renombrarlo rompería migraciones
 * congeladas y datos existentes. En su lugar, este módulo le da significado de
 * negocio. La granularidad fina (permisos por recurso) vive en `PermissionGrant`
 * y se implementa en S6/S8.
 *
 * Dos mundos:
 *  - **Staff GF** — operan el backoffice. Son miembros de la ManagementCompany
 *    operadora de plataforma (`isPlatformOperator = true`) con rol elevado.
 *  - **Cliente** — usuarios del portal del family office.
 */
import type { Role } from "@prisma/client";

/**
 * Roles que, dentro de la MC operadora de plataforma, cuentan como staff GF
 * con acceso al backoffice cross-tenant.
 */
const GF_STAFF_ROLES: ReadonlySet<Role> = new Set<Role>([
  "super_admin",
  "company_admin",
  "company_operator",
]);

/** Roles administrativos del lado cliente (pueden escribir, invitar, etc.). */
const CLIENT_ADMIN_ROLES: ReadonlySet<Role> = new Set<Role>(["owner"]);

/** ¿Este rol es de staff GF? (sólo relevante dentro de la MC operadora). */
export function isGfStaffRole(role: Role): boolean {
  return GF_STAFF_ROLES.has(role);
}

/** ¿Este rol puede administrar (escribir) del lado cliente? */
export function isClientAdminRole(role: Role): boolean {
  return CLIENT_ADMIN_ROLES.has(role) || GF_STAFF_ROLES.has(role);
}

/** Etiqueta legible del rol para UI en español. */
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super administrador",
  company_admin: "Administrador",
  company_operator: "Operador",
  owner: "Propietario",
  guest: "Invitado",
  tenant: "Inquilino",
  vendor: "Proveedor",
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}
