import Link from "next/link";

/**
 * Barra de título propia para la PWA de escritorio (Window Controls Overlay).
 *
 * Solo es visible cuando la app corre instalada con `display-mode:
 * window-controls-overlay` — la clase `.pp-titlebar` la muestra/oculta y define
 * la zona de arrastre (`-webkit-app-region`) en `globals.css`. Fuera de ese
 * modo no ocupa espacio.
 *
 * El alto y el ancho usan `env(titlebar-area-*)` para no solapar los controles
 * del sistema operativo (cerrar/minimizar/maximizar).
 */
export function DesktopTitlebar() {
  return (
    <div
      className="pp-titlebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "env(titlebar-area-width, 100%)",
        height: "env(titlebar-area-height, 33px)",
        zIndex: 50,
        background: "var(--color-ink-900)",
        alignItems: "center",
        paddingLeft: "calc(env(titlebar-area-x, 0px) + 12px)",
        gap: 8,
      }}
    >
      <Link
        href="/"
        aria-label="Propaily — inicio"
        className="flex items-center gap-2"
      >
        <span
          className="flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            background: "var(--color-pp-500)",
            color: "#fff",
            font: "600 11px var(--font-sans)",
          }}
        >
          P
        </span>
        <span
          style={{
            font: "600 12px var(--font-sans)",
            color: "#fff",
            letterSpacing: "-0.01em",
          }}
        >
          propaily
        </span>
      </Link>
    </div>
  );
}
