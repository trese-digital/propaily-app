/** Card — contenedor blanco con borde. Header opcional con título + acción. */
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("rounded-xl border border-ink-100 bg-white", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-ink-100 px-4 py-3.5",
        className,
      )}
    >
      <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
