import type { MetadataRoute } from "next";

/**
 * Web App Manifest — hace a Propaily instalable como PWA (Nivel 1).
 * Next lo sirve en `/manifest.webmanifest` y enlaza el `<link rel="manifest">`
 * automáticamente.
 *
 * Se instala desde `app.propaily.com`; `start_url`/`scope` son del portal.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Propaily — Administración de portafolios",
    short_name: "Propaily",
    description:
      "Administración de portafolios inmobiliarios — by GF Consultoría.",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0E0A16",
    theme_color: "#6E3AFF",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
