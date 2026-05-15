"use client";

/** Modal — diálogo centrado con backdrop. Cierra con Esc o clic en backdrop. */
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { IcX } from "@/components/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "./button";

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  maxWidth = 560,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(14,10,22,0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <div
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white"
        style={{ maxWidth, boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start gap-3 border-b border-ink-100 px-5 py-4">
            <div className="flex-1">
              {title && (
                <h2 className="text-lg font-semibold tracking-[-0.01em]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-[13px] text-ink-500">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <IcX size={14} />
            </IconButton>
          </div>
        )}
        <div className={cn("overflow-y-auto p-5")}>{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 bg-[var(--bg-subtle)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
