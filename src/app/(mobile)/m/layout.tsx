/**
 * Layout de la PWA mobile (`app.propaily.com` · `/m/*`).
 *
 * Las 21 pantallas del handoff `design_handoff_mobile_pwa` viven aquí, en su
 * propio route group `(mobile)`, separadas del portal de escritorio `(client)`.
 * El contenedor `.m-viewport` limita el ancho en pantallas grandes para
 * previsualizar la app tal como se ve en un teléfono.
 */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Propaily — Móvil",
  description: "Tu portafolio inmobiliario en el bolsillo — by GF Consultoría.",
};

export const viewport: Viewport = {
  themeColor: "#6E3AFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="m-viewport" data-mobile-pwa>
      {children}
    </div>
  );
}
