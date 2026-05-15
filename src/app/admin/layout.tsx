import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { AdminShell } from "@/components/admin-shell";
import { APP_ORIGIN, resolveHostArea } from "@/lib/domains";

/**
 * Layout del backoffice GF.
 *
 * Gating: la sesión + scoping cross-tenant viven en `requireContext`.
 * Aquí adicionalmente exigimos rol staff GF; sin él → al portal cliente.
 *
 * En admin.propaily.com NO se puede redirigir a `/` (el middleware lo
 * reescribiría de vuelta a /admin → loop): el no-staff se manda al host del
 * portal (`app.propaily.com`). En dev el host es único, así que basta `/`.
 *
 * Decisión Bloque 4: admin.propaily.com como subdominio en prod, /admin
 * como path en dev. El middleware host-aware encamina en prod.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();
  const staff = await isGfStaff(ctx.user.id);
  if (!staff) {
    const area = resolveHostArea((await headers()).get("host"));
    redirect(area === "admin" ? APP_ORIGIN : "/");
  }

  return <AdminShell user={ctx.user}>{children}</AdminShell>;
}
