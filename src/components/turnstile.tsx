"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Cloudflare Turnstile — captcha para los formularios de autenticación.
 *
 * El widget inyecta automáticamente un input `cf-turnstile-response` dentro
 * del `<form>` que lo contiene. Ese token viaja en el FormData y la Server
 * Action lo pasa a Supabase como `captchaToken`; Supabase lo verifica contra
 * la *secret key* configurada en su dashboard — la verificación NO ocurre aquí.
 *
 * Si `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no está configurada, el widget no se
 * renderiza y el formulario funciona sin captcha (p. ej. desarrollo local).
 *
 * Integración nativa: Supabase Auth soporta Turnstile directamente, así que
 * basta con pasar el token — no hay endpoint de verificación propio.
 */
declare global {
  interface Window {
    turnstile?: { reset: (widgetId?: string) => void };
  }
}

export function TurnstileWidget({ pending }: { pending?: boolean }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // El token de Turnstile es de un solo uso: tras cada intento de envío se
  // renueva para que un reintento (p. ej. contraseña equivocada) tenga uno
  // válido.
  useEffect(() => {
    if (pending === false) window.turnstile?.reset();
  }, [pending]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="light"
        data-language="es"
        style={{ minHeight: 65 }}
      />
    </>
  );
}
