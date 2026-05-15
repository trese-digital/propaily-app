import Link from "next/link";

import { dbBypass } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { logAdminAccess } from "@/server/audit/log";

const cardLink =
  "block rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5 transition-colors hover:border-[var(--color-pp-300)] hover:shadow-sm";

export default async function AdminHome() {
  const ctx = await requireContext();

  // Conteos cross-tenant. Cada vista al dashboard queda registrada.
  const [tenants, propiedades, avaluosPendientes] = await Promise.all([
    dbBypass.managementCompany.count({ where: { deletedAt: null } }),
    dbBypass.property.count({ where: { deletedAt: null, status: { not: "deleted" } } }),
    dbBypass.valuationRequest.count({ where: { status: "pending" } }),
    logAdminAccess({
      actorId: ctx.user.id,
      action: "view",
      entityType: "AdminDashboard",
      metadata: { route: "/admin" },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF · vista cross-tenant
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Resumen
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Operación de Propaily para todos los tenants activos.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Cuentas activas" value={tenants} sub="ManagementCompany sin borrar" />
        <Stat label="Propiedades en la red" value={propiedades} sub="Total cross-tenant" />
        <Stat
          label="Avalúos pendientes"
          value={avaluosPendientes}
          sub="ValuationRequest en `pending`"
          accent={avaluosPendientes > 0}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={"/admin/tenants" as never} className={cardLink}>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Tenants
          </p>
          <h2 className="mt-2 text-base font-semibold">Cuentas y suscripciones</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Activar / desactivar addons, ver pago, ver estado.
          </p>
        </Link>
        <Link href={"/admin/avaluos" as never} className={cardLink}>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Avalúos
          </p>
          <h2 className="mt-2 text-base font-semibold">Cola de valuaciones</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Pendientes solicitados + altas directas anuales.
          </p>
        </Link>
        <Link href={"/admin/cartografia" as never} className={cardLink}>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Cartografía
          </p>
          <h2 className="mt-2 text-base font-semibold">Vincular lotes</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Conectar propiedades de clientes con su lote catastral.
          </p>
        </Link>
        <Link href={"/admin/auditoria" as never} className={cardLink}>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Auditoría
          </p>
          <h2 className="mt-2 text-base font-semibold">Trazabilidad</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Accesos y acciones del staff GF cross-tenant.
          </p>
        </Link>
      </section>

      <p className="mt-10 text-xs text-[var(--fg-muted)]">
        Próximamente: cola de tareas asignadas, generador de reportes anuales.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-[var(--bg)] p-4 ${
        accent ? "border-[var(--color-pp-300)] ring-1 ring-[var(--color-pp-200)]" : "border-[var(--border)]"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          accent ? "text-[var(--color-pp-700)]" : "text-[var(--fg)]"
        }`}
      >
        {new Intl.NumberFormat("es-MX").format(value)}
      </p>
      <p className="mt-1 text-xs text-[var(--fg-muted)]">{sub}</p>
    </div>
  );
}
