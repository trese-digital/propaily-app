"use client";

/** Tabs — tira de pestañas controlada. El contenido lo renderiza el padre. */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type TabItem = { id: string; label: ReactNode; count?: number };

export function Tabs({
  items,
  value,
  onValueChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("flex gap-1 border-b border-ink-100", className)}
    >
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(it.id)}
            className={cn(
              "relative cursor-pointer px-3 py-2.5 text-[13px] font-medium transition-colors",
              active ? "text-pp-700" : "text-ink-500 hover:text-ink-800",
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {it.label}
              {it.count != null && (
                <span
                  className={cn(
                    "num rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-pp-100 text-pp-700"
                      : "bg-ink-100 text-ink-500",
                  )}
                >
                  {it.count}
                </span>
              )}
            </span>
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-pp-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
