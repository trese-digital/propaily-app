"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  addPropertyPhoto,
  deletePropertyPhoto,
  setPropertyCoverFromPhoto,
  type AddPhotoState,
} from "@/server/properties/photos";

export type PhotoRow = {
  id: string;
  url: string | null;
  caption: string | null;
};

const initial: AddPhotoState = {};

export function PhotoGallery({
  propertyId,
  photos,
}: {
  propertyId: string;
  photos: PhotoRow[];
}) {
  const [state, action, pending] = useActionState(addPropertyPhoto, initial);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Feedback temporal después de cada subida
  useEffect(() => {
    if (state.ok && state.ts) {
      const txt =
        state.uploaded != null
          ? `✓ ${state.uploaded} foto${state.uploaded === 1 ? "" : "s"} subida${state.uploaded === 1 ? "" : "s"}` +
            (state.failed ? ` · ${state.failed} no procesada${state.failed === 1 ? "" : "s"}` : "")
          : "✓ Subido";
      setFeedback(txt);
      const t = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [state.ts, state.ok, state.uploaded, state.failed]);

  function onDelete(id: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    startTransition(async () => {
      const r = await deletePropertyPhoto(id);
      if (r.error) alert(r.error);
    });
  }

  function onSetCover(id: string) {
    startTransition(async () => {
      const r = await setPropertyCoverFromPhoto(id);
      if (r.error) alert(r.error);
    });
  }

  return (
    <div className="bg-white border border-black/8 rounded-xl p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium m-0">
          Fotos <span className="text-slate font-mono text-sm">({photos.length})</span>
          <span className="font-mono text-[10px] text-slate ml-2">
            optimizadas a WebP · resize 2000px máx
          </span>
        </h2>

        <form action={action} className="flex items-center gap-2">
          <input type="hidden" name="propertyId" value={propertyId} />
          <input
            ref={fileInputRef}
            name="file"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) e.target.form?.requestSubmit();
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={pending}
            className="bg-teal text-navy px-4 py-2 rounded-md text-sm font-semibold border border-teal hover:bg-teal-bright transition-colors disabled:opacity-60"
          >
            {pending ? "Subiendo…" : "+ Agregar fotos"}
          </button>
        </form>
      </div>

      {state.error ? (
        <p className="text-magenta text-sm font-medium mb-3">{state.error}</p>
      ) : null}
      {feedback ? (
        <p className="text-teal-deep text-sm font-medium mb-3">{feedback}</p>
      ) : null}

      {photos.length === 0 ? (
        <p className="text-slate text-sm text-center py-6">
          Sin fotos. Sube imágenes para documentar visualmente la propiedad (fachada, interior, vista, plano).
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((p) => (
            <li
              key={p.id}
              className="relative aspect-square bg-paper-2 rounded-md overflow-hidden group border border-black/8"
            >
              {p.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url}
                  alt={p.caption ?? "Foto"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate text-xs">
                  Sin preview
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onSetCover(p.id)}
                  className="bg-white text-navy text-[10px] font-semibold px-2 py-1 rounded hover:bg-teal-bright transition-colors"
                  title="Usar como portada"
                >
                  Portada
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="bg-magenta text-white text-[10px] font-semibold px-2 py-1 rounded hover:bg-magenta/80 transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
