import type { ReactNode } from "react";

import { requireContext } from "@/server/auth/context";
import { getEnabledAddons } from "@/server/access/has-addon";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();
  const addons = await getEnabledAddons(ctx.membership.managementCompanyId);
  return (
    <AppShell
      user={ctx.user}
      org={ctx.membership.managementCompanyName}
      addons={addons}
    >
      {children}
    </AppShell>
  );
}
