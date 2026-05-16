import { IcWrench } from "@/components/icons";
import { Badge, type BadgeTone, Card, EmptyState, Kpi } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

import { NewRequestModal } from "./new-request-modal";
import { StatusControl } from "./status-control";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
});

function fmtMxn(cents: bigint | null): string {
  if (cents == null) return "—";
  return `$${numFmt.format(Math.round(Number(cents) / 100))}`;
}

const CATEGORY_LABEL: Record<string, string> = {
  plumbing: "Plomería",
  electrical: "Eléctrico",
  painting: "Pintura",
  carpentry: "Carpintería",
  cleaning: "Limpieza",
  gardening: "Jardinería",
  structural: "Estructural",
  other: "Otro",
};

const PRIORITY: Record<string, { label: string; tone: BadgeTone }> = {
  low: { label: "Baja", tone: "neutral" },
  medium: { label: "Media", tone: "info" },
  high: { label: "Alta", tone: "warn" },
  urgent: { label: "Urgente", tone: "bad" },
};

/** Columnas del tablero, en orden de flujo. `cancelled` no se muestra. */
const COLUMNS: { status: string; label: string }[] = [
  { status: "new", label: "Nueva" },
  { status: "under_review", label: "En revisión" },
  { status: "assigned", label: "Asignada" },
  { status: "in_progress", label: "En progreso" },
  { status: "completed", label: "Completada" },
];

export default async function MantenimientoPage() {
  const ctx = await requireContext();

  const { requests, properties } = await withAppScope(
    appScope(ctx),
    async (tx) => {
      const requests = await tx.maintenanceRequest.findMany({
        where: { deletedAt: null },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          category: true,
          priority: true,
          status: true,
          estimatedCostCents: true,
          createdAt: true,
          property: { select: { name: true } },
          unit: { select: { name: true } },
        },
      });
      const properties = await tx.property.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      });
      return { requests, properties };
    },
  );

  const now = new Date();
  const thisMonth = now.getUTCMonth();
  const thisYear = now.getUTCFullYear();

  const abiertas = requests.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled",
  ).length;
  const enProgreso = requests.filter((r) => r.status === "in_progress").length;
  const completadasMes = requests.filter(
    (r) =>
      r.status === "completed" &&
      r.createdAt.getUTCMonth() === thisMonth &&
      r.createdAt.getUTCFullYear() === thisYear,
  ).length;
  const costoPendiente = requests
    .filter((r) => r.status !== "completed" && r.status !== "cancelled")
    .reduce((s, r) => s + Number(r.estimatedCostCents ?? 0n), 0);

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">Operación · propiedades</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Mantenimiento
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            Solicitudes de mantenimiento por propiedad, organizadas por estado.
          </p>
        </div>
        <NewRequestModal properties={properties} />
      </header>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi label="Abiertas" value={numFmt.format(abiertas)} note="sin completar" />
        </Card>
        <Card className="p-4">
          <Kpi label="En progreso" value={numFmt.format(enProgreso)} note="con cuadrilla activa" />
        </Card>
        <Card className="p-4">
          <Kpi label="Completadas" value={numFmt.format(completadasMes)} note="este mes" />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Costo estimado"
            value={`$${numFmt.format(Math.round(costoPendiente / 100))}`}
            note="MXN · solicitudes abiertas"
          />
        </Card>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={IcWrench}
          title="Sin solicitudes de mantenimiento"
          description="Registra la primera solicitud sobre una de tus propiedades. Aparecerá en el tablero por estado."
          accent
        />
      ) : (
        <div className="grid grid-cols-[repeat(5,minmax(220px,1fr))] gap-3 overflow-x-auto pb-2">
          {COLUMNS.map((col) => {
            const cards = requests.filter((r) => r.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[13px] font-semibold text-ink-800">
                    {col.label}
                  </span>
                  <span className="mono num text-[11px] text-ink-500">
                    {cards.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {cards.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-ink-200 px-3 py-6 text-center text-[11px] text-ink-400">
                      Vacío
                    </div>
                  ) : (
                    cards.map((r) => {
                      const pr = PRIORITY[r.priority] ?? PRIORITY.medium;
                      const target = r.unit
                        ? `${r.property?.name ?? "—"} · ${r.unit.name}`
                        : (r.property?.name ?? "—");
                      return (
                        <Card key={r.id} className="flex flex-col gap-2 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[13px] font-medium leading-snug text-ink-900">
                              {r.title}
                            </span>
                            <Badge tone={pr.tone}>{pr.label}</Badge>
                          </div>
                          <span className="mono truncate text-[11px] text-ink-500">
                            {target}
                          </span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-ink-500">
                              {CATEGORY_LABEL[r.category] ?? r.category}
                            </span>
                            <span className="mono text-[11px] text-ink-400">
                              {fmtMxn(r.estimatedCostCents)} ·{" "}
                              {dateFmt.format(r.createdAt)}
                            </span>
                          </div>
                          <StatusControl id={r.id} status={r.status} />
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
