"use client";

import { useEffect } from "react";

import { IcAlert } from "@/components/icons";
import { Button } from "@/components/ui";

/**
 * Error boundary del portal. Next.js lo monta cuando un Server Component de
 * `(client)` lanza. Es Client Component obligatorio (recibe `reset`).
 */
export default function ClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En producción esto debería ir a un colector de errores.
    console.error("[portal] error de ruta:", error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-[560px] flex-col items-center gap-4 px-8 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warn-soft text-warn">
        <IcAlert size={26} />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-ink-900">
          Algo salió mal al cargar esta pantalla
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
          El error fue temporal o los datos no estaban disponibles. Puedes
          reintentar; si persiste, avísale al equipo de GF.
        </p>
        {error.digest && (
          <p className="mono mt-2 text-[11px] text-ink-400">
            ref: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Ir al inicio
        </Button>
      </div>
    </section>
  );
}
