"use client";

/**
 * Mapa base reutilizable (CORE) — Google Maps con marcadores simples.
 *
 * Distinto del visor de catastro (`components/cartografia/MapClient.tsx`):
 * aquí no hay capas `google.maps.Data` ni geometría de PostGIS, sólo pines.
 *
 * Reusa el patrón de carga de `@googlemaps/js-api-loader` (setOptions una sola
 * vez, importLibrary). La key viene de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
 *
 * Dos modos:
 *  - `markers` + `onMarkerClick`: render de varias propiedades (mapa base).
 *  - `picker` + `onPick`: un solo pin arrastrable para fijar lat/lng (form).
 */
import { useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const LEON_CENTER = { lat: 21.122, lng: -101.685 };

// setOptions debe llamarse una sola vez en el ciclo de vida de la app.
let optionsSet = false;
function ensureOptions() {
  if (optionsSet) return;
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    v: "weekly",
  });
  optionsSet = true;
}

export type BaseMapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
};

type Props = {
  /** Marcadores a pintar (modo lectura). */
  markers?: BaseMapMarker[];
  /** Click en un marcador. */
  onMarkerClick?: (id: string) => void;

  /** Modo picker: un pin arrastrable. */
  picker?: boolean;
  /** Posición inicial del pin en modo picker. */
  pickerValue?: { lat: number; lng: number } | null;
  /** El pin se movió (click o drag) — sólo en modo picker. */
  onPick?: (lat: number, lng: number) => void;

  /** Centro inicial cuando no hay marcadores ni pin. */
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
};

export default function BaseMap({
  markers,
  onMarkerClick,
  picker = false,
  pickerValue,
  onPick,
  center = LEON_CENTER,
  zoom = 13,
  className,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerObjs = useRef<google.maps.Marker[]>([]);
  const pickerMarker = useRef<google.maps.Marker | null>(null);

  // Props "vivas" para listeners imperativos.
  const cbRef = useRef({ onMarkerClick, onPick });
  cbRef.current = { onMarkerClick, onPick };

  // ---------- Init mapa una sola vez ----------
  useEffect(() => {
    if (mapRef.current) return;
    let cancelled = false;
    ensureOptions();

    importLibrary("maps")
      .then(async ({ Map }) => {
        await importLibrary("marker");
        if (cancelled || !mapDivRef.current || mapRef.current) return;

        const map = new Map(mapDivRef.current, {
          center: pickerValue ?? center,
          zoom: pickerValue ? 16 : zoom,
          mapTypeId: "roadmap",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          tilt: 0,
          gestureHandling: "greedy",
          maxZoom: 20,
        });
        mapRef.current = map;

        if (picker) {
          // Click en el mapa coloca / mueve el pin.
          map.addListener("click", (ev: google.maps.MapMouseEvent) => {
            const ll = ev.latLng;
            if (ll) cbRef.current.onPick?.(ll.lat(), ll.lng());
          });
        }
      })
      .catch((e) => {
        console.error("[BaseMap] No se pudo cargar Google Maps:", e);
      });

    return () => {
      cancelled = true;
      const map = mapRef.current;
      for (const m of markerObjs.current) m.setMap(null);
      markerObjs.current = [];
      pickerMarker.current?.setMap(null);
      pickerMarker.current = null;
      if (map) google.maps.event.clearInstanceListeners(map);
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Sincronizar marcadores (modo lectura) ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || picker) return;

    // Reemplazo total: los marcadores son baratos y la lista es pequeña.
    for (const m of markerObjs.current) m.setMap(null);
    markerObjs.current = [];

    const list = markers ?? [];
    if (list.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    for (const mk of list) {
      const marker = new google.maps.Marker({
        map,
        position: { lat: mk.lat, lng: mk.lng },
        title: mk.subtitle ? `${mk.title} · ${mk.subtitle}` : mk.title,
      });
      marker.addListener("click", () => cbRef.current.onMarkerClick?.(mk.id));
      markerObjs.current.push(marker);
      bounds.extend({ lat: mk.lat, lng: mk.lng });
    }

    if (list.length === 1) {
      map.setCenter({ lat: list[0].lat, lng: list[0].lng });
      map.setZoom(16);
    } else {
      map.fitBounds(bounds, 64);
      google.maps.event.addListenerOnce(map, "idle", () => {
        if ((map.getZoom() ?? 0) > 17) map.setZoom(17);
      });
    }
  }, [markers, picker]);

  // ---------- Sincronizar pin (modo picker) ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !picker) return;

    if (!pickerValue) {
      pickerMarker.current?.setMap(null);
      pickerMarker.current = null;
      return;
    }

    if (!pickerMarker.current) {
      const marker = new google.maps.Marker({
        map,
        position: pickerValue,
        draggable: true,
      });
      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        if (pos) cbRef.current.onPick?.(pos.lat(), pos.lng());
      });
      pickerMarker.current = marker;
    } else {
      pickerMarker.current.setPosition(pickerValue);
    }
    map.panTo(pickerValue);
  }, [pickerValue, picker]);

  return (
    <div
      ref={mapDivRef}
      className={className}
      style={{ width: "100%", height: "100%", background: "var(--bg-subtle)" }}
    />
  );
}
