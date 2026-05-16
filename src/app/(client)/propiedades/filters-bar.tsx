"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { IcChevD } from "@/components/icons";
import { cn } from "@/lib/cn";

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos los tipos" },
  { value: "house", label: "Casa habitación" },
  { value: "apartment", label: "Departamento" },
  { value: "land", label: "Terreno" },
  { value: "commercial_space", label: "Local comercial" },
  { value: "office", label: "Oficina" },
  { value: "warehouse", label: "Bodega" },
  { value: "industrial", label: "Industrial" },
  { value: "other", label: "Otro" },
];

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Cualquier estatus" },
  { value: "active", label: "Activa" },
  { value: "available", label: "Disponible" },
  { value: "rented", label: "Rentada" },
  { value: "for_sale", label: "En venta" },
  { value: "under_construction", label: "En construcción" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "reserved", label: "Reservada" },
  { value: "inactive", label: "Inactiva" },
];

export function FiltersBar({
  ciudades,
  selectedCity,
  selectedType,
  selectedStatus,
}: {
  ciudades: string[];
  selectedCity: string;
  selectedType: string;
  selectedStatus: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: "ciudad" | "tipo" | "estado", value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    const qs = sp.toString();
    startTransition(() => {
      router.push((qs ? `/propiedades?${qs}` : "/propiedades") as never);
    });
  }

  function clearAll() {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("ciudad");
    sp.delete("tipo");
    sp.delete("estado");
    const qs = sp.toString();
    startTransition(() => {
      router.push((qs ? `/propiedades?${qs}` : "/propiedades") as never);
    });
  }

  const hasAny = !!(selectedCity || selectedType || selectedStatus);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 transition-opacity",
        pending && "opacity-60",
      )}
    >
      <FilterSelect
        value={selectedCity}
        onChange={(v) => update("ciudad", v)}
        options={[
          { value: "", label: "Cualquier ciudad" },
          ...ciudades.map((c) => ({ value: c, label: c })),
        ]}
      />
      <FilterSelect
        value={selectedType}
        onChange={(v) => update("tipo", v)}
        options={TYPE_OPTIONS}
      />
      <FilterSelect
        value={selectedStatus}
        onChange={(v) => update("estado", v)}
        options={STATUS_OPTIONS}
      />
      {hasAny && (
        <button
          type="button"
          onClick={clearAll}
          className="mono cursor-pointer px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--fg-muted)] underline underline-offset-[3px] transition-colors hover:text-ink-800"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const active = !!value;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 min-w-[160px] cursor-pointer appearance-none rounded-full border py-1.5 pl-3.5 pr-8 text-[13px] outline-none transition-colors",
          active
            ? "border-pp-300 bg-pp-50 text-pp-700"
            : "border-ink-200 bg-white text-ink-900 hover:border-ink-300",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <IcChevD
        size={12}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </div>
  );
}
