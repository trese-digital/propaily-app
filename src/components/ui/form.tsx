/**
 * Primitivas de formulario — Field, Input, Textarea, Select, Kbd.
 * Renderizan elementos nativos (`<input>`, `<textarea>`, `<select>`) y
 * reenvían props; sin `"use client"`.
 */
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { IcChevD } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Wrapper label + hint + error para un control de formulario. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  full,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  full?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("flex flex-col gap-1.5", full && "col-span-full", className)}
    >
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink-700">
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-xs text-bad">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-ink-500">{hint}</span>
      ) : null}
    </div>
  );
}

const controlBase =
  "flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-2.5 " +
  "transition-colors focus-within:border-pp-400 " +
  "focus-within:shadow-[var(--shadow-glow)]";

export function Input({
  leading,
  trailing,
  mono,
  className,
  ...rest
}: {
  leading?: ReactNode;
  trailing?: ReactNode;
  mono?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn(controlBase, "h-9", className)}>
      {leading && <span className="flex text-ink-500">{leading}</span>}
      <input
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400",
          mono && "font-mono text-[13px]",
        )}
        {...rest}
      />
      {trailing}
    </div>
  );
}

export function Textarea({
  className,
  rows = 3,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "min-h-[72px] resize-y rounded-lg border border-ink-200 bg-white px-3 py-2.5",
        "text-sm leading-relaxed text-ink-900 outline-none transition-colors",
        "placeholder:text-ink-400 focus:border-pp-400 focus:shadow-[var(--shadow-glow)]",
        className,
      )}
      {...rest}
    />
  );
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn(controlBase, "h-9 pr-2", className)}>
      <select
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm text-ink-900 outline-none"
        {...rest}
      >
        {children}
      </select>
      <IcChevD size={14} style={{ color: "var(--color-ink-500)" }} />
    </div>
  );
}

/** Tecla — para mostrar atajos (⌘K). */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <span className="mono rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] text-ink-600">
      {children}
    </span>
  );
}
