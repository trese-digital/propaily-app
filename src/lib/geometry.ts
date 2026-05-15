/**
 * Utilidades geométricas para el visor.
 * Trabajan en lat/lng (GeoJSON) y proyectan localmente a metros.
 */

import type { Geometry, Polygon, MultiPolygon } from "geojson";

/** Proyección equirectangular local (suficiente para lotes < 500 m). */
function latLngToMeters(lat: number, lng: number, lat0: number): [number, number] {
  const R = 6378137;
  const rad = Math.PI / 180;
  return [R * lng * rad * Math.cos(lat0 * rad), R * lat * rad];
}

function extractRing(geom: Geometry | null | undefined): number[][] {
  if (!geom) return [];
  if (geom.type === "Polygon") return (geom as Polygon).coordinates[0] ?? [];
  if (geom.type === "MultiPolygon") {
    let best: number[][] = [];
    for (const poly of (geom as MultiPolygon).coordinates) {
      const ring = poly[0] ?? [];
      if (ring.length > best.length) best = ring;
    }
    return best;
  }
  return [];
}

/** Andrew's monotone chain. Espera puntos [x, y]. */
function convexHull(pts: [number, number][]): [number, number][] {
  if (pts.length < 3) return pts.slice();
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0)
      lower.pop();
    lower.push(q);
  }
  const upper: [number, number][] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0)
      upper.pop();
    upper.push(q);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Devuelve dimensiones del lote.
 * Convención catastral MX: el frente es la cara a calle (lado menor del
 * bounding box mínimo) y el fondo es la profundidad (lado mayor).
 */
export function loteDimsFromGeometry(
  geom: Geometry | null | undefined,
): { frente: number; fondo: number; perimetro: number } | null {
  const ring = extractRing(geom);
  if (ring.length < 3) return null;
  const lat0 = ring.reduce((s, c) => s + c[1], 0) / ring.length;
  const pts: [number, number][] = ring.map(([lng, lat]) => latLngToMeters(lat, lng, lat0));

  let perim = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    perim += Math.hypot(dx, dy);
  }

  const hull = convexHull(pts);
  if (hull.length < 2) return null;

  let best: { w: number; h: number; area: number } | null = null;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    if (len === 0) continue;
    const ux = dx / len;
    const uy = dy / len;
    const vx = -uy;
    const vy = ux;
    let uMin = Infinity,
      uMax = -Infinity,
      vMin = Infinity,
      vMax = -Infinity;
    for (const p of hull) {
      const pu = p[0] * ux + p[1] * uy;
      const pv = p[0] * vx + p[1] * vy;
      if (pu < uMin) uMin = pu;
      if (pu > uMax) uMax = pu;
      if (pv < vMin) vMin = pv;
      if (pv > vMax) vMax = pv;
    }
    const w = uMax - uMin;
    const h = vMax - vMin;
    const area = w * h;
    if (!best || area < best.area) best = { w, h, area };
  }
  if (!best) return null;

  return {
    frente: Math.min(best.w, best.h),
    fondo: Math.max(best.w, best.h),
    perimetro: perim,
  };
}

/** Coloreo log-scale entre navy → teal → lime para valores fiscales. */
const SCALE_MIN = 92;
const SCALE_MAX = 17500;

export function colorByValue(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return "#9097A8";
  const lmin = Math.log10(SCALE_MIN);
  const lmax = Math.log10(SCALE_MAX);
  const lv = Math.log10(Math.max(SCALE_MIN, Math.min(SCALE_MAX, v)));
  const t = Math.max(0, Math.min(1, (lv - lmin) / (lmax - lmin)));
  // navy-3 → teal → lime
  const stops: Array<[number, [number, number, number]]> = [
    [0.0, [0x1a, 0x1f, 0x44]],
    [0.5, [0x00, 0xb6, 0xd4]],
    [1.0, [0xc8, 0xff, 0x3a]],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const f = (t - t0) / (t1 - t0);
      const c = c0.map((vv, k) => Math.round(vv + (c1[k] - vv) * f));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return "rgb(200,255,58)";
}

export function fmtMoney(n: number | null | undefined, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return (
    "$" +
    Number(n).toLocaleString("es-MX", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function fmtMoneyRange(min: number | null, max: number | null | undefined): string {
  if (min == null) return "—";
  if (min === max) return fmtMoney(min, 0);
  return `${fmtMoney(min, 0)} – ${fmtMoney(max ?? min, 0)}`;
}

export function fmtArea(m2: number): string {
  if (m2 >= 10000) return `${(m2 / 10000).toFixed(2)} ha`;
  if (m2 >= 1000) return `${(m2 / 1000).toFixed(2)} mil m²`;
  return `${Math.round(m2).toLocaleString("es-MX")} m²`;
}
