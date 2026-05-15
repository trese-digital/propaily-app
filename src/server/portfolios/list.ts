/**
 * Lista los portafolios visibles para el contexto actual, formateados como
 * opciones para selectores (`Cliente · Portafolio`).
 *
 * Scopeado vía `withAppScope`: un operador GF ve todos los portafolios de su
 * MC; un usuario family office ve sólo los de su Client. La UI completa de
 * gestión de Clientes/Portafolios llega en S4.
 */
import type { AppContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

export type PortfolioOption = { id: string; label: string };

export async function listPortfolioOptions(
  ctx: AppContext,
): Promise<PortfolioOption[]> {
  const rows = await withAppScope(
    {
      managementCompanyId: ctx.membership.managementCompanyId,
      clientId: ctx.client?.id ?? null,
    },
    (tx) =>
      tx.portfolio.findMany({
        where: { status: "active", deletedAt: null },
        select: { id: true, name: true, client: { select: { name: true } } },
        orderBy: [{ client: { name: "asc" } }, { name: "asc" }],
      }),
  );
  return rows.map((p) => ({ id: p.id, label: `${p.client.name} · ${p.name}` }));
}
