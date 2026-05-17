import Link from "next/link";

import { IcPin } from "@/components/icons";
import { Badge, Card, EmptyState } from "@/components/ui";
import { requireContext } from "@/server/auth/context";
import { getMapProperties } from "@/server/properties/map-data";

import { MapView } from "./map-view";

export const metadata = { title: "Mapa · Propaily" };

export default async function MapaPage() {
  const ctx = await requireContext();
  const { located, unlocated } = await getMapProperties(ctx);

  const total = located.length + unlocated.length;

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mono-label">{ctx.membership.managementCompanyName}</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em]">Mapa</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {located.length} de {total} propiedades ubicadas
          </p>
        </div>
      </header>

      {total === 0 ? (
        <EmptyState
          icon={IcPin}
          title="Aún no hay propiedades"
          description="Registra propiedades y fija su ubicación para verlas en el mapa."
          accent
        />
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="h-[560px] w-full">
              {located.length > 0 ? (
                <MapView located={located} />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center">
                  <p className="text-sm text-[var(--fg-muted)]">
                    Ninguna propiedad tiene ubicación todavía. Edita una
                    propiedad y fija su pin en el mapa.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {unlocated.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-ink-900">
                Sin ubicar · {unlocated.length}
              </h2>
              <p className="text-xs text-[var(--fg-muted)]">
                Estas propiedades no tienen coordenadas. Edítalas para fijar su
                ubicación en el mapa.
              </p>
              <Card className="overflow-hidden">
                {unlocated.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/propiedades/${p.id}/editar` as never}
                    className={`flex items-center gap-4 px-4 py-3 text-ink-900 transition-colors hover:bg-[var(--bg-muted)] ${
                      i === 0 ? "" : "border-t border-ink-100"
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--fg-subtle)]"
                      style={{ background: "var(--bg-subtle)" }}
                    >
                      <IcPin size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{p.name}</p>
                      {p.address && (
                        <p className="mt-0.5 truncate text-[11px] text-[var(--fg-muted)]">
                          {p.address}
                        </p>
                      )}
                    </div>
                    <span className="num text-[13px] font-medium">{p.value}</span>
                    <Badge tone="neutral">{p.status}</Badge>
                  </Link>
                ))}
              </Card>
            </div>
          )}
        </>
      )}
    </section>
  );
}
