import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireContext } from "@/server/auth/context";
import { isGfStaff } from "@/server/auth/is-gf-staff";
import { AdminShell } from "@/components/admin-shell";

/**
 * Layout del backoffice GF.
 *
 * Gating: la sesión + scoping cross-tenant viven en `requireContext`.
 * Aquí adicionalmente exigimos rol staff GF; sin él → redirect a `/`
 * (portal cliente).
 *
 * Decisión Bloque 4: admin.propaily.com como subdominio en prod, /admin
 * como path en dev. El middleware host-aware encamina en prod.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ctx = await requireContext();
  const staff = await isGfStaff(ctx.user.id);
  if (!staff) redirect("/");

  return <AdminShell user={ctx.user}>{children}</AdminShell>;
}
