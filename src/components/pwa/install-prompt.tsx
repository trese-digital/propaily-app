"use client";

import { useEffect, useState } from "react";

/**
 * Hint de instalación de la PWA de escritorio (pantalla 04 del spec).
 *
 * Captura el evento `beforeinstallprompt` de Chromium y, a partir de la 2ª
 * visita, ofrece una tarjeta discreta abajo a la derecha. El prompt nativo
 * solo se dispara cuando el usuario hace click en "Instalar". Si la app ya
 * corre instalada, o el usuario ya descartó el hint, no se muestra nada.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pp-install-dismissed";
const VISIT_KEY = "pp-visit-count";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ya instalada (standalone o WCO) → no ofrecer instalar.
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches;
    if (installed || localStorage.getItem(DISMISS_KEY) === "1") return;

    const visits = Number(localStorage.getItem(VISIT_KEY) ?? "0") + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      // Gate del spec: recién a partir de la 2ª visita.
      if (visits >= 2) setVisible(true);
    }
    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar Propaily"
      className="fixed z-[55] flex flex-col gap-3"
      style={{
        right: 20,
        bottom: 20,
        width: 320,
        padding: 16,
        borderRadius: 12,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex shrink-0 items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "var(--color-pp-500)",
            color: "#fff",
            font: "600 17px var(--font-sans)",
          }}
        >
          P
        </span>
        <div className="min-w-0">
          <div
            style={{
              font: "600 14px var(--font-sans)",
              color: "var(--fg)",
            }}
          >
            Instala Propaily
          </div>
          <p
            style={{
              margin: "2px 0 0",
              font: "400 12px var(--font-sans)",
              color: "var(--fg-muted)",
              lineHeight: 1.45,
            }}
          >
            Tenla como app de escritorio: ventana propia, atajos de teclado y
            acceso más rápido.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="transition-colors hover:bg-(--bg-muted)"
          style={{
            height: 32,
            padding: "0 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--fg-muted)",
            font: "500 12px var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Ahora no
        </button>
        <button
          type="button"
          onClick={install}
          className="transition-opacity hover:opacity-90"
          style={{
            height: 32,
            padding: "0 14px",
            borderRadius: 8,
            border: 0,
            background: "var(--color-pp-500)",
            color: "#fff",
            font: "600 12px var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
