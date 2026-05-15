/** Badge — pill con dot. 6 tonos. Ideal para densidad de tabla. */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "ok" | "warn" | "bad" | "info" | "violet" | "neutral";

const toneCls: Record<BadgeTone, { wrap: string; dot: string }> = {
  ok: { wrap: "bg-ok-soft text-ok-fg", dot: "bg-ok" },
  warn: { wrap: "bg-warn-soft text-warn-fg", dot: "bg-warn" },
  bad: { wrap: "bg-bad-soft text-bad-fg", dot: "bg-bad" },
  info: { wrap: "bg-info-soft text-info-fg", dot: "bg-info" },
  violet: { wrap: "bg-pp-50 text-pp-700", dot: "bg-pp-500" },
  neutral: { wrap: "bg-ink-50 text-ink-600", dot: "bg-ink-400" },
};

export function Badge({
  tone = "neutral",
  dot = true,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const t = toneCls[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-medium",
        t.wrap,
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}
