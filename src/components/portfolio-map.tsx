"use client";

/**
 * Mapa del portafolio para el dashboard — Google Maps JS API con un marcador
 * por propiedad geolocalizada. Reemplaza el `MapPreview` (SVG decorativo).
 *
 * Client-only (regla AGENTS.md: el mapa va en cliente). Reusa el patrón de
 * carga de `components/cartografia/MapClient`.
 */
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

export type MapPin = { id: string; name: string; lat: number; lng: number };

/** Centro de León, Gto — fallback cuando ninguna propiedad tiene coordenadas. */
const LEON_CENTER = { lat: 21.1219, lng: -101.6833 };

let optionsSet = false;

export function PortfolioMap({ pins }: { pins: MapPin[] }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;
    let cancelled = false;

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;
    if (!optionsSet) {
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        v: "weekly",
      });
      optionsSet = true;
    }

    Promise.all([importLibrary("maps"), importLibrary("marker")])
      .then(([{ Map }, { Marker }]) => {
        if (cancelled || !divRef.current || mapRef.current) return;

        const map = new Map(divRef.current, {
          center: pins[0]
            ? { lat: pins[0].lat, lng: pins[0].lng }
            : LEON_CENTER,
          zoom: pins.length ? 12 : 6,
          mapTypeId: "roadmap",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          gestureHandling: "cooperative",
        });
        mapRef.current = map;

        const bounds = new google.maps.LatLngBounds();
        for (const p of pins) {
          new Marker({ map, position: { lat: p.lat, lng: p.lng }, title: p.name });
          bounds.extend({ lat: p.lat, lng: p.lng });
        }
        if (pins.length > 1) map.fitBounds(bounds, 56);
      })
      .catch(() => {
        /* sin red / key inválida → queda el contenedor vacío */
      });

    return () => {
      cancelled = true;
    };
  }, [pins]);

  return (
    <div className="absolute inset-0">
      <div ref={divRef} className="h-full w-full" />
      {pins.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="mono rounded bg-white/80 px-2 py-1 text-[11px] text-ink-500">
            Sin propiedades geolocalizadas
          </span>
        </div>
      )}
    </div>
  );
}
