/**
 * Chip — pill compacta para etiquetas y selección. Variante `active` y
 * opción removible. Plain component; el `onRemove` lo pasa un Client Component.
 */
import type { ReactNode } from "react";

import { IcX } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Chip({
  active = false,
  onRemove,
  className,
  children,
}: {
  active?: boolean;
  onRemove?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-xs font-medium",
        active
          ? "bg-pp-500 text-white"
          : "border border-ink-200 bg-ink-50 text-ink-700",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar"
          className="-mr-1 flex cursor-pointer items-center rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <IcX size={12} />
        </button>
      )}
    </span>
  );
}
