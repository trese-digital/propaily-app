import Link from "next/link";

import { IcChart } from "@/components/icons";
import {
  Badge,
  type BadgeTone,
  Card,
  CardHeader,
  EmptyState,
  Kpi,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function fmtMxn(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  return `$${numFmt.format(Math.round(Number(cents) / 100))}`;
}

const VALUATION_TYPE_LABEL: Record<string, string> = {
  professional: "Profesional GF",
  commercial: "Comercial",
  fiscal: "Fiscal",
  insurance: "Seguro",
  manual: "Manual",
};

const REQUEST_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: "Solicitud pendiente", tone: "warn" },
  in_progress: { label: "En progreso", tone: "info" },
};

export default async function ValuacionesPage() {
  const ctx = await requireContext();

  const properties = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        portfolio: { select: { name: true, client: { select: { name: true } } } },
        valuations: {
          where: { deletedAt: null },
          orderBy: { valuationDate: "desc" },
          take: 1,
        },
        valuationRequests: {
          where: { status: { in: ["pending", "in_progress"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  );

  const rows = properties.map((p) => {
    const last = p.valuations[0] ?? null;
    const req = p.valuationRequests[0] ?? null;
    return {
      id: p.id,
      name: p.name,
      clientName: p.portfolio.client.name,
      portfolioName: p.portfolio.name,
      currentValueCents: p.currentValueCents,
      lastType: last ? VALUATION_TYPE_LABEL[last.type] ?? last.type : null,
      lastDate: last ? dateFmt.format(last.valuationDate) : null,
      requestStatus: req?.status ?? null,
    };
  });

  const valuadas = rows.filter((r) => r.lastDate != null).length;
  const abiertas = rows.filter((r) => r.requestStatus != null).length;
  const totalValor = rows.reduce(
    (s, r) => s + (r.currentValueCents != null ? Number(r.currentValueCents) : 0),
    0,
  );

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header>
        <p className="mono-label">Servicio profesional GF</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.015em]">Valuaciones</h1>
        <p className="mt-1 text-sm text-ink-500">
          Valor de cada propiedad según el último avalúo de GF. Solicita una
          actualización desde el detalle de la propiedad.
        </p>
      </header>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi label="Propiedades" value={numFmt.format(rows.length)} note="en el portafolio" />
        </Card>
        <Card className="p-4">
          <Kpi label="Con valuación" value={numFmt.format(valuadas)} note="avalúo registrado" />
        </Card>
        <Card className="p-4">
          <Kpi label="Solicitudes abiertas" value={numFmt.format(abiertas)} note="en cola de GF" />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Valor de portafolio"
            value={`$${numFmt.format(Math.round(totalValor / 100))}`}
            note="suma de valores actuales"
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Propiedades"
          action={<span className="text-xs text-ink-500">{rows.length} en total</span>}
        />
        {rows.length === 0 ? (
          <EmptyState
            icon={IcChart}
            title="Sin propiedades"
            description="Cuando registres propiedades aparecerán aquí con su valuación."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Propiedad</TH>
                <TH>Cliente</TH>
                <TH>Valor actual</TH>
                <TH>Última valuación</TH>
                <TH>Estado</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => {
                const reqSt = r.requestStatus
                  ? REQUEST_STATUS[r.requestStatus]
                  : null;
                return (
                  <TR key={r.id}>
                    <TD>
                      <Link
                        href={`/propiedades/${r.id}` as never}
                        className="font-medium text-ink-900 hover:text-pp-700"
                      >
                        {r.name}
                      </Link>
                      <div className="mono text-[11px] text-ink-500">
                        {r.portfolioName}
                      </div>
                    </TD>
                    <TD>{r.clientName}</TD>
                    <TD>
                      <span className="num font-medium">{fmtMxn(r.currentValueCents)}</span>
                    </TD>
                    <TD>
                      {r.lastDate ? (
                        <span className="text-[13px]">
                          {r.lastType}
                          <span className="mono ml-1.5 text-[11px] text-ink-500">
                            {r.lastDate}
                          </span>
                        </span>
                      ) : (
                        <span className="text-ink-400">Sin valuación</span>
                      )}
                    </TD>
                    <TD>
                      {reqSt ? (
                        <Badge tone={reqSt.tone}>{reqSt.label}</Badge>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </section>
  );
}
