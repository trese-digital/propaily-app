/**
 * Resuelve el contexto del usuario autenticado: su `User` en Prisma + el
 * `Membership` activo (que define la ManagementCompany dentro de la que opera).
 *
 * Por ahora un usuario sólo tiene UN membership; cuando se introduzcan
 * organizaciones múltiples por usuario, este helper pasará a recibir
 * el ID de la org actual desde la URL o una cookie.
 */
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { dbBypass } from "@/server/db/scoped";
import { ensureUserSynced } from "@/server/auth/sync-user";

export type AppContext = {
  user: { id: string; email: string; name: string | null };
  membership: {
    id: string;
    role: string;
    managementCompanyId: string;
    managementCompanyName: string;
  };
};

export async function requireContext(): Promise<AppContext> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const dbUser = await ensureUserSynced(
    authUser.id,
    authUser.email ?? "",
    (authUser.user_metadata?.name as string | undefined) ?? null,
  );

  // Membership es pre-tenant: necesitamos resolverla antes de saber qué MC
  // settear para RLS. Por eso usa `dbBypass`. El filtro por userId viene de
  // la sesión Supabase verificada.
  const m = await dbBypass.membership.findFirst({
    where: { userId: dbUser.id, status: "active" },
    include: { managementCompany: true },
  });
  if (!m) {
    // Sin membership: redirige a la home con un flag (más adelante: pantalla de
    // "Sin acceso a ninguna empresa"). Por ahora deja pasar a /.
    redirect("/");
  }

  return {
    user: { id: dbUser.id, email: dbUser.email, name: dbUser.name },
    membership: {
      id: m.id,
      role: m.role,
      managementCompanyId: m.managementCompanyId,
      managementCompanyName: m.managementCompany.name,
    },
  };
}
