"use client";

import { useEffect, useState } from "react";

/**
 * Registra el Service Worker (`/sw.js`) y, cuando detecta una versión nueva
 * en espera, muestra un banner de actualización (pantalla 17 del spec desktop).
 *
 * Flujo de actualización:
 *  1. El navegador descarga el `sw.js` nuevo → queda en estado "waiting".
 *  2. Este componente lo detecta y muestra el banner.
 *  3. El usuario hace click en "Actualizar" → `postMessage(SKIP_WAITING)`.
 *  4. El SW nuevo toma control → evento `controllerchange` → recarga.
 */
export function ServiceWorkerRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // El SW nuevo tomó control: recargamos una sola vez para servir la
      // versión nueva. El guard evita un bucle de recargas.
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Ya había una versión en espera al cargar la página.
        if (reg.waiting && navigator.serviceWorker.controller) {
          setWaiting(reg.waiting);
        }
        // Una versión nueva empieza a instalarse mientras navegamos.
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (
              next.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaiting(next);
            }
          });
        });
      })
      .catch(() => {
        // Registro best-effort: si falla, la app funciona igual sin PWA.
      });
  }, []);

  if (!waiting) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 px-4"
      style={{
        top: "calc(env(titlebar-area-height, 0px) + 12px)",
        height: 44,
        borderRadius: 999,
        background: "var(--color-ink-900)",
        color: "#fff",
        font: "500 13px var(--font-sans)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: "var(--color-pp-400)",
        }}
      />
      Hay una versión nueva de Propaily.
      <button
        type="button"
        onClick={() => waiting.postMessage({ type: "SKIP_WAITING" })}
        className="transition-opacity hover:opacity-90"
        style={{
          height: 28,
          padding: "0 12px",
          borderRadius: 999,
          border: 0,
          background: "var(--color-pp-500)",
          color: "#fff",
          font: "600 12px var(--font-sans)",
          cursor: "pointer",
        }}
      >
        Actualizar
      </button>
    </div>
  );
}
