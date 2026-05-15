import Link from "next/link";

import { Badge, type BadgeTone } from "@/components/ui";
import { dbBypass } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { logAdminAccess } from "@/server/audit/log";

const dtFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const ACTION: Record<string, { label: string; tone: BadgeTone }> = {
  view: { label: "Ver", tone: "neutral" },
  list: { label: "Listar", tone: "neutral" },
  create: { label: "Crear", tone: "ok" },
  update: { label: "Editar", tone: "info" },
  delete: { label: "Borrar", tone: "bad" },
  impersonate: { label: "Impersonar", tone: "violet" },
};

const TAKE = 150;

export default async function AdminAuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const ctx = await requireContext();
  const { tipo } = await searchParams;

  const [logs, types] = await Promise.all([
    dbBypass.auditLog.findMany({
      where: tipo ? { entityType: tipo } : {},
      orderBy: { createdAt: "desc" },
      take: TAKE,
      include: {
        actor: { select: { name: true, email: true } },
        managementCompany: { select: { name: true } },
      },
    }),
    dbBypass.auditLog.groupBy({
      by: ["entityType"],
      _count: { entityType: true },
    }),
  ]);

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "list",
    entityType: "AuditLog",
    metadata: { route: "/admin/auditoria", filter: tipo ?? null },
  });

  const entityTypes = types
    .map((t) => ({ type: t.entityType, count: t._count.entityType }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF · trazabilidad
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Auditoría
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Cada acceso y acción del staff GF queda registrado. Mostrando los{" "}
          {TAKE} eventos más recientes.
        </p>
      </header>

      {/* Filtros por tipo de entidad */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <FilterChip label="Todos" href="/admin/auditoria" active={!tipo} />
        {entityTypes.map((e) => (
          <FilterChip
            key={e.type}
            label={`${e.type} · ${e.count}`}
            href={`/admin/auditoria?tipo=${encodeURIComponent(e.type)}`}
            active={tipo === e.type}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
            <tr>
              {["Cuándo", "Actor", "Acción", "Entidad", "Cuenta"].map((h) => (
                <th
                  key={h}
                  className="border-b border-[var(--border)] px-3.5 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.04em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3.5 py-8 text-center text-sm text-[var(--fg-muted)]"
                >
                  Sin eventos registrados{tipo ? ` para "${tipo}"` : ""}.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const a = ACTION[log.action] ?? { label: log.action, tone: "neutral" as BadgeTone };
                return (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-3.5 py-2.5 font-mono text-xs text-[var(--fg-muted)]">
                      {dtFmt.format(log.createdAt)}
                    </td>
                    <td className="px-3.5 py-2.5">
                      {log.actor?.name ?? log.actor?.email ?? (
                        <span className="text-[var(--fg-subtle)]">—</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <Badge tone={a.tone}>{a.label}</Badge>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="text-[var(--fg)]">{log.entityType}</span>
                      {log.entityId && (
                        <span className="ml-1.5 font-mono text-[11px] text-[var(--fg-subtle)]">
                          {log.entityId.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-[var(--fg-muted)]">
                      {log.managementCompany?.name ?? (
                        <span className="text-[var(--fg-subtle)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active
          ? "border-[var(--color-pp-300)] bg-[var(--accent-soft)] text-[var(--color-pp-700)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--bg-muted)]"
      }`}
    >
      {label}
    </Link>
  );
}
