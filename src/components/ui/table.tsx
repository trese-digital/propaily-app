/**
 * Table — elementos `<table>` estilizados. Header en Geist Mono uppercase,
 * filas con zebra. Composición libre por las pantallas.
 */
import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

export function Table({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-ink-100",
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[var(--bg-subtle)] text-ink-500">{children}</thead>
  );
}

export function TH({
  className,
  align = "left",
  children,
  ...rest
}: {
  align?: "left" | "right" | "center";
} & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-ink-100 px-3.5 py-2.5 font-medium",
        "text-[11px] uppercase tracking-[0.04em]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  className,
  zebra,
  children,
  ...rest
}: {
  zebra?: boolean;
} & HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-ink-100 last:border-b-0",
        zebra ? "bg-[var(--bg-muted)]" : "bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TD({
  className,
  align = "left",
  children,
  ...rest
}: {
  align?: "left" | "right" | "center";
} & TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-3.5 py-3 text-ink-900",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}
