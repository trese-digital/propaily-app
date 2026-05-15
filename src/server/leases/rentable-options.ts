/**
 * Lista las propiedades y unidades a las que se les puede colgar un contrato
 * (renta mixta — decisión S2). Scopeado por RLS vía `withAppScope`.
 */
import { appScope, type AppContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";

export type RentableOption = { value: string; label: string };

export async function listRentableOptions(ctx: AppContext): Promise<{
  properties: RentableOption[];
  units: RentableOption[];
}> {
  const props = await withAppScope(appScope(ctx), (tx) =>
    tx.property.findMany({
      where: { deletedAt: null, status: { not: "deleted" } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        units: {
          where: { deletedAt: null },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        },
      },
    }),
  );

  return {
    properties: props.map((p) => ({ value: `prop:${p.id}`, label: p.name })),
    units: props.flatMap((p) =>
      p.units.map((u) => ({
        value: `unit:${u.id}`,
        label: `${p.name} · ${u.name}`,
      })),
    ),
  };
}
