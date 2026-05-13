import { redirect } from "next/navigation";

import { requireContext } from "@/server/auth/context";
import { getEnabledAddons } from "@/server/access/has-addon";
import Visor from "@/components/cartografia/Visor";

export default async function CartografiaPage({
  searchParams,
}: {
  searchParams: Promise<{ linkProperty?: string }>;
}) {
  const ctx = await requireContext();
  const addons = await getEnabledAddons(ctx.membership.managementCompanyId);

  // Gating del addon (regla AGENTS.md §17). Sin addon → fuera del visor.
  if (!addons.cartografia) redirect("/");

  const sp = await searchParams;

  return (
    <Visor
      user={{
        email: ctx.user.email,
        name: ctx.user.name ?? ctx.user.email,
      }}
      addons={addons}
      linkPropertyId={sp.linkProperty ?? null}
    />
  );
}
