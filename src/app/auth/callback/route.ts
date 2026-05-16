/**
 * Callback de autenticación de Supabase.
 *
 * Destino de los enlaces de invitación, magic link y recuperación de contraseña
 * (`redirectTo`). Intercambia el `code` (flujo PKCE de `@supabase/ssr`) por una
 * sesión y manda al usuario a la app. Antes no existía esta ruta → los enlaces
 * caían en la raíz con el error en el hash (bug del correo de invitación).
 *
 * IMPORTANTE: en Supabase, agregar `https://app.propaily.com/auth/callback` a la
 * allowlist de Redirect URLs y dejar la Site URL en `https://app.propaily.com`.
 */
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorCode = url.searchParams.get("error_code");
  const errorDescription = url.searchParams.get("error_description");
  const next = url.searchParams.get("next") || "/";

  const loginUrl = new URL("/login", url.origin);

  // El enlace caducó o es inválido (Supabase devuelve el error en el query).
  if (errorCode || errorDescription) {
    loginUrl.searchParams.set(
      "error",
      errorCode === "otp_expired"
        ? "El enlace expiró. Pide que te envíen una invitación nueva."
        : "El enlace no es válido. Solicita uno nuevo.",
    );
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // `next` solo puede ser una ruta interna — nunca un origen externo.
      const dest = next.startsWith("/") ? next : "/";
      return NextResponse.redirect(new URL(dest, url.origin));
    }
    loginUrl.searchParams.set(
      "error",
      "No se pudo iniciar sesión con ese enlace. Intenta de nuevo.",
    );
    return NextResponse.redirect(loginUrl);
  }

  loginUrl.searchParams.set("error", "Enlace de acceso inválido.");
  return NextResponse.redirect(loginUrl);
}
