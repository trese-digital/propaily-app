/** Kpi — celda de métrica: label mono, número tabular, delta y sparkline. */
import type { ReactNode } from "react";

import { IcArrowDown, IcArrowUp } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";

const SPARK_W = 200;
const SPARK_H = 48;

function sparkPaths(values: number[]) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = SPARK_W / (values.length - 1);
  const pts = values.map(
    (v, i) =>
      [i * step, SPARK_H - ((v - min) / range) * (SPARK_H - 8) - 4] as const,
  );
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return { line, area: `${line} L${SPARK_W},${SPARK_H} L0,${SPARK_H} Z` };
}

export function Kpi({
  label,
  value,
  delta,
  note,
  spark,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: { value: string; tone: "ok" | "bad"; note?: string };
  /** Línea de contexto bajo el valor cuando no hay `delta` (ej. "MXN · mes"). */
  note?: ReactNode;
  spark?: number[];
  className?: string;
}) {
  const paths = spark ? sparkPaths(spark) : null;
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink-500">
        {label}
      </span>
      <div className="num text-[32px] font-semibold leading-none tracking-[-0.025em]">
        {value}
      </div>
      {delta ? (
        <div className="flex items-center gap-2">
          <Badge tone={delta.tone}>
            {delta.tone === "ok" ? (
              <IcArrowUp size={10} />
            ) : (
              <IcArrowDown size={10} />
            )}
            {delta.value}
          </Badge>
          {delta.note && (
            <span className="text-xs text-ink-500">{delta.note}</span>
          )}
        </div>
      ) : note ? (
        <div className="text-xs text-ink-500">{note}</div>
      ) : null}
      {paths && (
        <svg
          viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
          className="mt-1 h-12 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={paths.area}
            fill="var(--color-pp-500)"
            fillOpacity={0.1}
          />
          <path
            d={paths.line}
            fill="none"
            stroke="var(--color-pp-500)"
            strokeWidth={1.5}
          />
        </svg>
      )}
    </div>
  );
}
