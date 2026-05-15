"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { logout } from "@/app/(auth)/login/actions";
import { vincularPropiedadConLote } from "@/server/properties/actions";

import { AppRail } from "@/components/app-rail";
import { buildRailItems, APP_RAIL_WIDTH } from "@/components/app-rail-items";
import type { AddonState } from "@/server/access/has-addon";
import { Sidebar, type LayerCounts } from "./Sidebar";
import { SearchBox } from "./SearchBox";
import { Inspector } from "./Inspector";
import type {
  ColoniaFeature,
  LoteFeature,
  SearchResult,
  Selection,
  TramoFeature,
} from "./types";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-paper" />,
});

const MIN_ZOOM_DATA = 13;
const MAX_BBOX_DEG = 0.5;
const SIDEBAR_KEY = "gfc.v3.sidebar.collapsed";

export default function Visor({
  user,
  addons,
  linkPropertyId,
}: {
  user: { email: string | null; name: string | null };
  addons: AddonState;
  linkPropertyId?: string | null;
}) {
  const railItems = buildRailItems(addons);
  const router = useRouter();
  // ---------- Estado UI ----------
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTramos, setShowTramos] = useState(false);
  const [showLotes, setShowLotes] = useState(true);
  const [status, setStatus] = useState<{ text: string; loading?: boolean }>({ text: "Listo" });

  // ---------- Estado mapa ----------
  const [zoom, setZoom] = useState<number | null>(null);
  const [bbox, setBbox] = useState<[number, number, number, number] | null>(null);
  const bboxStr = bbox
    ? `${bbox[0].toFixed(4)},${bbox[1].toFixed(4)},${bbox[2].toFixed(4)},${bbox[3].toFixed(4)}`
    : null;
  const [tip, setTip] = useState<string | null>(null);

  // ---------- Datos ----------
  const [colonias, setColonias] = useState<GeoJSON.FeatureCollection | null>(null);
  const [tramos, setTramos] = useState<GeoJSON.FeatureCollection | null>(null);
  const [lotes, setLotes] = useState<GeoJSON.FeatureCollection | null>(null);
  const counts: LayerCounts = useMemo(
    () => ({
      colonias: colonias?.features.length ?? null,
      tramos: tramos?.features.length ?? null,
      lotes: lotes?.features.length ?? null,
    }),
    [colonias, tramos, lotes],
  );

  // ---------- Selección + flyTo ----------
  const [selection, setSelection] = useState<Selection>(null);
  const [flyTo, setFlyTo] = useState<{
    bounds?: [number, number, number, number];
    center?: [number, number];
    maxZoom?: number;
  } | null>(null);
  const pendingRef = useRef<{ type: "colonia" | "tramo"; id: string } | null>(null);

  // ---------- Carga inicial collapse ----------
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSidebarCollapsed(window.localStorage.getItem(SIDEBAR_KEY) === "1");
    }
  }, []);
  const collapseSidebar = useCallback(() => {
    setSidebarCollapsed(true);
    window.localStorage.setItem(SIDEBAR_KEY, "1");
  }, []);
  const expandSidebar = useCallback(() => {
    setSidebarCollapsed(false);
    window.localStorage.setItem(SIDEBAR_KEY, "0");
  }, []);

  // ---------- Watermark ----------
  const watermark = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    return `${user.email ?? ""} · ${stamp} · GFC`;
  }, [user.email]);

  // ---------- Fetch colonias por viewport ----------
  const fetchTokenRef = useRef(0);
  useEffect(() => {
    if (!bbox || zoom == null) return;
    if (zoom < MIN_ZOOM_DATA) {
      setTip(`🔍 Acércate a zoom ${MIN_ZOOM_DATA}+ para cargar colonias.`);
      setColonias(null);
      setStatus({ text: "Acércate al mapa" });
      return;
    }
    if (bbox[2] - bbox[0] > MAX_BBOX_DEG || bbox[3] - bbox[1] > MAX_BBOX_DEG) {
      setTip("El área es demasiado grande. Acércate más.");
      setStatus({ text: "Área muy grande" });
      return;
    }
    setTip(null);
    const my = ++fetchTokenRef.current;
    setStatus({ text: "Cargando colonias…", loading: true });
    (async () => {
      try {
        const r = await fetch(
          `/api/cartografia/colonias?bbox=${bboxStr}&ano=2026`,
          { credentials: "include" },
        );
        if (my !== fetchTokenRef.current) return;
        if (r.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as GeoJSON.FeatureCollection & { count: number };
        setColonias(data);
        setStatus({ text: `${data.count} colonias cargadas` });
      } catch (e) {
        setStatus({ text: `Error: ${e instanceof Error ? e.message : "?"}` });
      }
    })();
  }, [bboxStr, zoom, bbox]);

  // ---------- Fetch tramos por viewport ----------
  const tramosTokenRef = useRef(0);
  useEffect(() => {
    if (!showTramos) {
      setTramos(null);
      return;
    }
    if (!bbox || zoom == null) return;
    if (zoom < MIN_ZOOM_DATA) return;
    if (bbox[2] - bbox[0] > MAX_BBOX_DEG || bbox[3] - bbox[1] > MAX_BBOX_DEG) return;
    const my = ++tramosTokenRef.current;
    setStatus({ text: "Cargando tramos…", loading: true });
    (async () => {
      try {
        const r = await fetch(
          `/api/cartografia/tramos?bbox=${bboxStr}&ano=2026`,
          { credentials: "include" },
        );
        if (my !== tramosTokenRef.current) return;
        if (r.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as GeoJSON.FeatureCollection & { count: number };
        setTramos(data);
        setStatus({ text: `${data.count} tramos` });
      } catch (e) {
        setStatus({ text: `Error tramos: ${e instanceof Error ? e.message : "?"}` });
      }
    })();
  }, [showTramos, bboxStr, zoom, bbox]);

  // ---------- Fetch lotes filtrados a colonia seleccionada ----------
  // Persistimos el id de la última colonia que disparó la carga de lotes,
  // así al seleccionar un lote (o tramo) los lotes no se borran.
  const [loadedColoniaId, setLoadedColoniaId] = useState<string | null>(null);
  useEffect(() => {
    if (!selection) {
      setLoadedColoniaId(null);
      return;
    }
    if (selection.kind === "colonia") {
      setLoadedColoniaId(String(selection.feature.id ?? ""));
    } else if (selection.kind === "tramo") {
      // Si paso a un tramo, limpiamos los lotes (no aplica)
      setLoadedColoniaId(null);
    }
    // Si paso a un lote: mantengo loadedColoniaId actual (no toco).
  }, [selection]);

  useEffect(() => {
    if (!showLotes || !loadedColoniaId) {
      setLotes(null);
      return;
    }
    const ac = new AbortController();
    setStatus({ text: "Cargando lotes…", loading: true });
    (async () => {
      try {
        const r = await fetch(`/api/cartografia/predios?colonia_id=${loadedColoniaId}`, {
          credentials: "include",
          signal: ac.signal,
        });
        if (r.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as GeoJSON.FeatureCollection & { count: number };
        setLotes(data);
        setStatus({ text: `${data.count} lotes en la colonia` });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setStatus({ text: `Error lotes: ${e instanceof Error ? e.message : "?"}` });
      }
    })();
    return () => ac.abort();
  }, [showLotes, loadedColoniaId]);

  // ---------- Apply pending selection cuando llegan colonias/tramos del fetch ----------
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    if (pending.type === "colonia" && colonias) {
      const f = colonias.features.find((x) => String(x.id) === pending.id) as
        | ColoniaFeature
        | undefined;
      if (f) {
        setSelection({ kind: "colonia", feature: f });
        pendingRef.current = null;
      }
    }
  }, [colonias]);
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    if (pending.type === "tramo" && tramos) {
      const f = tramos.features.find((x) => String(x.id) === pending.id) as
        | TramoFeature
        | undefined;
      if (f) {
        setSelection({ kind: "tramo", feature: f });
        pendingRef.current = null;
      }
    }
  }, [tramos]);

  // ---------- Handlers ----------
  const onViewportChange = useCallback(
    (z: number, b: [number, number, number, number]) => {
      setZoom(z);
      setBbox(b);
    },
    [],
  );
  const onSelectColonia = useCallback((f: ColoniaFeature) => {
    setSelection({ kind: "colonia", feature: f });
  }, []);
  const onSelectTramo = useCallback((f: TramoFeature) => {
    setSelection({ kind: "tramo", feature: f });
  }, []);
  const onSelectLote = useCallback((f: LoteFeature) => {
    setSelection((prev) => ({
      kind: "lote",
      feature: f,
      coloniaCtx: prev?.kind === "colonia" ? prev.feature.properties : prev?.kind === "lote" ? prev.coloniaCtx : null,
    }));
  }, []);
  const onMapClick = useCallback(() => {
    // Click en zona vacía del mapa no limpia selección — se cierra con botón "Cerrar".
  }, []);

  const onZoomToSelection = useCallback(() => {
    if (!selection) return;
    const g = selection.feature.geometry;
    if (!g || (g.type !== "Polygon" && g.type !== "MultiPolygon" && g.type !== "LineString" && g.type !== "MultiLineString"))
      return;
    // Calcular bbox manual
    let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
    const each = (coords: number[]) => {
      const [x, y] = coords;
      if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
    };
    const walk = (a: unknown): void => {
      if (Array.isArray(a) && typeof a[0] === "number") return each(a as number[]);
      if (Array.isArray(a)) a.forEach(walk);
    };
    walk((g as { coordinates: unknown }).coordinates);
    if (w !== Infinity) {
      setFlyTo({ bounds: [w, s, e, n], maxZoom: selection.kind === "lote" ? 19 : 17 });
    }
  }, [selection]);

  const onCloseInspector = useCallback(() => setSelection(null), []);

  const onPickSearch = useCallback((r: SearchResult) => {
    // Parse bbox geojson polygon
    let bounds: [number, number, number, number] | undefined;
    if (r.bbox) {
      try {
        const g = JSON.parse(r.bbox) as { coordinates: number[][][] };
        const ring = g.coordinates[0];
        let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
        for (const [x, y] of ring) {
          if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
        }
        bounds = [w, s, e, n];
      } catch {}
    }
    setFlyTo({ bounds, center: r.center ?? undefined, maxZoom: r.type === "tramo" ? 17 : 16 });
    pendingRef.current = { type: r.type, id: r.id };
    if (r.type === "tramo" && !showTramos) setShowTramos(true);
    setStatus({ text: `Buscando ${r.label}…`, loading: true });
  }, [showTramos]);

  // ---------- Centroide / geometría del lote seleccionado ----------
  function selectedLoteInfo() {
    if (selection?.kind !== "lote") return null;
    const f = selection.feature;
    const g = f.geometry as { type: string; coordinates: unknown };
    const ring =
      g.type === "Polygon"
        ? ((g.coordinates as number[][][])[0] ?? [])
        : g.type === "MultiPolygon"
          ? ((g.coordinates as number[][][][])[0]?.[0] ?? [])
          : [];
    if (!ring.length) return null;
    let sx = 0,
      sy = 0;
    for (const [x, y] of ring) {
      sx += x;
      sy += y;
    }
    const lng = sx / ring.length;
    const lat = sy / ring.length;
    const area = f.properties.area_m2 ?? 0;
    const predioId = String(f.id ?? "");
    const coloniaId = loadedColoniaId ?? "";
    return { lat, lng, area, predioId, coloniaId };
  }

  // ---------- "Vincular propiedad existente con este lote" ----------
  const [linking, setLinking] = useState(false);
  const onVincularPropiedadAEsteLote = useCallback(async () => {
    if (!linkPropertyId) return;
    const info = selectedLoteInfo();
    if (!info) return;
    if (!info.coloniaId || !info.predioId) {
      setStatus({ text: "Necesitas un lote dentro de una colonia" });
      return;
    }
    setLinking(true);
    setStatus({ text: "Vinculando…", loading: true });
    const r = await vincularPropiedadConLote(
      linkPropertyId,
      info.predioId,
      info.coloniaId,
      info.lat,
      info.lng,
      info.area || null,
    );
    setLinking(false);
    if (r.ok) {
      router.push(`/propiedades/${linkPropertyId}` as never);
    } else {
      setStatus({ text: `Error: ${r.error ?? "?"}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkPropertyId, selection, loadedColoniaId, router]);

  // ---------- Layout ----------
  const showInspector = !!selection;
  const railW = APP_RAIL_WIDTH;
  const sidebarW = sidebarCollapsed ? 0 : 380;
  const inspectorW = showInspector ? 380 : 0;
  const gridStyle = {
    gridTemplateColumns: `${railW}px ${sidebarW}px 1fr ${inspectorW}px`,
    gridTemplateRows: `64px 1fr 32px`,
    transition: "grid-template-columns 200ms ease-out",
  } as React.CSSProperties;

  return (
    <div className="h-screen w-screen grid bg-paper overflow-hidden" style={gridStyle}>
      {/* Rail (column 1, spans all rows) */}
      <div className="row-span-3" style={{ gridColumn: 1, gridRow: "1 / span 3" }}>
        <AppRail items={railItems} activeId="cartografia" />
      </div>

      {/* Header (cols 2-4 row 1) */}
      <header
        style={{
          gridColumn: "2 / span 3",
          gridRow: 1,
          background: "var(--color-ink-900)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        className="flex items-center px-5 relative"
      >
        <Link href="/" className="flex items-baseline gap-3 hover:opacity-80 transition-opacity">
          <span style={{ font: "600 16px var(--font-sans)", color: "#fff", letterSpacing: "-0.01em" }}>
            propaily
          </span>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              paddingLeft: 12,
              borderLeft: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            CARTOGRAFÍA · LEÓN · 2026
          </span>
        </Link>
        <div className="flex-1 flex justify-center px-6">
          <SearchBox onPick={onPickSearch} />
        </div>
        <div className="flex items-center gap-3">
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.04em",
            }}
          >
            {user.name ?? user.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="cursor-pointer"
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 6,
                fontSize: 11,
                padding: "5px 10px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
              }}
            >
              Salir
            </button>
          </form>
        </div>
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "auto 0 -3px 0",
            height: 3,
            background: "linear-gradient(90deg, var(--color-pp-700) 0%, var(--color-pp-500) 50%, var(--color-pp-300) 100%)",
            pointerEvents: "none",
          }}
        />
      </header>

      {/* Sidebar (col 2, row 2) */}
      <div style={{ gridColumn: 2, gridRow: 2, overflow: "hidden" }}>
        {sidebarCollapsed ? null : (
          <Sidebar
            showTramos={showTramos}
            showLotes={showLotes}
            onToggleTramos={setShowTramos}
            onToggleLotes={setShowLotes}
            counts={counts}
            zoom={zoom}
            bbox={bboxStr}
            tip={tip}
            onCollapse={collapseSidebar}
          />
        )}
      </div>
      {sidebarCollapsed ? (
        <button
          type="button"
          onClick={expandSidebar}
          aria-label="Mostrar panel"
          title="Mostrar panel"
          style={{ left: `${railW}px`, top: 64 }}
          className="fixed z-[2000] bg-navy text-lime border-r border-r-navy-3 h-9 w-7 rounded-r-md inline-flex items-center justify-center cursor-pointer hover:bg-navy-2 shadow-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ) : null}

      {/* Mapa (col 3, row 2) */}
      <div className="relative" style={{ gridColumn: 3, gridRow: 2 }}>
        {linkPropertyId ? (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-[1500] flex items-center gap-3"
            style={{
              background: "var(--color-pp-700)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 999,
              boxShadow: "var(--shadow-lg)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.04em",
            }}
          >
            <span
              className="animate-pulse"
              style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-pp-300)" }}
            />
            <span>Modo vincular · selecciona el lote correspondiente a esta propiedad</span>
            <button
              type="button"
              onClick={() => router.push(`/propiedades/${linkPropertyId}` as never)}
              className="cursor-pointer"
              style={{
                marginLeft: 8,
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                background: "transparent",
                border: "none",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Cancelar
            </button>
          </div>
        ) : null}
        <MapClient
          colonias={colonias}
          tramos={tramos}
          lotes={lotes}
          selection={selection}
          watermark={watermark}
          flyTo={flyTo}
          onViewportChange={onViewportChange}
          onSelectColonia={onSelectColonia}
          onSelectTramo={onSelectTramo}
          onSelectLote={onSelectLote}
          onMapClick={onMapClick}
        />
      </div>

      {/* Inspector (col 4, row 2) */}
      <div style={{ gridColumn: 4, gridRow: 2, overflow: "hidden" }}>
        {showInspector ? (
          <Inspector
            selection={selection}
            onZoom={onZoomToSelection}
            onClose={onCloseInspector}
            onVincularLote={linkPropertyId ? onVincularPropiedadAEsteLote : undefined}
            linking={linking}
          />
        ) : null}
      </div>

      {/* Status bar (cols 2-4 row 3) */}
      <footer
        style={{
          gridColumn: "2 / span 3",
          gridRow: 3,
          background: "var(--color-ink-900)",
          color: "rgba(255,255,255,0.65)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
        className="flex items-center px-5 gap-5"
      >
        <span className="flex items-center gap-2">
          <span
            className={status.loading ? "animate-pulse" : ""}
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: status.loading ? "var(--color-pp-400)" : "var(--color-ok)",
            }}
          />
          {status.text}
        </span>
        <span>Fuente: PostGIS · GFC</span>
        <span style={{ marginLeft: "auto" }}>Propaily v0.1 · Next.js</span>
      </footer>
    </div>
  );
}
