"use client";

import { useActionState } from "react";

import {
  crearPropiedad,
  editarPropiedad,
  type PropertyFormState,
} from "@/server/properties/actions";

const PROPERTY_TYPES: Array<{ value: string; label: string }> = [
  { value: "land", label: "Terreno" },
  { value: "house", label: "Casa habitación" },
  { value: "apartment", label: "Departamento" },
  { value: "commercial_space", label: "Local comercial" },
  { value: "office", label: "Oficina" },
  { value: "warehouse", label: "Bodega" },
  { value: "industrial", label: "Industrial" },
  { value: "other", label: "Otro" },
];

const OP_STATUS: Array<{ value: string; label: string }> = [
  { value: "active", label: "Activa" },
  { value: "available", label: "Disponible" },
  { value: "rented", label: "Rentada" },
  { value: "for_sale", label: "En venta" },
  { value: "under_construction", label: "En construcción" },
  { value: "maintenance", label: "En mantenimiento" },
  { value: "reserved", label: "Reservada" },
  { value: "inactive", label: "Inactiva" },
];

const initial: PropertyFormState = {};

export type PortfolioOption = { id: string; label: string };

export type PropertyDefaults = {
  name: string;
  portfolioId: string;
  type: string;
  operationalStatus: string;
  address: string;
  latitude: string;
  longitude: string;
  landAreaSqm: string;
  builtAreaSqm: string;
  fiscalValueMxn: string;
  commercialValueMxn: string;
  insuranceValueMxn: string;
  expectedRentMxn: string;
  internalNotes: string;
  cartoPredioId: string;
  cartoColoniaId: string;
};

export function PropertyForm({
  mode,
  propertyId,
  defaults,
  portfolios,
}: {
  mode: "create" | "edit";
  propertyId?: string;
  defaults: PropertyDefaults;
  portfolios: PortfolioOption[];
}) {
  // Bound action: en edit cierra el propertyId
  const action =
    mode === "edit" && propertyId
      ? editarPropiedad.bind(null, propertyId)
      : crearPropiedad;

  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="bg-white border border-black/8 rounded-xl p-7 space-y-5">
      <input type="hidden" name="cartoPredioId" value={defaults.cartoPredioId} />
      <input type="hidden" name="cartoColoniaId" value={defaults.cartoColoniaId} />

      <Field label="Nombre *" error={state.fieldErrors?.name}>
        <input
          name="name"
          required
          defaultValue={defaults.name}
          className="input"
          autoFocus
        />
      </Field>

      <Field label="Portafolio *" error={state.fieldErrors?.portfolioId}>
        {portfolios.length > 0 ? (
          <select
            name="portfolioId"
            required
            defaultValue={defaults.portfolioId}
            className="input"
          >
            {!defaults.portfolioId && (
              <option value="" disabled>
                Selecciona un portafolio…
              </option>
            )}
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-slate text-sm">
            No hay portafolios disponibles. Crea un cliente y un portafolio
            antes de registrar propiedades.
          </p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo *" error={state.fieldErrors?.type}>
          <select name="type" required defaultValue={defaults.type || "land"} className="input">
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado operativo" error={state.fieldErrors?.operationalStatus}>
          <select
            name="operationalStatus"
            defaultValue={defaults.operationalStatus || "active"}
            className="input"
          >
            {OP_STATUS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Dirección" error={state.fieldErrors?.address}>
        <input
          name="address"
          defaultValue={defaults.address}
          placeholder="Calle, número, colonia"
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitud" error={state.fieldErrors?.latitude}>
          <input
            name="latitude"
            type="number"
            step="0.0000001"
            defaultValue={defaults.latitude}
            placeholder="21.1234567"
            className="input"
          />
        </Field>
        <Field label="Longitud" error={state.fieldErrors?.longitude}>
          <input
            name="longitude"
            type="number"
            step="0.0000001"
            defaultValue={defaults.longitude}
            placeholder="-101.6789012"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Superficie de terreno (m²)" error={state.fieldErrors?.landAreaSqm}>
          <input
            name="landAreaSqm"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaults.landAreaSqm}
            className="input"
          />
        </Field>
        <Field label="Superficie construida (m²)" error={state.fieldErrors?.builtAreaSqm}>
          <input
            name="builtAreaSqm"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaults.builtAreaSqm}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Valor fiscal (MXN)" error={state.fieldErrors?.fiscalValueMxn}>
          <input
            name="fiscalValueMxn"
            type="number"
            step="1"
            min="0"
            defaultValue={defaults.fiscalValueMxn}
            placeholder="0"
            className="input"
          />
        </Field>
        <Field label="Valor comercial (MXN)" error={state.fieldErrors?.commercialValueMxn}>
          <input
            name="commercialValueMxn"
            type="number"
            step="1"
            min="0"
            defaultValue={defaults.commercialValueMxn}
            placeholder="0"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Valor de seguro (MXN)" error={state.fieldErrors?.insuranceValueMxn}>
          <input
            name="insuranceValueMxn"
            type="number"
            step="1"
            min="0"
            defaultValue={defaults.insuranceValueMxn}
            placeholder="0"
            className="input"
          />
        </Field>
        <Field label="Renta esperada / mes (MXN)" error={state.fieldErrors?.expectedRentMxn}>
          <input
            name="expectedRentMxn"
            type="number"
            step="1"
            min="0"
            defaultValue={defaults.expectedRentMxn}
            placeholder="0"
            className="input"
          />
        </Field>
      </div>

      <Field label="Notas internas">
        <textarea
          name="internalNotes"
          rows={3}
          defaultValue={defaults.internalNotes}
          className="input resize-y min-h-[80px]"
        />
      </Field>

      {state.error ? <p className="text-magenta font-medium text-sm">{state.error}</p> : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-teal text-navy px-5 py-3 rounded-md text-sm font-semibold border border-teal hover:bg-teal-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending
            ? mode === "edit"
              ? "Guardando…"
              : "Creando…"
            : mode === "edit"
              ? "Guardar cambios"
              : "Crear propiedad"}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(7, 11, 31, 0.2);
          border-radius: 6px;
          background: #FFFFFF;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--color-navy);
          outline: none;
          transition: border-color 0.12s, box-shadow 0.12s;
        }
        .input:focus {
          border-color: var(--color-navy);
          box-shadow: 0 0 0 3px rgba(7, 11, 31, 0.08);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] text-slate tracking-wider uppercase">{label}</span>
      {children}
      {error ? <span className="text-magenta text-xs">{error}</span> : null}
    </label>
  );
}
