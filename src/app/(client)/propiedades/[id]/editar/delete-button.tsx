"use client";

import { useTransition } from "react";

import { eliminarPropiedad } from "@/server/properties/actions";

export function DeletePropertyButton({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const [pending, startTransition] = useTransition();

  function onDelete() {
    const confirmed = confirm(
      `¿Eliminar "${propertyName}"?\n\nLa propiedad queda marcada como eliminada y deja de aparecer en el listado. Documentos y fotos se conservan en historial.`,
    );
    if (!confirmed) return;
    startTransition(async () => {
      const r = await eliminarPropiedad(propertyId);
      if (r?.error) alert(r.error);
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="bg-transparent text-magenta border border-magenta px-4 py-2 rounded-md text-sm font-semibold hover:bg-magenta hover:text-white transition-colors disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar propiedad"}
    </button>
  );
}
