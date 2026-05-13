/**
 * Helper para API routes: extrae el usuario autenticado de Supabase y devuelve
 * un Response 401 si no hay sesión. Pensado para usarse al inicio de routes:
 *
 *   const auth = await requireUser();
 *   if (!auth.ok) return auth.response;
 *   const { user } = auth;
 */
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RequireUserOk = {
  ok: true;
  user: { id: string; email: string | null };
};
type RequireUserErr = { ok: false; response: NextResponse };

export async function requireUser(): Promise<RequireUserOk | RequireUserErr> {
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
  return { ok: true, user: { id: user.id, email: user.email ?? null } };
}
