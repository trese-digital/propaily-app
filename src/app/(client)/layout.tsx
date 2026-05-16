import type { ReactNode } from "react";

import { appScope, requireContext } from "@/server/auth/context";
import { getEnabledAddons } from "@/server/access/has-addon";
import { getUnreadCount } from "@/server/notifications/data";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();
  const [addons, unreadCount] = await Promise.all([
    getEnabledAddons(ctx.membership.managementCompanyId),
    getUnreadCount(appScope(ctx), ctx.user.id),
  ]);
  return (
    <AppShell
      user={ctx.user}
      org={ctx.membership.managementCompanyName}
      addons={addons}
      unreadCount={unreadCount}
    >
      {children}
    </AppShell>
  );
}
