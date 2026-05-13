"use client";

import { useEffect, useState } from "react";

import { fmtArea, fmtMoney, fmtMoneyRange, loteDimsFromGeometry } from "@/lib/geometry";
import type { Selection } from "./types";

type ColoniaStats = {
  num_lotes: number;
  area_avg: number | null;
  area_p50: number | null;
  area_min: number | null;
  area_max: number | null;
  num_propiedades_propaily: number;
};

export function Inspector({
  selection,
  onZoom,
  onClose,
  onVincularLote,
  linking,
}: {
  selection: Selection;
  onZoom: () => void;
  onClose: () => void;
  onVincularLote?: () => void;
  linking?: boolean;
}) {
  if (!selection) return null;

  return (
    <aside className="bg-white border-l border-black/8 overflow-y-auto flex flex-col h-full">
      {selection.kind === "colonia" ? (
        <ColoniaPanel selection={selection} onZoom={onZoom} onClose={onClose} />
      ) : selection.kind === "tramo" ? (
        <TramoPanel selection={selection} onZoom={onZoom} onClose={onClose} />
      ) : (
        <LotePanel
          selection={selection}
          onZoom={onZoom}
          onClose={onClose}
          onVincular={onVincularLote}
          linking={linking}
        />
      )}
    </aside>
  );
}

function Breadcrumb({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-black/8 font-mono text-[11px] text-slate tracking-wider">
      {children}
    </div>
  );
}

