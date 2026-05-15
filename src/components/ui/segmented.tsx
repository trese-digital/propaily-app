"use client";

/** Segmented — control de 2+ opciones excluyentes (ej. vista grid/lista). */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type SegmentItem = { id: string; label: ReactNode };

export function Segmented({
  items,
  value,
  onValueChange,
  className,
}: {
  items: SegmentItem[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 rounded-lg border border-ink-100 bg-[var(--bg-subtle)] p-1",
        className,
      )}
    >
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            aria-pressed={active}
            onClick={() => onValueChange(it.id)}
            className={cn(
              "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5",
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-white text-ink-900 shadow-[var(--shadow-xs)]"
                : "text-ink-500 hover:text-ink-800",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
