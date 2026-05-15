import Link from "next/link";
import { notFound } from "next/navigation";

import { requireContext } from "@/server/auth/context";
import { withAppScope } from "@/server/db/scoped";
import { listPortfolioOptions } from "@/server/portfolios/list";
import { PropertyForm } from "@/components/property-form";
import { DeletePropertyButton } from "./delete-button";

function bigintToMxn(c: bigint | null) {
  return c == null ? "" : String(Number(c) / 100);
}

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireContext();
  const { id } = await params;

  const scope = {
    managementCompanyId: ctx.membership.managementCompanyId,
    clientId: ctx.client?.id ?? null,
  };
  const p = await withAppScope(scope, (tx) =>
    tx.property.findFirst({ where: { id, deletedAt: null } }),
  );
  if (!p) notFound();

  const portfolios = await listPortfolioOptions(ctx);

  return (
    <section className="max-w-3xl mx-auto px-7 py-12">
        <p className="font-mono text-[11px] tracking-widest text-slate uppercase mb-2">
          <Link href={`/propiedades/${p.id}` as never} className="hover:text-navy">
            ← {p.name}
          </Link>
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight m-0 mb-2">
          Editar propiedad
        </h1>
        <p className="text-slate mb-10">Cambios guardan al instante.</p>

        <PropertyForm
          mode="edit"
          propertyId={p.id}
          portfolios={portfolios}
          defaults={{
            name: p.name,
            portfolioId: p.portfolioId,
            type: p.type,
            operationalStatus: p.operationalStatus,
            address: p.address ?? "",
            latitude: p.latitude?.toString() ?? "",
            longitude: p.longitude?.toString() ?? "",
            landAreaSqm: p.landAreaSqm?.toString() ?? "",
            builtAreaSqm: p.builtAreaSqm?.toString() ?? "",
            fiscalValueMxn: bigintToMxn(p.fiscalValueCents),
            commercialValueMxn: bigintToMxn(p.commercialValueCents),
            insuranceValueMxn: bigintToMxn(p.insuranceValueCents),
            expectedRentMxn: bigintToMxn(p.expectedRentCents),
            internalNotes: p.internalNotes ?? "",
            cartoPredioId: p.cartoPredioId ?? "",
            cartoColoniaId: p.cartoColoniaId ?? "",
          }}
        />

        <div className="mt-10 border-t border-black/8 pt-6">
          <p className="font-mono text-[11px] text-slate tracking-wider uppercase mb-3">
            Zona de peligro
          </p>
          <DeletePropertyButton propertyId={p.id} propertyName={p.name} />
        </div>
    </section>
  );
}
