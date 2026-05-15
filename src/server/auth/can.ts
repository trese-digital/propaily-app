/**
 * `can` — helper de permisos de Propaily (S6, decisión F).
 *
 * Capa de autorización **semántica** sobre el rol del `Membership`. La idea es
 * adopción incremental: el código nuevo (gestión de usuarios, etc.) consulta
 * `can(ctx, "user.manage")` en vez de inspeccionar el rol crudo. El código
 * viejo sigue funcionando sin tocarse.
 *
 * Modelo actual = permisos derivados del rol base. La granularidad fina por
 * recurso (`PermissionGrant`: deny/allow por propiedad/portafolio) se conecta
 * aquí en S8 — por eso `can` ya recibe un `scope` opcional, hoy ignorado.
 *
 * No reemplaza a RLS: RLS aísla por tenant/cliente en la DB; `can` decide qué
 * acciones ofrece la UI y valida intención en las Server Actions.
 */
import type { Role } from "@prisma/client";

import type { AppContext } from "./context";
import { isClientAdminRole, isGfStaffRole } from "./roles";

/** Acciones que el código puede pedir autorización para ejecutar. */
export type Permission =
  | "client.manage"
  | "portfolio.manage"
  | "property.manage"
  | "lease.manage"
  | "valuation.request"
  | "user.manage";

const ALL_PERMISSIONS: readonly Permission[] = [
  "client.manage",
  "portfolio.manage",
  "property.manage",
  "lease.manage",
  "valuation.request",
  "user.manage",
];

/**
 * Permisos base por rol:
 *  - **Staff GF** (super_admin / company_admin / company_operator): todo
 *    dentro de su ManagementCompany.
 *  - **owner** (administrador del family office): administra su Client por
 *    completo — propiedades, rentas, usuarios, solicitudes de valuación.
 *  - **guest / tenant / vendor**: sólo lectura — ningún permiso de escritura.
 */
function permissionsForRole(role: Role): ReadonlySet<Permission> {
  if (isGfStaffRole(role)) return new Set(ALL_PERMISSIONS);
  if (isClientAdminRole(role)) return new Set(ALL_PERMISSIONS);
  return new Set();
}

/**
 * ¿El usuario del contexto puede ejecutar `permission`?
 *
 * `scope` queda reservado para los `PermissionGrant` por recurso (S8); hoy la
 * decisión es puramente por rol.
 */
export function can(
  ctx: AppContext,
  permission: Permission,
  _scope?: { type: "client" | "portfolio" | "property"; id: string },
): boolean {
  return permissionsForRole(ctx.membership.role as Role).has(permission);
}

/** Variante que lanza — para Server Actions que deben abortar sin permiso. */
export function assertCan(ctx: AppContext, permission: Permission): void {
  if (!can(ctx, permission)) {
    throw new Error("No tienes permiso para realizar esta acción.");
  }
}
