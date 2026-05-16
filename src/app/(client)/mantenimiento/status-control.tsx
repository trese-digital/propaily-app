"use client";

import { useState, useTransition } from "react";

import { cambiarEstadoMantenimiento } from "@/server/maintenance/actions";

const OPTIONS: { value: string; label: string }[] = [
  { value: "new", label: "Nueva" },
  { value: "under_review", label: "En revisión" },
  { value: "assigned", label: "Asignada" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

export function StatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label="Cambiar estado"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          setError(null);
          startTransition(async () => {
            const res = await cambiarEstadoMantenimiento(id, next);
            if (res.error) setError(res.error);
          });
        }}
        className="h-8 w-full rounded-md border border-ink-200 bg-[var(--bg-subtle)] px-2 text-[12px] text-ink-800 outline-none transition-colors focus:border-pp-400 disabled:opacity-50"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            Mover a: {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-bad">{error}</span>}
    </div>
  );
}
