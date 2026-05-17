"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  addPropertyPhoto,
  deletePropertyPhoto,
  setPropertyCoverFromPhoto,
  type AddPhotoState,
} from "@/server/properties/photos";
import { Button, Card, CardHeader, CardBody, EmptyState } from "@/components/ui";
import { IcPhoto } from "@/components/icons";

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
    <Card>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            Fotos{" "}
            <span className="mono text-sm text-ink-500">({photos.length})</span>
            <span className="mono text-[10px] text-ink-500">
              optimizadas a WebP · resize 2000px máx
            </span>
          </div>
        }
        action={
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
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={pending}
            >
              {pending ? "Subiendo…" : "+ Agregar fotos"}
            </Button>
          </form>
        }
      />
      <CardBody>
        {state.error ? (
          <p className="text-bad text-sm font-medium mb-3">{state.error}</p>
        ) : null}
        {feedback ? (
          <p className="text-ok text-sm font-medium mb-3">{feedback}</p>
        ) : null}

        {photos.length === 0 ? (
          <EmptyState
            icon={IcPhoto}
            title="Sin fotos"
            description="Sube imágenes para documentar visualmente la propiedad (fachada, interior, vista, plano)."
          />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((p) => (
              <li
                key={p.id}
                className="relative aspect-square bg-ink-50 rounded-md overflow-hidden group border border-ink-100"
              >
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.url}
                    alt={p.caption ?? "Foto"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-500 text-xs">
                    Sin preview
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onSetCover(p.id)}
                    className="bg-white text-ink-900 text-[10px] font-semibold px-2 py-1 rounded hover:bg-info-soft transition-colors"
                    title="Usar como portada"
                  >
                    Portada
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="bg-bad text-white text-[10px] font-semibold px-2 py-1 rounded hover:bg-bad/80 transition-colors"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
