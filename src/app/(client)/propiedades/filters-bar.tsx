"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
        opacity: pending ? 0.6 : 1,
        transition: "opacity var(--dur-fast) var(--ease)",
      }}
    >
      <Select
        value={selectedCity}
        onChange={(v) => update("ciudad", v)}
        options={[{ value: "", label: "Cualquier ciudad" }, ...ciudades.map((c) => ({ value: c, label: c }))]}
      />
      <Select value={selectedType} onChange={(v) => update("tipo", v)} options={TYPE_OPTIONS} />
      <Select value={selectedStatus} onChange={(v) => update("estado", v)} options={STATUS_OPTIONS} />
      {hasAny && (
        <button
          type="button"
          onClick={clearAll}
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--fg-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

function Select({
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: active ? "var(--accent-soft)" : "var(--bg)",
        border: `1px solid ${active ? "var(--color-pp-300)" : "var(--border)"}`,
        color: active ? "var(--color-pp-700)" : "var(--fg)",
        borderRadius: 999,
        fontSize: 13,
        padding: "6px 14px",
        height: 32,
        cursor: "pointer",
        minWidth: 160,
        fontFamily: "var(--font-sans)",
        outline: "none",
        appearance: "none",
        paddingRight: 30,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12' fill='none' stroke='%239890ac' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
