"use client";

import React, { useActionState } from "react";

import {
  crearComparable,
  type ComparableFormState,
} from "@/server/comparables/admin-actions";
import { LocationPicker } from "@/components/maps/LocationPicker";

const COMPARABLE_TIPOS = [
  { value: "avaluo", label: "Avalúo" },
  { value: "pagina_web", label: "Página Web" },
  { value: "portal_inmobiliario", label: "Portal Inmobiliario" },
  { value: "valuacion_propaily", label: "Valuación Propaily" },
  { value: "otro", label: "Otro" },
];

const PROPERTY_TYPES = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Departamento" },
  { value: "land", label: "Terreno" },
  { value: "commercial_space", label: "Local Comercial" },
  { value: "office", label: "Oficina" },
  { value: "warehouse", label: "Bodega" },
  { value: "industrial", label: "Industrial" },
  { value: "other", label: "Otro" },
];

export function ComparableForm() {
  const [state, action, isPending] = useActionState<ComparableFormState, FormData>(
    crearComparable,
    {}
  );

  // Reset form after successful submission
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state.error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.ok && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">Comparable creado correctamente</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Valor (MXN) *
          </label>
          <input
            type="number"
            name="valueMxn"
            step="0.01"
            min="1"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.valueMxn ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          />
          {state.fieldErrors?.valueMxn && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.valueMxn}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Fecha *
          </label>
          <input
            type="date"
            name="comparableDate"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.comparableDate ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          />
          {state.fieldErrors?.comparableDate && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.comparableDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Tipo de Fuente *
          </label>
          <select
            name="tipo"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.tipo ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          >
            <option value="">Seleccionar</option>
            {COMPARABLE_TIPOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.tipo && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.tipo}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Tipo de Inmueble *
          </label>
          <select
            name="propertyType"
            required
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.propertyType ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          >
            <option value="">Seleccionar</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.propertyType && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.propertyType}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            m² Terreno
          </label>
          <input
            type="number"
            name="landAreaSqm"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.landAreaSqm ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            m² Construcción
          </label>
          <input
            type="number"
            name="builtAreaSqm"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ borderColor: state.fieldErrors?.builtAreaSqm ? '#ef4444' : 'rgba(7,11,31,0.2)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Antigüedad (años)
          </label>
          <input
            type="number"
            name="ageYears"
            min="0"
            max="200"
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Uso de Suelo
          </label>
          <input
            type="text"
            name="usoSuelo"
            maxLength={100}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-carbon mb-1">
          Dirección
        </label>
        <input
          id="comparable-address"
          type="text"
          name="address"
          maxLength={500}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-carbon mb-1">
          Ubicación en Mapa
        </label>
        <p className="text-xs text-slate mb-2">
          Arrastra el pin o busca la dirección para geo-localizar el comparable
        </p>
        <LocationPicker
          initialLat=""
          initialLng=""
          addressFieldId="comparable-address"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Fuente
          </label>
          <input
            type="text"
            name="source"
            maxLength={200}
            placeholder="Banco, portal, perito, etc."
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-carbon mb-1">
            Override Colonia (UUID)
          </label>
          <input
            type="text"
            name="coloniaIdManual"
            pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
            placeholder="Manual override"
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-carbon mb-1">
          Notas
        </label>
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ borderColor: 'rgba(7,11,31,0.2)' }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Guardando..." : "Crear Comparable"}
      </button>
    </form>
  );
}