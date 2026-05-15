/**
 * Feedback — Toast, Skeleton, EmptyState. Todo presentacional.
 * El control de aparición/cierre lo maneja quien los renderiza.
 */
import type { ComponentType, ReactNode } from "react";

import { IcX, type IconProps } from "@/components/icons";
import { cn } from "@/lib/cn";

/* ── Toast ─────────────────────────────────────────────── */

export type ToastTone = "ok" | "warn" | "bad" | "info" | "violet";

const toastBorder: Record<ToastTone, string> = {
  ok: "border-[#A7F3D0]",
  warn: "border-[#FDE68A]",
  bad: "border-[#FECACA]",
  info: "border-[#BFDBFE]",
  violet: "border-pp-200",
};
const toastDot: Record<ToastTone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  info: "bg-info",
  violet: "bg-pp-500",
};

export function Toast({
  tone,
  title,
  body,
  action,
  onClose,
  className,
}: {
  tone: ToastTone;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-white px-3.5 py-3",
        "shadow-[var(--shadow-sm)]",
        toastBorder[tone],
        className,
      )}
      role="status"
    >
      <span
        className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", toastDot[tone])}
      />
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-ink-900">{title}</div>
        {body && <p className="mt-0.5 text-xs text-ink-600">{body}</p>}
      </div>
      {action}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex cursor-pointer items-center rounded p-0.5 text-ink-400 transition-colors hover:text-ink-700"
        >
          <IcX size={12} />
        </button>
      )}
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────── */

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn("block animate-pulse rounded bg-ink-100", className)}
      aria-hidden
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-2.5 w-3/5" />
        <Skeleton className="h-2 w-2/5" />
      </div>
      <Skeleton className="h-2.5 w-20" />
    </div>
  );
}

/* ── EmptyState ────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  tone = "violet",
  accent = false,
  actions,
  className,
}: {
  icon: ComponentType<IconProps>;
  title: ReactNode;
  description?: ReactNode;
  tone?: "violet" | "warn";
  accent?: boolean;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2.5 overflow-hidden rounded-xl",
        "border border-ink-100 bg-white px-7 py-8 text-center",
        className,
      )}
    >
      {accent && (
        <span className="absolute inset-x-0 top-0 h-[3px] bg-pp-500" />
      )}
      <span
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-2xl",
          tone === "warn"
            ? "bg-warn-soft text-warn"
            : "bg-pp-50 text-pp-600",
        )}
      >
        <Icon size={26} />
        <span
          className={cn(
            "absolute -inset-2 rounded-[18px] border border-dashed",
            tone === "warn" ? "border-[#FDE68A]" : "border-pp-200",
          )}
        />
      </span>
      <h3 className="mt-2 text-base font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="max-w-[280px] text-[13px] leading-relaxed text-ink-500">
          {description}
        </p>
      )}
      {actions && <div className="mt-2 flex gap-1.5">{actions}</div>}
    </div>
  );
}
