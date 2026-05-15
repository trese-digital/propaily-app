"use client";

import { useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

import { colorByValue } from "@/lib/geometry";
import type { ColoniaFeature, LoteFeature, TramoFeature, Selection } from "./types";

type Props = {
  // datos
  colonias: GeoJSON.FeatureCollection | null;
  tramos: GeoJSON.FeatureCollection | null;
  lotes: GeoJSON.FeatureCollection | null;

  selection: Selection;
  watermark: string;
  flyTo: { bounds?: [number, number, number, number]; center?: [number, number]; maxZoom?: number } | null;

  // callbacks
  onViewportChange: (zoom: number, bbox: [number, number, number, number]) => void;
  onSelectColonia: (f: ColoniaFeature) => void;
  onSelectTramo: (f: TramoFeature) => void;
  onSelectLote: (f: LoteFeature) => void;
  onMapClick: () => void;
};

const LEON_CENTER = { lat: 21.122, lng: -101.685 };
const ZOOM_INICIAL = 13;

// setOptions debe llamarse una sola vez, antes de cargar cualquier librería.
let optionsSet = false;

function loteLabel(a: number): string {
  return a >= 10000
    ? `Lote · ${(a / 10000).toFixed(2)} ha`
    : a >= 1000
      ? `Lote · ${(a / 1000).toFixed(2)} mil m²`
      : `Lote · ${Math.round(a).toLocaleString("es-MX")} m²`;
}

export default function MapClient(props: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const coloniasData = useRef<google.maps.Data | null>(null);
  const tramosData = useRef<google.maps.Data | null>(null);
  const lotesData = useRef<google.maps.Data | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Props "vivas" para los listeners imperativos del mapa.
  const selectionRef = useRef<Selection>(null);
  selectionRef.current = props.selection;
  const callbacksRef = useRef(props);
  callbacksRef.current = props;

  // ---------- Estilos por capa (leen la selección desde el ref) ----------
  function styleColonia(feat: google.maps.Data.Feature): google.maps.Data.StyleOptions {
    const sel = selectionRef.current;
    const id = String(feat.getId() ?? "");
    const isSelected = sel?.kind === "colonia" && String(sel.feature.id) === id;
    const v = feat.getProperty("valor_fiscal") as number | undefined;
    return {
      strokeColor: isSelected ? "#070B1F" : "#FFFFFF",
      strokeWeight: isSelected ? 2.5 : 0.6,
      fillColor: colorByValue(v ?? null),
      fillOpacity: isSelected ? 0.85 : 0.55,
      zIndex: 1,
    };
  }
  function styleTramo(feat: google.maps.Data.Feature): google.maps.Data.StyleOptions {
    const sel = selectionRef.current;
    const id = String(feat.getId() ?? "");
    const isSelected = sel?.kind === "tramo" && String(sel.feature.id) === id;
    const v = feat.getProperty("valor_fiscal") as number | undefined;
    return {
      strokeColor: isSelected ? "#E0157A" : v != null ? "#5B30E0" : "#9097A8",
      strokeWeight: isSelected ? 5 : 2.5,
      strokeOpacity: isSelected ? 1 : 0.85,
      zIndex: 2,
    };
  }
  function styleLote(feat: google.maps.Data.Feature): google.maps.Data.StyleOptions {
    const sel = selectionRef.current;
    const id = String(feat.getId() ?? "");
    const isSelected = sel?.kind === "lote" && String(sel.feature.id) === id;
    return isSelected
      ? { strokeColor: "#070B1F", strokeWeight: 2.5, fillColor: "#C8FF3A", fillOpacity: 0.55, zIndex: 3 }
      : { strokeColor: "#E0157A", strokeWeight: 0.5, fillColor: "#C8FF3A", fillOpacity: 0.18, zIndex: 3 };
  }

  // ---------- Tooltip flotante ----------
  function moveTooltip(html: string, domEvent: Event) {
    const tip = tooltipRef.current;
    const cont = containerRef.current;
    if (!tip || !cont || !(domEvent instanceof MouseEvent)) return;
    const rect = cont.getBoundingClientRect();
    tip.innerHTML = html;
    tip.style.display = "block";
    tip.style.left = `${domEvent.clientX - rect.left + 14}px`;
    tip.style.top = `${domEvent.clientY - rect.top + 14}px`;
  }
  function hideTooltip() {
    if (tooltipRef.current) tooltipRef.current.style.display = "none";
  }

  // ---------- Reemplazar features de una capa ----------
  function applyData(layer: google.maps.Data | null, fc: GeoJSON.FeatureCollection | null) {
    if (!layer) return;
    layer.forEach((f) => layer.remove(f));
    if (fc) layer.addGeoJson(fc);
  }

  // ---------- Init mapa una sola vez ----------
  useEffect(() => {
    if (mapRef.current) return;
    let cancelled = false;

    if (!optionsSet) {
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        v: "weekly",
      });
      optionsSet = true;
    }

    importLibrary("maps")
      .then(({ Map }) => {
        if (cancelled || !mapDivRef.current || mapRef.current) return;

        const map = new Map(mapDivRef.current, {
          center: LEON_CENTER,
          zoom: ZOOM_INICIAL,
          mapTypeId: "hybrid",
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          tilt: 0,
          gestureHandling: "greedy",
          maxZoom: 21,
        });
        mapRef.current = map;

        // Tres capas Data independientes. El orden de creación define el
        // z-order de hit-testing: lotes encima → reciben el click antes
        // que el polígono grande de la colonia que está debajo.
        const mkLayer = (style: (f: google.maps.Data.Feature) => google.maps.Data.StyleOptions) => {
          const d = new google.maps.Data();
          d.setStyle(style);
          d.setMap(map);
          return d;
        };
        const cD = mkLayer(styleColonia);
        const tD = mkLayer(styleTramo);
        const lD = mkLayer(styleLote);
        coloniasData.current = cD;
        tramosData.current = tD;
        lotesData.current = lD;

        // ----- Clicks de selección -----
        cD.addListener("click", (ev: google.maps.Data.MouseEvent) => {
          const id = String(ev.feature.getId() ?? "");
          const f = callbacksRef.current.colonias?.features.find((x) => String(x.id) === id);
          if (f) callbacksRef.current.onSelectColonia(f as ColoniaFeature);
        });
        tD.addListener("click", (ev: google.maps.Data.MouseEvent) => {
          const id = String(ev.feature.getId() ?? "");
          const f = callbacksRef.current.tramos?.features.find((x) => String(x.id) === id);
          if (f) callbacksRef.current.onSelectTramo(f as TramoFeature);
        });
        lD.addListener("click", (ev: google.maps.Data.MouseEvent) => {
          const id = String(ev.feature.getId() ?? "");
          const f = callbacksRef.current.lotes?.features.find((x) => String(x.id) === id);
          if (f) callbacksRef.current.onSelectLote(f as LoteFeature);
        });
        map.addListener("click", () => callbacksRef.current.onMapClick());

        // ----- Tooltips por capa -----
        cD.addListener("mousemove", (ev: google.maps.Data.MouseEvent) => {
          const colonia = ev.feature.getProperty("colonia") ?? "—";
          const sector = ev.feature.getProperty("sector") ?? "—";
          const zona = ev.feature.getProperty("tipo_zona_norm") ?? "";
          moveTooltip(`${colonia} · sec ${sector} · ${zona}`, ev.domEvent);
        });
        tD.addListener("mousemove", (ev: google.maps.Data.MouseEvent) => {
          const vialidad = ev.feature.getProperty("vialidad") ?? "—";
          const desc = ev.feature.getProperty("tramo_desc") ?? "";
          const valor = (ev.feature.getProperty("valor_fiscal") as number | undefined) ?? 0;
          moveTooltip(
            `<b>${vialidad}</b><br>${desc}<br>Fiscal: $${valor.toLocaleString("es-MX")}/m²`,
            ev.domEvent,
          );
        });
        lD.addListener("mousemove", (ev: google.maps.Data.MouseEvent) => {
          const a = (ev.feature.getProperty("area_m2") as number | undefined) ?? 0;
          moveTooltip(loteLabel(a), ev.domEvent);
        });
        for (const layer of [cD, tD, lD]) {
          layer.addListener("mouseout", hideTooltip);
        }

        // ----- Viewport: el evento "idle" ya espera a que el mapa se asiente -----
        const emit = () => {
          const b = map.getBounds();
          const z = map.getZoom();
          if (!b || z == null) return;
          const sw = b.getSouthWest();
          const ne = b.getNorthEast();
          callbacksRef.current.onViewportChange(z, [sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
        };
        map.addListener("idle", emit);

        // Pintar los datos que ya hubiera en props al momento de cargar.
        applyData(cD, callbacksRef.current.colonias);
        applyData(tD, callbacksRef.current.tramos);
        applyData(lD, callbacksRef.current.lotes);
      })
      .catch((e) => {
        console.error("[MapClient] No se pudo cargar Google Maps:", e);
      });

    return () => {
      cancelled = true;
      const map = mapRef.current;
      coloniasData.current?.setMap(null);
      tramosData.current?.setMap(null);
      lotesData.current?.setMap(null);
      if (map) google.maps.event.clearInstanceListeners(map);
      mapRef.current = null;
      coloniasData.current = null;
      tramosData.current = null;
      lotesData.current = null;
    };
  }, []);

  // ---------- Sincronizar datos ----------
  useEffect(() => {
    applyData(coloniasData.current, props.colonias);
  }, [props.colonias]);
  useEffect(() => {
    applyData(tramosData.current, props.tramos);
  }, [props.tramos]);
  useEffect(() => {
    applyData(lotesData.current, props.lotes);
  }, [props.lotes]);

  // ---------- Re-estilar al cambiar selección ----------
  useEffect(() => {
    coloniasData.current?.setStyle(styleColonia);
    tramosData.current?.setStyle(styleTramo);
    lotesData.current?.setStyle(styleLote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selection]);

  // ---------- FlyTo ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !props.flyTo) return;
    const ft = props.flyTo;
    if (ft.bounds) {
      const [w, s, e, n] = ft.bounds;
      map.fitBounds(
        new google.maps.LatLngBounds({ lat: s, lng: w }, { lat: n, lng: e }),
        60,
      );
      // fitBounds no admite maxZoom: clampeamos tras el primer "idle".
      const maxZ = ft.maxZoom ?? 17;
      google.maps.event.addListenerOnce(map, "idle", () => {
        if ((map.getZoom() ?? 0) > maxZ) map.setZoom(maxZ);
      });
    } else if (ft.center) {
      map.setCenter({ lat: ft.center[1], lng: ft.center[0] });
      map.setZoom(ft.maxZoom ?? 16);
    }
  }, [props.flyTo]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div ref={mapDivRef} className="absolute inset-0 bg-paper" />
      <div ref={tooltipRef} className="gmap-tt" />
      <div
        className="absolute bottom-1.5 right-2 z-[400] font-mono text-[10px] tracking-wider text-navy/30 pointer-events-none select-none"
        style={{ textShadow: "0 0 2px rgba(244,241,234,0.7)" }}
      >
        {props.watermark}
      </div>
    </div>
  );
}
