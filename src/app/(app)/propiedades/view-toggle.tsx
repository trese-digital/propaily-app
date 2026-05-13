"use client";

import { useTransition } from "react";

import { setPropertyView } from "./view-actions";
import type { PropertyView } from "./view-config";

export function ViewToggle({ view }: { view: PropertyView }) {
  const [pending, startTransition] = useTransition();

  function set(v: PropertyView) {
    if (v === view) return;
    startTransition(async () => {
      await setPropertyView(v);
    });
  }

  return (
    <div
      role="group"
      aria-label="Vista del listado"
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 2,
        opacity: pending ? 0.6 : 1,
        transition: "opacity var(--dur-fast) var(--ease)",
      }}
    >
      <ViewButton active={view === "grid"} label="Grid" onClick={() => set("grid")}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </ViewButton>
      <ViewButton active={view === "list"} label="Lista" onClick={() => set("list")}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </ViewButton>
    </div>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        border: "none",
        background: active ? "var(--color-ink-900)" : "transparent",
        color: active ? "#fff" : "var(--fg-muted)",
        transition: "background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
      }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
