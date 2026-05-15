"use client";

import { useEffect } from "react";

/**
 * Registra el Service Worker de la PWA (`/sw.js`). Sin estado ni UI.
 * El SW solo cachea assets estáticos — ver `public/sw.js`.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registro best-effort: si falla, la app funciona igual sin PWA.
    });
  }, []);

  return null;
}
