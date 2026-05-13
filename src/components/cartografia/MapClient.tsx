"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

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

const LEON_CENTER: [number, number] = [21.122, -101.685];
const ZOOM_INICIAL = 13;

export default function MapClient(props: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const coloniasLayerRef = useRef<L.GeoJSON | null>(null);
  const tramosLayerRef = useRef<L.GeoJSON | null>(null);
  const lotesLayerRef = useRef<L.GeoJSON | null>(null);
  const selectionRef = useRef<Selection>(null);
  selectionRef.current = props.selection;
  const callbacksRef = useRef(props);
  callbacksRef.current = props;

  // ---------- Init mapa una sola vez ----------
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map("gfc-map", {
      center: LEON_CENTER,
      zoom: ZOOM_INICIAL,
      preferCanvas: false,
      renderer: L.svg({ padding: 0.5 }),
      zoomSnap: 0.5,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: "© OSM · GFC",
      subdomains: "abc",
      // En displays @2x (retina/HiDPI) sirve tiles de doble resolución.
      detectRetina: true,
    }).addTo(map);

    // Panes con z-index controlado para que los lotes siempre queden
    // por encima de las colonias (clicks llegan al lote, no al polígono
    // grande de la colonia que está abajo).
    map.createPane("colonias-pane").style.zIndex = "410";
    map.createPane("tramos-pane").style.zIndex = "450";
    map.createPane("lotes-pane").style.zIndex = "470";

    let timer: ReturnType<typeof setTimeout> | null = null;
    const emit = () => {
      const z = map.getZoom();
      const b = map.getBounds();
      callbacksRef.current.onViewportChange(z, [
        b.getWest(),
        b.getSouth(),
        b.getEast(),
        b.getNorth(),
      ]);
    };
    map.on("moveend zoomend", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(emit, 200);
    });
    map.on("click", () => callbacksRef.current.onMapClick());

    mapRef.current = map;
    // Emit inicial
    queueMicrotask(emit);

    // ResizeObserver: cuando el contenedor cambia de tamaño (p.ej. al
    // colapsar el sidebar) hay que avisarle a Leaflet con invalidateSize().
    const el = map.getContainer();
    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---------- Estilos por capa ----------
  function styleColonia(feat: GeoJSON.Feature | undefined): L.PathOptions {
    const sel = selectionRef.current;
    const isSelected =
      sel?.kind === "colonia" && sel.feature.id === feat?.id;
    const v = (feat?.properties as { valor_fiscal?: number } | undefined)?.valor_fiscal;
    return {
      color: isSelected ? "#070B1F" : "#FFFFFF",
      weight: isSelected ? 2.5 : 0.6,
      fillColor: colorByValue(v ?? null),
      fillOpacity: isSelected ? 0.85 : 0.55,
    };
  }
  function styleTramo(feat: GeoJSON.Feature | undefined): L.PathOptions {
    const sel = selectionRef.current;
    const isSelected = sel?.kind === "tramo" && sel.feature.id === feat?.id;
    const v = (feat?.properties as { valor_fiscal?: number } | undefined)?.valor_fiscal;
    return {
      color: isSelected ? "#E0157A" : v != null ? "#5B30E0" : "#9097A8",
      weight: isSelected ? 5 : 2.5,
      opacity: isSelected ? 1 : 0.85,
      lineCap: "round",
    };
  }
  function styleLote(feat: GeoJSON.Feature | undefined): L.PathOptions {
    const sel = selectionRef.current;
    const isSelected = sel?.kind === "lote" && sel.feature.id === feat?.id;
    return isSelected
      ? { color: "#070B1F", weight: 2.5, fillColor: "#C8FF3A", fillOpacity: 0.55 }
      : { color: "#E0157A", weight: 0.5, fillColor: "#C8FF3A", fillOpacity: 0.18 };
  }

  // ---------- Layer: colonias ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (coloniasLayerRef.current) {
      map.removeLayer(coloniasLayerRef.current);
      coloniasLayerRef.current = null;
    }
    if (!props.colonias) return;
    const lyr = L.geoJSON(props.colonias as GeoJSON.GeoJsonObject, {
      pane: "colonias-pane",
      style: (f) => styleColonia(f),
      onEachFeature: (feat, layer) => {
        const p = feat.properties as Record<string, unknown>;
        const tt = `${p.colonia ?? "—"} · sec ${p.sector ?? "—"} · ${p.tipo_zona_norm ?? ""}`;
        (layer as L.Path).bindTooltip(tt, {
          sticky: true,
          className: "gfc-tt",
          direction: "top",
        });
        layer.on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          callbacksRef.current.onSelectColonia(feat as ColoniaFeature);
        });
      },
    }).addTo(map);
    coloniasLayerRef.current = lyr;
  }, [props.colonias]);

  // ---------- Layer: tramos ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tramosLayerRef.current) {
      map.removeLayer(tramosLayerRef.current);
      tramosLayerRef.current = null;
    }
    if (!props.tramos) return;
    const lyr = L.geoJSON(props.tramos as GeoJSON.GeoJsonObject, {
      pane: "tramos-pane",
      style: (f) => styleTramo(f),
      onEachFeature: (feat, layer) => {
        const p = feat.properties as Record<string, unknown>;
        const valor = (p.valor_fiscal as number | undefined) ?? 0;
        const tt = `<b>${p.vialidad ?? "—"}</b><br>${p.tramo_desc ?? ""}<br>Fiscal: $${valor.toLocaleString("es-MX")}/m²`;
        (layer as L.Path).bindTooltip(tt, { sticky: true, className: "gfc-tt" });
        layer.on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          callbacksRef.current.onSelectTramo(feat as TramoFeature);
        });
      },
    }).addTo(map);
    tramosLayerRef.current = lyr;
  }, [props.tramos]);

  // ---------- Layer: lotes ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (lotesLayerRef.current) {
      map.removeLayer(lotesLayerRef.current);
      lotesLayerRef.current = null;
    }
    if (!props.lotes) return;
    const lyr = L.geoJSON(props.lotes as GeoJSON.GeoJsonObject, {
      pane: "lotes-pane",
      style: (f) => styleLote(f),
      onEachFeature: (feat, layer) => {
        const p = feat.properties as { area_m2?: number };
        const a = p.area_m2 ?? 0;
        const txt =
          a >= 10000
            ? `Lote · ${(a / 10000).toFixed(2)} ha`
            : a >= 1000
              ? `Lote · ${(a / 1000).toFixed(2)} mil m²`
              : `Lote · ${Math.round(a).toLocaleString("es-MX")} m²`;
        (layer as L.Path).bindTooltip(txt, { sticky: true, className: "gfc-tt" });
        layer.on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          callbacksRef.current.onSelectLote(feat as LoteFeature);
        });
      },
    }).addTo(map);
    lotesLayerRef.current = lyr;
  }, [props.lotes]);

  // ---------- Re-estilar al cambiar selección ----------
  useEffect(() => {
    coloniasLayerRef.current?.setStyle((f) => styleColonia(f));
    tramosLayerRef.current?.setStyle((f) => styleTramo(f));
    lotesLayerRef.current?.setStyle((f) => styleLote(f));
  }, [props.selection]);

  // ---------- FlyTo ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !props.flyTo) return;
    const ft = props.flyTo;
    if (ft.bounds) {
      const [w, s, e, n] = ft.bounds;
      map.fitBounds(L.latLngBounds([s, w], [n, e]), {
        padding: [60, 60],
        maxZoom: ft.maxZoom ?? 17,
      });
    } else if (ft.center) {
      map.setView([ft.center[1], ft.center[0]], ft.maxZoom ?? 16);
    }
  }, [props.flyTo]);

  return (
    <div className="relative w-full h-full">
      <div id="gfc-map" className="absolute inset-0 bg-paper" />
      <div
        className="absolute bottom-1.5 right-2 z-[400] font-mono text-[10px] tracking-wider text-navy/30 pointer-events-none select-none"
        style={{ textShadow: "0 0 2px rgba(244,241,234,0.7)" }}
      >
        {props.watermark}
      </div>
    </div>
  );
}
