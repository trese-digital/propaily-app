import Link from "next/link";

import { IcArrowUR, IcUsers } from "@/components/icons";
import { Avatar, Badge, type BadgeTone, Card, EmptyState, initialsFrom } from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { NewClientModal } from "./new-client-modal";

const numFmt = new Intl.NumberFormat("es-MX");

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

export default async function ClientesPage() {
  const ctx = await requireContext();

  const clients = await withAppScope(appScope(ctx), (tx) =>
    tx.client.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      include: {
        portfolios: {
          where: { deletedAt: null },
          select: {
            id: true,
            _count: { select: { properties: { where: { deletedAt: null } } } },
          },
        },
      },
    }),
  );

  const rows = clients.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    primaryEmail: c.primaryEmail,
    portfolioCount: c.portfolios.length,
    propertyCount: c.portfolios.reduce((s, p) => s + p._count.properties, 0),
  }));

  const isOperator = ctx.accessScope === "gf";

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">
            {ctx.membership.managementCompanyName}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">
            Clientes
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {rows.length === 0
              ? "Aún no hay clientes."
              : `${rows.length} cliente${rows.length === 1 ? "" : "s"} · ${numFmt.format(
                  rows.reduce((s, r) => s + r.propertyCount, 0),
                )} propiedades en total`}
          </p>
        </div>
        {isOperator && <NewClientModal />}
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={IcUsers}
          title="Aún no hay clientes"
          description={
            isOperator
              ? "Da de alta el primer family office, empresa o persona que GF administra."
              : "Pide a tu operador GF que registre tu cuenta."
          }
          accent
        />
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <Link key={c.id} href={`/clientes/${c.id}` as never}>
              <Card className="flex h-full flex-col gap-3 p-4 transition-all hover:border-pp-300 hover:shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3">
                  <Avatar initials={initialsFrom(c.name)} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold text-ink-900">
                      {c.name}
                    </div>
                    {c.primaryEmail && (
                      <div className="mono truncate text-[11px] text-ink-500">
                        {c.primaryEmail}
                      </div>
                    )}
                  </div>
                  <IcArrowUR size={14} style={{ color: "var(--color-ink-400)" }} />
                </div>
                <div className="flex items-center justify-between">
                  <Badge tone={TYPE_TONE[c.type] ?? "neutral"}>
                    {TYPE_LABEL[c.type] ?? c.type}
                  </Badge>
                  <span className="mono num text-[11px] text-ink-500">
                    {c.portfolioCount} portafolio{c.portfolioCount === 1 ? "" : "s"} ·{" "}
                    {c.propertyCount} propiedad{c.propertyCount === 1 ? "" : "es"}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
