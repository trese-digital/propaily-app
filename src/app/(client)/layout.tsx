import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { appScope, requireContext } from "@/server/auth/context";
import { getEnabledAddons, isCatastroPlan } from "@/server/access/has-addon";
import { getUnreadCount } from "@/server/notifications/data";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();

  // Plan standalone "Visor Catastral": no tiene módulos de gestión. Cualquier
  // ruta del portal cliente lo manda al visor — su "home" es /cartografia.
  // El gate vive en server (regla AGENTS.md §17), nunca solo en el rail/UI.
  if (await isCatastroPlan(ctx.membership.managementCompanyId)) {
    redirect("/cartografia");
  }

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
