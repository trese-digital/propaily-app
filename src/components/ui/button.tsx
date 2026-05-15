/**
 * Button / IconButton — primitiva v2.
 * Sin `"use client"`: solo renderiza un `<button>` y reenvía props. Un
 * `onClick` lo provee el Client Component que lo use; el boundary vive ahí.
 */
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const sizeCls: Record<ButtonSize, string> = {
  lg: "h-10 px-4 text-sm gap-2",
  md: "h-[34px] px-3 text-[13px] gap-1.5",
  sm: "h-7 px-2.5 text-xs gap-1.5",
};

const variantCls: Record<ButtonVariant, string> = {
  primary:
    "bg-pp-500 text-white border border-transparent hover:bg-pp-600 shadow-[0_1px_2px_rgba(27,8,83,0.2)]",
  secondary:
    "bg-white text-ink-700 border border-ink-200 hover:bg-ink-25 shadow-[0_1px_2px_rgba(27,8,83,0.04)]",
  ghost: "bg-transparent text-ink-700 border border-transparent hover:bg-ink-50",
  danger: "bg-white text-bad border border-ink-200 hover:bg-bad-soft",
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium tracking-[-0.005em] " +
  "transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-45";

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, sizeCls[size], variantCls[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

const iconSizeCls: Record<ButtonSize, string> = {
  lg: "h-10 w-10",
  md: "h-[34px] w-[34px]",
  sm: "h-7 w-7",
};

/** Botón cuadrado solo-icono. Pásale un `aria-label` siempre. */
export function IconButton({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, iconSizeCls[size], variantCls[variant], "px-0", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
