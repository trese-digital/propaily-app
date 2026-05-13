/**
 * AuditLog — escrituras al modelo `AuditLog` de Prisma.
 *
 * Decisión Bloque 5: log en CADA read y write cross-tenant del staff GF
 * (un acceso = una entrada). En el lado cliente (un user opera dentro
 * de su propia MC) NO se loguea — ya hay scoping por managementCompanyId.
 *
 * Fire-and-forget: si la inserción falla, no romper el flujo del caller.
 * Idea: registrar la auditoría no debe ser razón para que un GET 200
 * termine en 500.
 */
import { headers } from "next/headers";

// AuditLog está bloqueado por RLS para `propaily_app` (policy USING(false)).
// El log se escribe con `dbBypass` — esto es deliberado: el actor está
// identificado en la fila, así que sólo el staff GF y los scripts de
// mantenimiento ven la traza.
import { dbBypass } from "@/server/db/scoped";

export type AuditAction =
  | "view"
  | "list"
  | "create"
  | "update"
  | "delete"
  | "impersonate";

export type LogAccessOpts = {
  actorId: string;
  action: AuditAction;
  entityType: string;
  /** ID del recurso afectado (opcional para list / view de dashboards). */
  entityId?: string;
  /**
   * Si el acceso es a recursos de UNA ManagementCompany distinta a la del
   * actor, pasar su id aquí. En operaciones list/dashboard cross-tenant,
   * dejar `undefined`.
   */
  managementCompanyId?: string;
  metadata?: Record<string, unknown>;
};

export async function logAccess(
  opts: LogAccessOpts & { ipAddress?: string | null; userAgent?: string | null },
): Promise<void> {
  try {
    await dbBypass.auditLog.create({
      data: {
        actorId: opts.actorId,
        managementCompanyId: opts.managementCompanyId ?? null,
        action: opts.action,
        entityType: opts.entityType,
        entityId: opts.entityId ?? null,
        metadata: (opts.metadata as never) ?? undefined,
        ipAddress: opts.ipAddress ?? null,
        userAgent: opts.userAgent ?? null,
      },
    });
  } catch (e) {
    // Audit que falla no debe romper la operación principal.
    console.error("[audit] failed to write entry", e);
  }
}

/**
 * Variante para usar dentro de Server Components / Server Actions /
 * Route Handlers — extrae IP y User-Agent del `headers()` de Next 16.
 */
export async function logAdminAccess(opts: LogAccessOpts): Promise<void> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const ua = h.get("user-agent") ?? null;
  await logAccess({ ...opts, ipAddress: ip, userAgent: ua });
}
