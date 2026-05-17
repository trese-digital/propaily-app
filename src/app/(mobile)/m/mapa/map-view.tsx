"use client";

/**
 * Vista cliente del mapa base móvil — pines de las propiedades del tenant.
 * Click en un pin → detalle móvil de la propiedad.
 */
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { BaseMapMarker } from "@/components/maps/BaseMap";
import type { MapProperty } from "@/server/properties/map-data";

const BaseMap = dynamic(() => import("@/components/maps/BaseMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "var(--ink-100)" }} />
  ),
});

export function MobileMapView({ located }: { located: MapProperty[] }) {
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
      router.push(`/m/propiedad/${id}` as never);
    },
    [router],
  );

  return <BaseMap markers={markers} onMarkerClick={onMarkerClick} />;
}
