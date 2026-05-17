"use client";

/**
 * Vista cliente del mapa base (CORE) — pines de las propiedades del tenant.
 * Click en un pin → detalle de la propiedad. El componente de mapa se carga
 * sólo en cliente (Google Maps necesita el DOM).
 */
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { BaseMapMarker } from "@/components/maps/BaseMap";
import type { MapProperty } from "@/server/properties/map-data";

const BaseMap = dynamic(() => import("@/components/maps/BaseMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full" style={{ background: "var(--bg-subtle)" }} />
  ),
});

export function MapView({ located }: { located: MapProperty[] }) {
  const router = useRouter();

  const markers = useMemo<BaseMapMarker[]>(
    () =>
      located.map((p) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        title: p.name,
        subtitle: p.value,
      })),
    [located],
  );

  const onMarkerClick = useCallback(
    (id: string) => {
      router.push(`/propiedades/${id}` as never);
    },
    [router],
  );

  return <BaseMap markers={markers} onMarkerClick={onMarkerClick} />;
}
