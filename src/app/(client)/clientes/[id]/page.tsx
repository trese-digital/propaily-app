import Link from "next/link";
import { notFound } from "next/navigation";

import { IcArrowUR, IcLayers } from "@/components/icons";
import {
  Avatar,
  Badge,
  type BadgeTone,
  Card,
  CardHeader,
  Kpi,
  initialsFrom,
} from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { NewPortfolioModal } from "../new-portfolio-modal";
import { getPropertyTitleValue } from "@/lib/property-value";

const numFmt = new Intl.NumberFormat("es-MX");
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  month: "short",
  year: "numeric",
});

function formatMxn(cents: bigint | null | undefined): string {
  if (cents == null) return "—";
  const pesos = Number(cents) / 100;
  if (pesos === 0) return "$0";
  const abs = Math.abs(pesos);
  if (abs >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(pesos / 1_000).toFixed(0)}K`;
  return `$${numFmt.format(Math.round(pesos))}`;
}

const TYPE_LABEL: Record<string, string> = {
  individual: "Individual",
  company: "Empresa",
  trust: "Fideicomiso",
  family: "Familia",
  other: "Otro",
};
const TYPE_TONE: Record<string, BadgeTone> = {
  individual: "ok",
  company: "info",
  trust: "warn",
  family: "violet",
  other: "neutral",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  available: "Disponible",
  rented: "Rentada",
  for_sale: "En venta",
  under_construction: "En construcción",
  maintenance: "Mantenimiento",
  reserved: "Reservada",
  inactive: "Inactiva",
};
function statusTone(s: string): BadgeTone {
  if (s === "active" || s === "rented") return "ok";
  if (s === "available") return "info";
  if (s === "reserved") return "violet";
  if (s === "inactive") return "neutral";
  return "warn";
}

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireContext();
  const { id } = await params;

  const result = await withAppScope(appScope(ctx), async (tx) => {
    const client = await tx.client.findFirst({
      where: { id, deletedAt: null },
      include: {
        portfolios: {
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          include: {
            properties: {
              where: { deletedAt: null },
              orderBy: { updatedAt: "desc" },
              select: {
                id: true,
                name: true,
                city: true,
                operationalStatus: true,
                commercialValueCents: true,
                purchasePriceCents: true,
                fiscalValueCents: true,
              },
            },
          },
        },
      },
    });
    if (!client) return null;
    const documentCount = await tx.document.count({
      where: {
        deletedAt: null,
        OR: [
          { clientId: client.id },
          { portfolio: { clientId: client.id } },
          { property: { portfolio: { clientId: client.id } } },
        ],
      },
    });
    return { client, documentCount };
  });

  if (!result) notFound();
  const { client, documentCount } = result;

  const allProps = client.portfolios.flatMap((p) => p.properties);
  const totalValue = allProps.reduce((s, p) => {
    const { valueCents } = getPropertyTitleValue(p);
    return s + Number(valueCents ?? 0n);
  }, 0);

  const fiscalRows: Array<[string, string | null]> = [
    ["RFC", client.taxId],
    ["Tipo", TYPE_LABEL[client.type] ?? client.type],
    ["Email", client.primaryEmail],
    ["Teléfono", client.phone],
    ["Domicilio fiscal", client.fiscalAddress],
    ["Contacto administrativo", client.administrativeContact],
    ["Contacto legal", client.legalContact],
  ];

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-5 px-8 py-7">
      <p className="mono-label">
        <Link href="/clientes" className="hover:text-pp-700">
          ← Clientes
        </Link>
      </p>

      {/* Header */}
      <header className="flex flex-wrap items-center gap-4">
        <Avatar initials={initialsFrom(client.name)} size={56} />
        <div className="min-w-0 flex-1">
          <span className="mono-label">
            Cliente · {TYPE_LABEL[client.type] ?? client.type}
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.015em]">
            {client.name}
          </h1>
          <p className="mono mt-1 text-xs text-ink-500">
            Activo desde {dateFmt.format(client.createdAt)}
          </p>
        </div>
        <Badge tone={TYPE_TONE[client.type] ?? "neutral"}>
          {TYPE_LABEL[client.type] ?? client.type}
        </Badge>
        {ctx.accessScope === "gf" && <NewPortfolioModal clientId={client.id} />}
      </header>

      {/* KPI strip */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Kpi
            label="Propiedades"
            value={numFmt.format(allProps.length)}
            note={`en ${client.portfolios.length} portafolio${client.portfolios.length === 1 ? "" : "s"}`}
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Valor total"
            value={formatMxn(BigInt(Math.round(totalValue)))}
            note="MXN · estimado"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Portafolios"
            value={numFmt.format(client.portfolios.length)}
            note="agrupaciones"
          />
        </Card>
        <Card className="p-4">
          <Kpi
            label="Documentos"
            value={numFmt.format(documentCount)}
            note="en biblioteca"
          />
        </Card>
      </div>

      {/* 2-col content */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Portfolios */}
          <Card>
            <CardHeader
              title="Portafolios"
              action={
                <span className="text-xs text-ink-500">
                  {client.portfolios.length} · {allProps.length} propiedades
                </span>
              }
            />
            {client.portfolios.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-500">
                Sin portafolios. Crea el primero para agrupar propiedades.
              </p>
            ) : (
              <ul>
                {client.portfolios.map((pf) => {
                  const pfValue = pf.properties.reduce((s, p) => {
                    const { valueCents } = getPropertyTitleValue(p);
                    return s + Number(valueCents ?? 0n);
                  }, 0);
                  return (
                    <li
                      key={pf.id}
                      className="flex items-center gap-3.5 border-t border-ink-100 px-4 py-3.5 first:border-t-0"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pp-50 text-pp-600">
                        <IcLayers size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-ink-900">
                          {pf.name}
                        </div>
                        <p className="truncate text-xs text-ink-500">
                          {pf.description ?? "Sin descripción"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="mono num text-sm font-semibold text-ink-900">
                          {formatMxn(BigInt(Math.round(pfValue)))}
                        </div>
                        <div className="mono text-[11px] text-ink-500">
                          {pf.properties.length} prop
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Properties */}
          <Card>
            <CardHeader
              title="Propiedades"
              action={
                <Link
                  href="/propiedades"
                  className="inline-flex items-center gap-1 text-xs font-medium text-pp-700 hover:text-pp-600"
                >
                  Ver todas <IcArrowUR size={11} />
                </Link>
              }
            />
            {allProps.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-500">
                Este cliente aún no tiene propiedades.
              </p>
            ) : (
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {allProps.slice(0, 8).map((p) => (
                  <Link
                    key={p.id}
                    href={`/propiedades/${p.id}` as never}
                    className="flex flex-col gap-2 rounded-lg border border-ink-100 p-3 transition-colors hover:border-pp-300"
                  >
                    <span className="truncate text-[13px] font-medium text-ink-900">
                      {p.name}
                    </span>
                    <span className="mono text-[11px] text-ink-500">
                      {p.city ?? "—"}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="mono num text-xs font-semibold text-ink-900">
                        {formatMxn(getPropertyTitleValue(p).valueCents)}
                      </span>
                      <Badge tone={statusTone(p.operationalStatus)}>
                        {STATUS_LABEL[p.operationalStatus] ?? p.operationalStatus}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Datos fiscales y legales" />
            <dl className="flex flex-col">
              {fiscalRows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-t border-ink-100 px-4 py-2.5 text-[13px] first:border-t-0"
                >
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="text-right font-medium text-ink-900">
                    {v ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Notas internas" />
            <p className="px-4 py-3.5 text-[13px] leading-relaxed text-ink-700">
              {client.internalNotes ?? "Sin notas."}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
