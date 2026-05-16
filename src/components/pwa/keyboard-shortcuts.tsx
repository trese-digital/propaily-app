"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Atajos de teclado globales para la PWA de escritorio (spec §2.2).
 *
 * `⌘1/⌘2/⌘3` saltan a las secciones principales, `⌘K` abre la búsqueda de
 * propiedades y `⌘,` lleva a Suscripción (ajustes de la cuenta). Solo se
 * disparan cuando el foco NO está en un campo de texto, para no pisar el
 * comportamiento normal de escritura del navegador.
 */
const SHORTCUTS: Record<string, string> = {
  "1": "/",
  "2": "/propiedades",
  "3": "/rentas",
  k: "/propiedades",
  ",": "/suscripcion",
};

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Solo combinaciones con ⌘ (mac) o Ctrl (Win/Linux), sin Alt/Shift.
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }
      const destination = SHORTCUTS[event.key.toLowerCase()];
      if (!destination) return;
      event.preventDefault();
      router.push(destination as never);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
