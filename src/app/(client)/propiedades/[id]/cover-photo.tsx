"use client";

import { useActionState, useRef } from "react";

import {
  setPropertyCoverPhoto,
  type SetCoverPhotoState,
} from "@/server/properties/cover-photo";
import { Button } from "@/components/ui";

const initial: SetCoverPhotoState = {};

export function CoverPhoto({
  propertyId,
  coverUrl,
  propertyName,
}: {
  propertyId: string;
  coverUrl: string | null;
  propertyName: string;
}) {
  const [state, action, pending] = useActionState(setPropertyCoverPhoto, initial);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative rounded-xl overflow-hidden bg-ink-50 border border-ink-100 h-[280px] group">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={`Foto de ${propertyName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-ink-500 gap-2">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm">Sin foto de portada</p>
        </div>
      )}

      {/* Overlay con botón al hover */}
      <form
        action={action}
        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <input type="hidden" name="propertyId" value={propertyId} />
        <input
          ref={fileInputRef}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              e.target.form?.requestSubmit();
            }
          }}
        />
        <Button
          variant="secondary"
          size="md"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
        >
          {pending ? "Subiendo…" : coverUrl ? "Cambiar foto" : "Subir foto"}
        </Button>
      </form>

      {state.error ? (
        <div className="absolute bottom-3 left-3 right-3 bg-bad text-white px-3 py-2 rounded-md text-sm font-medium">
          {state.error}
        </div>
      ) : null}
    </div>
  );
}
