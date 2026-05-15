import Link from "next/link";

import { requireContext } from "@/server/auth/context";
import { listRentableOptions } from "@/server/leases/rentable-options";
import { ContractForm } from "./contract-form";

export default async function NuevoContratoPage() {
  const ctx = await requireContext();
  const { properties, units } = await listRentableOptions(ctx);

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-2 px-8 py-10">
      <p className="mono-label">
        <Link href="/rentas" className="hover:text-pp-700">
          ← Rentas
        </Link>
      </p>
      <h1 className="text-3xl font-semibold tracking-[-0.025em]">
        Nuevo contrato
      </h1>
      <p className="mb-4 text-sm text-[var(--fg-muted)]">
        El calendario de pagos mensuales se genera automáticamente entre las
        fechas de inicio y fin.
      </p>
      <ContractForm properties={properties} units={units} />
    </section>
  );
}
