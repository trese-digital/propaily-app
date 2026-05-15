import { Badge, type BadgeTone } from "@/components/ui";
import { dbBypass } from "@/server/db/scoped";
import { requireContext } from "@/server/auth/context";
import { logAdminAccess } from "@/server/audit/log";
import {
  CompleteButton,
  RegisterValuationButton,
  TakeButton,
  type PropertyOption,
} from "./queue-actions";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const VALUATION_TYPE_LABEL: Record<string, string> = {
  professional: "Profesional GF",
  commercial: "Comercial",
  fiscal: "Fiscal",
  insurance: "Seguro",
  manual: "Manual",
};

const REQ_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pendiente", tone: "warn" },
  in_progress: { label: "En progreso", tone: "info" },
};

function fmtMxn(cents: bigint): string {
  return `$${numFmt.format(Math.round(Number(cents) / 100))}`;
}

export default async function AdminAvaluosPage() {
  const ctx = await requireContext();

  const [requests, properties, recent] = await Promise.all([
    dbBypass.valuationRequest.findMany({
      where: { status: { in: ["pending", "in_progress"] } },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      include: {
        property: {
          select: {
            id: true,
            name: true,
            portfolio: { select: { client: { select: { name: true } } } },
          },
        },
      },
    }),
    dbBypass.property.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        portfolio: { select: { client: { select: { name: true } } } },
      },
    }),
    dbBypass.valuation.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { property: { select: { name: true } } },
    }),
  ]);

  await logAdminAccess({
    actorId: ctx.user.id,
    action: "list",
    entityType: "ValuationRequest",
    metadata: { route: "/admin/avaluos", pendingCount: requests.length },
  });

  const propertyOptions: PropertyOption[] = properties.map((p) => ({
    id: p.id,
    name: p.name,
    clientName: p.portfolio.client.name,
  }));

  const pendientes = requests.filter((r) => r.status === "pending").length;
  const enProgreso = requests.filter((r) => r.status === "in_progress").length;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            Backoffice GF · servicio profesional
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Avalúos
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {pendientes} pendiente{pendientes === 1 ? "" : "s"} · {enProgreso} en progreso
          </p>
        </div>
        <RegisterValuationButton
          properties={propertyOptions}
          label="Registrar valuación"
        />
      </header>

      {/* Cola de solicitudes */}
      <section className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-[var(--fg)]">
          Cola de solicitudes
        </h2>
        {requests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center text-sm text-[var(--fg-muted)]">
            No hay solicitudes pendientes. Las nuevas peticiones de los clientes
            aparecerán aquí.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {requests.map((r) => {
              const st = REQ_STATUS[r.status] ?? REQ_STATUS.pending;
              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={st.tone}>{st.label}</Badge>
                      <span className="truncate text-sm font-medium text-[var(--fg)]">
                        {r.property.name}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-[var(--fg-muted)]">
                      {r.property.portfolio.client.name} · solicitada el{" "}
                      {dateFmt.format(r.createdAt)}
                    </p>
                    {r.notes && (
                      <p className="mt-1.5 text-[13px] leading-snug text-[var(--fg)]">
                        “{r.notes}”
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {r.status === "pending" && <TakeButton requestId={r.id} />}
                    <RegisterValuationButton
                      properties={propertyOptions}
                      preset={{
                        propertyId: r.property.id,
                        propertyName: r.property.name,
                        requestId: r.id,
                      }}
                      label="Registrar"
                      variant="primary"
                      size="sm"
                    />
                    <CompleteButton requestId={r.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Valuaciones recientes */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--fg)]">
          Valuaciones recientes
        </h2>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center text-sm text-[var(--fg-muted)]">
            Aún no se han registrado valuaciones.
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {recent.map((v) => (
              <li
                key={v.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[13px] font-medium text-[var(--fg)]">
                    {v.property.name}
                  </span>
                  <span className="ml-2 font-mono text-[11px] text-[var(--fg-muted)]">
                    {VALUATION_TYPE_LABEL[v.type] ?? v.type} ·{" "}
                    {dateFmt.format(v.valuationDate)}
                  </span>
                </div>
                {v.isOfficial && <Badge tone="violet">Oficial</Badge>}
                <span className="num text-sm font-semibold text-[var(--fg)]">
                  {fmtMxn(v.valueCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
