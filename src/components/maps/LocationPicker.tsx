"use client";

/**
 * Pin picker para el formulario de propiedad — fija `latitude`/`longitude`.
 *
 * Click en el mapa coloca el pin; el pin se puede arrastrar. Los valores
 * alimentan dos `<input type="hidden">` que el form envía. Opcionalmente
 * geocodifica la dirección escrita para sugerir un punto inicial.
 *
 * Tanto el cliente como el staff GF usan este picker (alta/edición).
 */
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const BaseMap = dynamic(() => import("@/components/maps/BaseMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "var(--bg-subtle)" }} />
  ),
});

// Mismo patrón de carga que BaseMap: setOptions una sola vez.
let optionsSet = false;
function ensureOptions() {
  if (optionsSet) return;
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    v: "weekly",
  });
  optionsSet = true;
}

function clampLat(v: number): number {
  return Math.min(90, Math.max(-90, v));
}
function clampLng(v: number): number {
  return Math.min(180, Math.max(-180, v));
}

/** Redondea a 7 decimales: precisión ~1cm, suficiente para una propiedad. */
function round7(v: number): number {
  return Math.round(v * 1e7) / 1e7;
}

export function LocationPicker({
  initialLat,
  initialLng,
  /** Dirección actual del form, para el botón "Buscar dirección". */
  addressFieldId = "property-address",
}: {
  initialLat: string;
  initialLng: string;
  addressFieldId?: string;
}) {
  const parsedLat = initialLat ? Number(initialLat) : NaN;
  const parsedLng = initialLng ? Number(initialLng) : NaN;
  const hasInitial = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(
    hasInitial ? { lat: parsedLat, lng: parsedLng } : null,
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const onPick = useCallback((lat: number, lng: number) => {
    setPoint({ lat: round7(clampLat(lat)), lng: round7(clampLng(lng)) });
    setGeoError(null);
  }, []);

  const geocodeAddress = useCallback(async () => {
    const input = document.getElementById(
      addressFieldId,
    ) as HTMLInputElement | null;
    const address = input?.value.trim();
    if (!address) {
      setGeoError("Escribe una dirección primero.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    try {
      ensureOptions();
      const { Geocoder } = await importLibrary("geocoding");
      const geocoder = new Geocoder();
      const { results } = await geocoder.geocode({
        address,
        region: "mx",
      });
      const loc = results[0]?.geometry.location;
      if (loc) {
        onPick(loc.lat(), loc.lng());
      } else {
        setGeoError("No se encontró esa dirección.");
      }
    } catch {
      setGeoError("No se pudo geocodificar la dirección.");
    } finally {
      setGeoLoading(false);
    }
  }, [addressFieldId, onPick]);

  return (
    <div className="flex flex-col gap-2">
      {/* Valores que viajan en el form. */}
      <input
        type="hidden"
        name="latitude"
        value={point ? String(point.lat) : ""}
      />
      <input
        type="hidden"
        name="longitude"
        value={point ? String(point.lng) : ""}
      />

      <div
        className="overflow-hidden rounded-md border"
        style={{ borderColor: "rgba(7,11,31,0.2)", height: 260 }}
      >
        <BaseMap
          picker
          pickerValue={point}
          onPick={onPick}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={geocodeAddress}
          disabled={geoLoading}
          className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          style={{
            borderColor: "var(--color-pp-300)",
            color: "var(--color-pp-700)",
            background: "var(--color-pp-50)",
          }}
        >
          {geoLoading ? "Buscando…" : "Buscar dirección en el mapa"}
        </button>
        {point ? (
          <button
            type="button"
            onClick={() => setPoint(null)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium text-slate transition-colors"
            style={{ borderColor: "rgba(7,11,31,0.2)" }}
          >
            Quitar ubicación
          </button>
        ) : null}
        <span className="font-mono text-[11px] text-slate">
          {point
            ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`
            : "Haz clic en el mapa para fijar la ubicación"}
        </span>
      </div>

      {geoError ? (
        <span className="text-magenta text-xs">{geoError}</span>
      ) : null}
    </div>
  );
}
