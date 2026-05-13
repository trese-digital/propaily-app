"use client";

import type { Dispatch, SetStateAction } from "react";

export type LayerCounts = {
  colonias: number | null;
  tramos: number | null;
  lotes: number | null;
};

export function Sidebar({
  showTramos,
  showLotes,
  onToggleTramos,
  onToggleLotes,
  counts,
  zoom,
  bbox,
  tip,
  onCollapse,
}: {
  showTramos: boolean;
  showLotes: boolean;
  onToggleTramos: Dispatch<SetStateAction<boolean>>;
  onToggleLotes: Dispatch<SetStateAction<boolean>>;
  counts: LayerCounts;
  zoom: number | null;
  bbox: string | null;
  tip: string | null;
  onCollapse: () => void;
}) {
  return (
    <aside
      style={{
        background: "var(--bg)",
        borderRight: "1px solid var(--border)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span className="mono-label">Panel</span>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Ocultar panel"
          title="Ocultar panel"
          className="cursor-pointer"
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--fg-muted)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <Section title="Capas">
        <LayerRow color="var(--color-pp-500)" name="Colonias" count={counts.colonias} />
        <LayerRow
          color="var(--color-pp-300)"
          name="Tramos / vialidad"
          count={counts.tramos}
          input={
            <input
              type="checkbox"
              checked={showTramos}
              onChange={(e) => onToggleTramos(e.target.checked)}
              style={{ marginRight: 6, accentColor: "var(--color-pp-500)" }}
            />
          }
        />
        <LayerRow
          color="var(--color-pp-700)"
          name="Lotes (auto)"
          count={counts.lotes}
          input={
            <input
              type="checkbox"
              checked={showLotes}
              onChange={(e) => onToggleLotes(e.target.checked)}
              style={{ marginRight: 6, accentColor: "var(--color-pp-500)" }}
            />
          }
        />
      </Section>

      <Section title="Valor fiscal 2026 — escala">
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background:
              "linear-gradient(90deg, var(--color-pp-100) 0%, var(--color-pp-400) 50%, var(--color-pp-700) 100%)",
          }}
        />
        <div
          className="mono"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 11,
            color: "var(--fg-muted)",
          }}
        >
          <span>$92</span>
          <span>$8,770</span>
          <span>$17,449</span>
        </div>
      </Section>

      <Section title="Viewport">
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.7 }}
        >
          <div>
            zoom:{" "}
            <span style={{ color: "var(--fg)" }}>{zoom == null ? "—" : zoom.toFixed(1)}</span>
          </div>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            bbox: <span style={{ color: "var(--fg)" }}>{bbox ?? "—"}</span>
          </div>
          {tip && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 10px",
                background: "var(--accent-soft)",
                color: "var(--color-pp-700)",
                borderRadius: 6,
                fontFamily: "var(--font-sans)",
                letterSpacing: 0,
                fontSize: 12,
                lineHeight: 1.45,
              }}
            >
              {tip}
            </div>
          )}
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 18, borderBottom: "1px solid var(--border)" }}>
      <h3 className="mono-label" style={{ margin: "0 0 12px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function LayerRow({
  color,
  name,
  count,
  input,
}: {
  color: string;
  name: string;
  count: number | null;
  input?: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        cursor: "pointer",
        fontSize: 13,
        color: "var(--fg)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
        {input}
        {name}
      </span>
      <span
        className="mono num"
        style={{
          fontSize: 11,
          background: "var(--bg-muted)",
          color: "var(--fg-muted)",
          padding: "1px 8px",
          borderRadius: 999,
          border: "1px solid var(--border)",
        }}
      >
        {count == null ? "—" : count.toLocaleString("es-MX")}
      </span>
    </label>
  );
}
