import type { ReactNode } from "react";

import { requireContext } from "@/server/auth/context";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();
  return (
    <AppShell user={ctx.user} org={ctx.membership.managementCompanyName}>
      {children}
    </AppShell>
  );
}
