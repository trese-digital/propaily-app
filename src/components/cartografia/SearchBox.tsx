"use client";

import { useEffect, useRef, useState } from "react";

import type { SearchResult } from "./types";

export function SearchBox({ onPick }: { onPick: (r: SearchResult) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(0);

  // Atajo ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Cierre al click fuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Debounce de fetch
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setError(null);
      setOpen(false);
      return;
    }
    const my = ++tokenRef.current;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/cartografia/search?q=${encodeURIComponent(term)}`, {
          credentials: "include",
        });
        if (my !== tokenRef.current) return;
        if (!r.ok) {
          setError(`Error ${r.status}`);
          setOpen(true);
          return;
        }
        const data = await r.json();
        setResults(data.results ?? []);
        setActive(data.results?.length ? 0 : -1);
        setError(null);
        setOpen(true);
      } catch (e) {
        if (my !== tokenRef.current) return;
        setError(e instanceof Error ? e.message : "Error");
        setOpen(true);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  function pick(r: SearchResult) {
    setOpen(false);
    setQ(r.label ?? "");
    inputRef.current?.blur();
    onPick(r);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length) setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (active >= 0 && results[active]) {
        e.preventDefault();
        pick(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-[480px]">
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.55)",
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => {
          if (results.length) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder="Buscar colonia, sector, vialidad…"
        autoComplete="off"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "#fff",
          padding: "8px 56px 8px 36px",
          height: 34,
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          outline: "none",
          transition: "border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)",
        }}
        className="focus:bg-(--color-ink-800) focus:border-(--color-pp-400) placeholder:text-white/45"
      />
      <span
        className="mono"
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 10,
          color: "rgba(255,255,255,0.55)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          padding: "2px 6px",
          borderRadius: 4,
          letterSpacing: "0.1em",
        }}
      >
        ⌘K
      </span>

      {open ? (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 6,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "var(--shadow-lg)",
            maxHeight: 360,
            overflowY: "auto",
            padding: 4,
            zIndex: 2000,
          }}
        >
          {error ? (
            <div style={{ padding: "12px 16px", color: "var(--fg-muted)", fontSize: 13 }}>{error}</div>
          ) : results.length === 0 ? (
            <div style={{ padding: "12px 16px", color: "var(--fg-muted)", fontSize: 13 }}>
              Sin resultados.
            </div>
          ) : (
            results.map((r, i) => (
              <button
                type="button"
                key={`${r.type}-${r.id}`}
                onClick={() => pick(r)}
                onMouseEnter={() => setActive(i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: i === active ? "var(--bg-muted)" : "transparent",
                  color: "var(--fg)",
                  border: "none",
                  cursor: "pointer",
                  transition: "background var(--dur-fast) var(--ease)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "3px 7px",
                    borderRadius: 4,
                    width: 64,
                    textAlign: "center",
                    flexShrink: 0,
                    background:
                      r.type === "tramo" ? "var(--color-pp-700)" : "var(--accent-soft)",
                    color: r.type === "tramo" ? "#fff" : "var(--color-pp-700)",
                  }}
                >
                  {r.type === "tramo" ? "Vialidad" : "Colonia"}
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span
                    style={{
                      font: "500 13px var(--font-sans)",
                      color: "var(--fg)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.label ?? "—"}
                  </span>
                  {r.sublabel && (
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--fg-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.sublabel}
                    </span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
