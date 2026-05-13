/**
 * Parsing y validación de bbox "west,south,east,north".
 * Anti-scraping: rechaza bboxes mayores a MAX_BBOX_DEG.
 */
export const MAX_BBOX_DEG = 0.5;

export type Bbox = { w: number; s: number; e: number; n: number };

export type BboxParseOk = { ok: true; bbox: Bbox };
export type BboxParseErr = { ok: false; code: string; message: string };

export function parseBbox(raw: string | null): BboxParseOk | BboxParseErr {
  if (!raw) {
    return { ok: false, code: "BBOX_REQUIRED", message: "Parámetro `bbox` obligatorio" };
  }
  const parts = raw.split(",");
  if (parts.length !== 4) {
    return { ok: false, code: "BBOX_INVALID", message: "bbox debe ser 'west,south,east,north'" };
  }
  const [w, s, e, n] = parts.map((p) => Number(p));
  if ([w, s, e, n].some((v) => Number.isNaN(v))) {
    return { ok: false, code: "BBOX_INVALID", message: "bbox con valores no numéricos" };
  }
  if (!(w >= -180 && w <= 180 && e >= -180 && e <= 180 && s >= -90 && s <= 90 && n >= -90 && n <= 90)) {
    return { ok: false, code: "BBOX_INVALID", message: "bbox fuera de rango" };
  }
  if (w >= e || s >= n) {
    return {
      ok: false,
      code: "BBOX_INVALID",
      message: "bbox inválido (west >= east o south >= north)",
    };
  }
  if (e - w > MAX_BBOX_DEG || n - s > MAX_BBOX_DEG) {
    return {
      ok: false,
      code: "BBOX_TOO_LARGE",
      message: `bbox demasiado grande (> ${MAX_BBOX_DEG}°)`,
    };
  }
  return { ok: true, bbox: { w, s, e, n } };
}
