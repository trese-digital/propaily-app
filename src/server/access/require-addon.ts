/**
 * Helper combinado para route handlers: valida sesión + membership + addon habilitado.
 *
 * Uso:
 *   const gate = await requireAddon("cartografia");
 *   if (!gate.ok) return gate.response;
 *   const { user, managementCompanyId, clientId } = gate;
 *
 * Falla cerrado: sin sesión, sin membership o sin addon → 401/403 con JSON.
 */
import { NextResponse } from "next/server";

import { dbBypass } from "@/server/db/scoped";
import { createClient } from "@/lib/supabase/server";
import { hasAddon, type Addon } from "@/server/access/has-addon";

type Ok = {
  ok: true;
  user: { id: string; email: string | null };
  managementCompanyId: string;
  /** Client al que está acotado el usuario (family office), o null si es operador. */
  clientId: string | null;
};
type Err = { ok: false; response: NextResponse };

export async function requireAddon(addon: Addon): Promise<Ok | Err> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sesión requerida" } },
        { status: 401 },
      ),
    };
  }

  const membership = await dbBypass.membership.findFirst({
    where: { userId: user.id, status: "active" },
    select: { managementCompanyId: true, clientId: true },
  });
  if (!membership) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { code: "NO_MEMBERSHIP", message: "Usuario sin acceso a ninguna empresa" } },
        { status: 403 },
      ),
    };
  }

  const allowed = await hasAddon(membership.managementCompanyId, addon);
  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { code: "ADDON_DISABLED", message: `${addon} no está habilitado para esta cuenta` } },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? null },
    managementCompanyId: membership.managementCompanyId,
    clientId: membership.clientId,
  };
}