function ValueBlock({
  label,
  value,
  unit,
  secondary,
}: {
  label: string;
  value: string;
  unit?: string;
  secondary?: boolean;
}) {
  const shown = value && value.trim() ? value : "—";
  return (
    <div
      className="mx-5 my-3 p-4 rounded-md relative"
      style={{
        background: secondary ? "var(--color-paper-2)" : "var(--color-navy)",
        display: "block",
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 gfc-bar pointer-events-none rounded-t-md"
        aria-hidden
      />
      <div
        className="font-mono"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: secondary ? "var(--color-slate)" : "var(--color-slate-2)",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      <div
        className="font-display"
        style={{
          fontSize: secondary ? "22px" : "26px",
          fontWeight: 600,
          lineHeight: 1.15,
          color: secondary ? "var(--color-navy)" : "var(--color-lime)",
          wordBreak: "break-word",
          display: "block",
          minHeight: "1.2em",
        }}
      >
        {shown}
      </div>
      {unit ? (
        <div
          className="font-mono"
          style={{
            fontSize: "11px",
            marginTop: "6px",
            color: secondary ? "var(--color-slate)" : "var(--color-slate-2)",
          }}
        >
          {unit}
        </div>
      ) : null}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-black/8 last:border-b-0 font-mono text-[11px]">
      <span className="text-slate tracking-wider">{k}</span>
      <span className="text-navy font-medium">{v}</span>
    </div>
  );
}

function Actions({ onZoom, onClose }: { onZoom: () => void; onClose: () => void }) {
  return (
    <div className="flex gap-2 p-5 border-t border-black/8 mt-auto">
      <button
        type="button"
        onClick={onZoom}
        className="flex-1 py-2.5 text-sm font-semibold bg-transparent text-navy border border-black/20 rounded-md cursor-pointer hover:bg-paper-2"
      >
        Centrar
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-2.5 text-sm font-semibold bg-teal text-navy border border-teal rounded-md cursor-pointer hover:bg-teal-bright"
      >
        Cerrar
      </button>
    </div>
  );
}

function ColoniaPanel({
  selection,
  onZoom,
  onClose,
}: {
  selection: Extract<Selection, { kind: "colonia" }>;
  onZoom: () => void;
  onClose: () => void;
}) {
  const p = selection.feature.properties;
  const coloniaId = selection.feature.id ? String(selection.feature.id) : null;
  const usoChips = (p.uso_suelo ?? "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 6);

  const [stats, setStats] = useState<ColoniaStats | null>(null);
  const [statsState, setStatsState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!coloniaId) return;
    let cancelled = false;
    setStatsState("loading");
    setStats(null);
    fetch(`/api/cartografia/colonias/${coloniaId}/stats`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: ColoniaStats) => {
        if (cancelled) return;
        setStats(data);
        setStatsState("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setStatsState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [coloniaId]);
  return (
    <>
      <Breadcrumb>
        LEÓN <span className="opacity-50">›</span> SECTOR <b className="text-navy font-medium">{p.sector ?? "—"}</b>
      </Breadcrumb>
      <div className="px-5 py-5">
        <p className="font-mono text-[11px] text-slate tracking-[0.18em] m-0 mb-2">PANORAMA</p>
        <h2 className="font-display text-xl font-medium m-0 mb-3 leading-tight text-navy">
          {p.colonia ?? "Sin nombre"}
        </h2>
        <div className="flex flex-wrap gap-1">
          {p.tipo_zona ? <Pill tone="navy">{p.tipo_zona}</Pill> : null}
          {usoChips.map((u) => (
            <Pill key={u} tone="ghost">
              {u}
            </Pill>
          ))}
          {p.aplica_tramos ? <Pill tone="magenta">⚠ TRAMOS</Pill> : null}
        </div>
      </div>

      <ValueBlock
        label="VALOR FISCAL · 2026"
        value={fmtMoney(p.valor_fiscal, 2)}
        unit={`$/m² · ${p.descripcion_zona ?? p.tipo_zona_norm ?? "—"}`}
      />
      <ValueBlock
        label="VALOR COMERCIAL · 2026"
        value={
          p.valor_comercial_min != null
            ? fmtMoneyRange(p.valor_comercial_min, p.valor_comercial_max)
            : p.valor_comercial_raw ?? "—"
        }
        unit={
          p.incremento_pct_vs_anterior != null
            ? `$/m² · ${(p.incremento_pct_vs_anterior * 100).toFixed(1)}% YoY`
            : "$/m²"
        }
        secondary
      />

      <div className="mx-5 py-4 font-mono text-[11px]">
        <KV k="SECTOR" v={String(p.sector ?? "—")} />
        <KV k="TIPO ZONA" v={p.tipo_zona ?? "—"} />
        <KV k="USO SUELO" v={p.uso_suelo ?? "—"} />
        <KV
          k="ÁREA"
          v={p.area_m2 != null ? `${(p.area_m2 / 10000).toFixed(2)} ha` : "—"}
        />
      </div>

      <div className="mx-5 mt-2 mb-3">
        <p className="font-mono text-[10px] text-slate tracking-[0.18em] uppercase mb-2">
          Lotes en la colonia
        </p>
        {statsState === "loading" ? (
          <div className="bg-paper-2 rounded-md p-3 font-mono text-[11px] text-slate">
            Calculando…
          </div>
        ) : statsState === "error" ? (
          <div className="bg-paper-2 rounded-md p-3 font-mono text-[11px] text-magenta">
            No se pudieron cargar las estadísticas.
          </div>
        ) : stats ? (
          <div className="bg-paper-2 rounded-md p-3 font-mono text-[11px]">
            <KV k="LOTES" v={stats.num_lotes.toLocaleString("es-MX")} />
            {stats.area_p50 != null ? (
              <KV k="LOTE TÍPICO" v={fmtArea(stats.area_p50)} />
            ) : null}
            {stats.area_avg != null ? (
              <KV k="LOTE PROMEDIO" v={fmtArea(stats.area_avg)} />
            ) : null}
            {stats.area_min != null && stats.area_max != null ? (
              <KV
                k="RANGO"
                v={`${fmtArea(stats.area_min)} – ${fmtArea(stats.area_max)}`}
              />
            ) : null}
            {stats.num_propiedades_propaily > 0 ? (
              <KV
                k="PROPAILY"
                v={`${stats.num_propiedades_propaily} propiedad${stats.num_propiedades_propaily === 1 ? "" : "es"}`}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {p.observacion ? (
        <div className="mx-5 my-3 p-3 bg-paper-2 border-l-[3px] border-l-magenta text-[11px] text-navy leading-relaxed">
          <b className="font-mono tracking-wider">OBSERVACIÓN</b>
          <br />
          {p.observacion}
        </div>
      ) : null}

      <Actions onZoom={onZoom} onClose={onClose} />
    </>
  );
}

function TramoPanel({
  selection,
  onZoom,
  onClose,
}: {
  selection: Extract<Selection, { kind: "tramo" }>;
  onZoom: () => void;
  onClose: () => void;
}) {
  const p = selection.feature.properties;
  return (
    <>
      <Breadcrumb>
        LEÓN <span className="opacity-50">›</span> VIALIDAD <b className="text-navy font-medium">{p.via_codigo ?? "—"}</b>{" "}
        <span className="opacity-50">›</span> TRAMO
      </Breadcrumb>
      <div className="px-5 py-5">
        <p className="font-mono text-[11px] text-slate tracking-[0.18em] m-0 mb-2">VIALIDAD</p>
        <h2 className="font-display text-xl font-medium m-0 mb-3 leading-tight text-navy">
          {p.vialidad ?? "Sin nombre"}
        </h2>
        <div className="flex flex-wrap gap-1">
          {p.via_codigo ? <Pill tone="magenta">{p.via_codigo}</Pill> : null}
          <Pill tone="ghost">SECTOR {p.sector ?? "—"}</Pill>
        </div>
        {p.tramo_desc ? (
          <p className="mt-3 text-sm text-slate">{p.tramo_desc}</p>
        ) : null}
      </div>

      <ValueBlock
        label="VALOR FISCAL · 2026"
        value={fmtMoney(p.valor_fiscal, 2)}
        unit={
          p.incremento_pct_vs_anterior != null
            ? `$/m² · ${(p.incremento_pct_vs_anterior * 100).toFixed(1)}% YoY`
            : "$/m²"
        }
      />
      <ValueBlock
        label="VALOR COMERCIAL · 2026"
        value={
          p.valor_comercial_min != null
            ? fmtMoneyRange(p.valor_comercial_min, p.valor_comercial_max)
            : p.valor_comercial_raw ?? "—"
        }
        unit="$/m²"
        secondary
      />

      {p.observacion ? (
        <div className="mx-5 my-3 p-3 bg-paper-2 border-l-[3px] border-l-magenta text-[11px] text-navy">
          {p.observacion}
        </div>
      ) : null}

      <Actions onZoom={onZoom} onClose={onClose} />
    </>
  );
}

function LotePanel({
  selection,
  onZoom,
  onClose,
  onVincular,
  linking,
}: {
  selection: Extract<Selection, { kind: "lote" }>;
  onZoom: () => void;
  onClose: () => void;
  onVincular?: () => void;
  linking?: boolean;
}) {
  const p = selection.feature.properties;
  const area = p.area_m2 ?? 0;
  const dims = loteDimsFromGeometry(selection.feature.geometry);
  const cp = selection.coloniaCtx;
  const vf = cp?.valor_fiscal;
  const vcMin = cp?.valor_comercial_min;
  const vcMax = cp?.valor_comercial_max;
  const estFiscal = vf != null ? vf * area : null;
  const estComMin = vcMin != null ? vcMin * area : null;
  const estComMax = vcMax != null ? vcMax * area : null;
  const idShort = String(selection.feature.id ?? "").split("-")[0] || "—";

  return (
    <>
      <Breadcrumb>
        LEÓN <span className="opacity-50">›</span>{" "}
        {cp?.colonia ? (
          <>
            <b className="text-navy font-medium">{cp.colonia}</b>{" "}
            <span className="opacity-50">›</span>{" "}
          </>
        ) : null}
        LOTE
      </Breadcrumb>
      <div className="px-5 py-5">
        <p className="font-mono text-[11px] text-slate tracking-[0.18em] m-0 mb-2">LOTE</p>
        <h2 className="font-display text-xl font-medium m-0 mb-3 leading-tight text-navy">
          #{idShort}
        </h2>
        <div className="flex flex-wrap gap-1">
          <Pill tone="lime">{fmtArea(area)}</Pill>
          {cp?.tipo_zona ? <Pill tone="ghost">{cp.tipo_zona}</Pill> : null}
        </div>
      </div>

      {estFiscal != null ? (
        <ValueBlock
          label="VALOR FISCAL ESTIMADO · 2026"
          value={fmtMoney(estFiscal, 0)}
          unit={`${fmtMoney(vf, 2)}/m² × ${fmtArea(area)}`}
        />
      ) : null}
      {estComMin != null ? (
        <ValueBlock
          label="VALOR COMERCIAL ESTIMADO · 2026"
          value={
            estComMin === estComMax
              ? fmtMoney(estComMin, 0)
              : `${fmtMoney(estComMin, 0)} – ${fmtMoney(estComMax, 0)}`
          }
          unit="basado en valor de la colonia"
          secondary
        />
      ) : null}

      <div className="mx-5 py-4 font-mono text-[11px]">
        <KV k="ÁREA" v={fmtArea(area)} />
        {dims ? (
          <>
            <KV k="FRENTE / LARGO" v={`${dims.frente.toFixed(2)} m`} />
            <KV k="FONDO / ANCHO" v={`${dims.fondo.toFixed(2)} m`} />
            <KV k="PERÍMETRO" v={`${dims.perimetro.toFixed(2)} m`} />
          </>
        ) : null}
        {cp?.colonia ? <KV k="COLONIA" v={cp.colonia} /> : null}
        {cp?.sector != null ? <KV k="SECTOR" v={String(cp.sector)} /> : null}
        <KV k="ID" v={idShort} />
      </div>

      {onVincular ? (
        <div className="mx-5 mb-3">
          <button
            type="button"
            onClick={onVincular}
            disabled={linking}
            className="w-full bg-lime text-navy py-2.5 px-4 rounded-md font-semibold text-sm border border-lime hover:bg-lime/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {linking ? "Vinculando…" : "✓ Vincular esta propiedad con este lote"}
          </button>
        </div>
      ) : null}

      <Actions onZoom={onZoom} onClose={onClose} />
    </>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "teal" | "magenta" | "lime" | "navy" | "ghost";
  children: React.ReactNode;
}) {
  const cls: Record<typeof tone, string> = {
    teal: "bg-teal text-navy",
    magenta: "bg-magenta text-white",
    lime: "bg-lime text-navy font-mono",
    navy: "bg-navy text-white",
    ghost: "bg-transparent text-slate border border-black/8 font-mono",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium tracking-wide ${cls[tone]}`}
    >
      {children}
    </span>
  );
}
