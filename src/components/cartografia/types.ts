import type { Feature, Geometry } from "geojson";

export type ColoniaProps = {
  sector?: number;
  colonia?: string;
  uso_suelo?: string;
  area_m2?: number;
  tipo_zona?: string;
  tipo_zona_norm?: string;
  descripcion_zona?: string;
  valor_fiscal?: number;
  valor_comercial_min?: number;
  valor_comercial_max?: number;
  valor_comercial_raw?: string;
  incremento_pct_vs_anterior?: number;
  aplica_tramos?: boolean;
  observacion?: string;
};

export type TramoProps = {
  vialidad?: string;
  via_codigo?: string;
  tramo_desc?: string;
  tramo_code?: string;
  sector?: number;
  valor_fiscal?: number;
  valor_comercial_min?: number;
  valor_comercial_max?: number;
  valor_comercial_raw?: string;
  incremento_pct_vs_anterior?: number;
  observacion?: string;
};

export type LoteProps = { area_m2: number | null };

export type ColoniaFeature = Feature<Geometry, ColoniaProps>;
export type TramoFeature = Feature<Geometry, TramoProps>;
export type LoteFeature = Feature<Geometry, LoteProps>;

export type Selection =
  | { kind: "colonia"; feature: ColoniaFeature }
  | { kind: "tramo"; feature: TramoFeature }
  | { kind: "lote"; feature: LoteFeature; coloniaCtx: ColoniaProps | null }
  | null;

export type SearchResult = {
  type: "colonia" | "tramo";
  id: string;
  label: string | null;
  sublabel: string | null;
  center: [number, number] | null;
  bbox: string | null;
};
