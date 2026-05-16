"use client";

import { useEffect, useState } from "react";

/**
 * Tira de estado offline (pantalla 18 del spec).
 *
 * Aparece como una franja oscura en la parte superior cuando el navegador
 * pierde conexión. Las páginas del portal se sirven desde el servidor (RLS),
 * así que offline solo permite consultar lo ya cargado; el CTA recarga al
 * volver la conexión.
 */
export function ConnectionStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed left-0 right-0 z-[58] flex items-center justify-center gap-3 px-4"
      style={{
        top: "env(titlebar-area-height, 0px)",
        height: 34,
        background: "var(--color-ink-900)",
        color: "#fff",
        font: "500 12px var(--font-sans)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: "#f5a524",
        }}
      />
      Sin conexión a internet — algunos datos pueden estar desactualizados.
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="transition-opacity hover:opacity-80"
        style={{
          height: 22,
          padding: "0 10px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "transparent",
          color: "#fff",
          font: "600 11px var(--font-sans)",
          cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
