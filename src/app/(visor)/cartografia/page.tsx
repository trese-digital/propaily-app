import { redirect } from "next/navigation";

import { requireContext } from "@/server/auth/context";
import {
  getEnabledAddons,
  hasCatastroAccess,
  isCatastroPlan,
} from "@/server/access/has-addon";
import Visor from "@/components/cartografia/Visor";

export default async function CartografiaPage({
  searchParams,
}: {
  searchParams: Promise<{ linkProperty?: string }>;
}) {
  const ctx = await requireContext();
  const [addons, catastroAccess, catastroOnly] = await Promise.all([
    getEnabledAddons(ctx.membership.managementCompanyId),
    hasCatastroAccess(ctx.membership.managementCompanyId),
    isCatastroPlan(ctx.membership.managementCompanyId),
  ]);

  // Gating del visor (regla AGENTS.md §17): addon `cartografia` encendido
  // O plan standalone `catastro`. Sin ninguno → fuera del visor.
  if (!catastroAccess) redirect("/");

  const sp = await searchParams;

  return (
    <Visor
      user={{
        email: ctx.user.email,
        name: ctx.user.name ?? ctx.user.email,
      }}
      addons={addons}
      catastroOnly={catastroOnly}
      linkPropertyId={sp.linkProperty ?? null}
    />
  );
}
