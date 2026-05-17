"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  crearUnidad,
  editarUnidad,
  eliminarUnidad,
  type UnitFormState,
} from "@/server/units/actions";
import { Button, Card, CardHeader, CardBody, Badge } from "@/components/ui";

const UNIT_TYPES: Array<{ value: string; label: string }> = [
  { value: "apartment", label: "Departamento" },
  { value: "commercial_space", label: "Local" },
  { value: "office", label: "Oficina" },
  { value: "warehouse", label: "Bodega" },
  { value: "room", label: "Cuarto" },
  { value: "other", label: "Otro" },
];

export type UnitRow = {
  id: string;
  name: string;
  type: string;
  areaSqm: string | null;
  monthlyRentCents: bigint | null;
  currentTenantName: string | null;
  operationalStatus: string;
  internalNotes: string | null;
};

const initial: UnitFormState = {};

function fmtMoneyCents(c: bigint | null) {
  if (c == null) return "—";
  return (Number(c) / 100).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export function UnitsSection({
  propertyId,
  units,
}: {
  propertyId: string;
  units: UnitRow[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [state, action, pending] = useActionState(crearUnidad, initial);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.ts) formRef.current?.reset();
  }, [state.ts, state.ok]);

  function onDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    startTransition(async () => {
      const r = await eliminarUnidad(id);
      if (r.error) alert(r.error);
    });
  }

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            Unidades{" "}
            <span className="mono text-sm text-ink-500">({units.length})</span>
          </div>
        }
        action={
          !showForm ? (
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => setShowForm(true)}
            >
              + Nueva unidad
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cerrar
            </Button>
          )
        }
      />
      <CardBody>

      {showForm ? (
        <form
          ref={formRef}
          action={action}
          className="space-y-4 mb-6 pb-6 border-b border-black/8"
        >
          <input type="hidden" name="propertyId" value={propertyId} />
          <UnitFields />

          {state.error ? <p className="text-magenta text-sm font-medium">{state.error}</p> : null}
          {state.ok && state.ts ? (
            <p className="text-teal-deep text-sm font-medium">
              ✓ Unidad creada. Puedes crear otra o cerrar.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="bg-teal text-navy px-5 py-2.5 rounded-md text-sm font-semibold border border-teal hover:bg-teal-bright transition-colors disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Crear unidad"}
          </button>

          <UnitStyles />
        </form>
      ) : null}

      {units.length === 0 ? (
        <p className="text-slate text-sm text-center py-6">
          Sin unidades. Útil cuando la propiedad tiene varios departamentos, locales u oficinas
          rentables por separado.
        </p>
      ) : (
        <ul className="divide-y divide-black/8">
          {units.map((u) => (
            <UnitItem
              key={u.id}
              unit={u}
              editing={editingId === u.id}
              onEdit={() => setEditingId(u.id)}
              onCancel={() => setEditingId(null)}
              onSaved={() => setEditingId(null)}
              onDelete={() => onDelete(u.id, u.name)}
            />
          ))}
        </ul>
      )}
      </CardBody>
    </Card>
  );
}

function UnitItem({
  unit,
  editing,
  onEdit,
  onCancel,
  onSaved,
  onDelete,
}: {
  unit: UnitRow;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const action = editarUnidad.bind(null, unit.id);
  const [state, formAction, pending] = useActionState(action, initial);

  useEffect(() => {
    if (state.ok && state.ts) onSaved();
  }, [state.ts, state.ok, onSaved]);

  if (editing) {
    return (
      <li className="py-4 px-3 bg-paper-2 border border-teal/40 rounded-md my-2">
        <form action={formAction} className="space-y-3">
          <UnitFields
            defaults={{
              name: unit.name,
              type: unit.type,
              areaSqm: unit.areaSqm ?? "",
              monthlyRentMxn:
                unit.monthlyRentCents != null ? String(Number(unit.monthlyRentCents) / 100) : "",
              currentTenantName: unit.currentTenantName ?? "",
              internalNotes: unit.internalNotes ?? "",
            }}
          />
          {state.error ? <p className="text-magenta text-xs">{state.error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-teal text-navy text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-teal-bright disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate text-xs hover:text-navy px-2 py-1.5"
            >
              Cancelar
            </button>
          </div>
          <UnitStyles />
        </form>
      </li>
    );
  }

  const label = UNIT_TYPES.find((t) => t.value === unit.type)?.label ?? unit.type;
  return (
    <li className="flex items-center gap-4 py-3 hover:bg-paper-2 -mx-2 px-2 rounded-md transition-colors">
      <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-navy text-white shrink-0 w-[110px] text-center">
        {label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-navy text-sm">{unit.name}</p>
        <p className="font-mono text-[11px] text-slate">
          {unit.areaSqm ? `${Number(unit.areaSqm).toLocaleString("es-MX")} m²` : "—"}
          {unit.currentTenantName ? ` · ${unit.currentTenantName}` : ""}
        </p>
      </div>
      <span className="font-mono text-sm text-navy">
        {fmtMoneyCents(unit.monthlyRentCents)}
        <span className="text-slate text-[10px] ml-1">/ mes</span>
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="text-slate hover:text-navy text-sm transition-colors"
        title="Editar"
      >
        ✎
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-slate hover:text-magenta text-sm transition-colors"
        title="Eliminar"
      >
        ✕
      </button>
    </li>
  );
}

type UnitFieldDefaults = {
  name: string;
  type: string;
  areaSqm: string;
  monthlyRentMxn: string;
  currentTenantName: string;
  internalNotes: string;
};

function UnitFields({ defaults }: { defaults?: UnitFieldDefaults }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre / etiqueta *">
          <input
            name="name"
            required
            autoFocus
            defaultValue={defaults?.name ?? ""}
            placeholder="Ej. Depto 101, Local A"
            className="u-input"
          />
        </Field>
        <Field label="Tipo *">
          <select
            name="type"
            required
            defaultValue={defaults?.type ?? "apartment"}
            className="u-input"
          >
            {UNIT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Superficie (m²)">
          <input
            name="areaSqm"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaults?.areaSqm ?? ""}
            className="u-input"
          />
        </Field>
        <Field label="Renta mensual (MXN)">
          <input
            name="monthlyRentMxn"
            type="number"
            step="1"
            min="0"
            defaultValue={defaults?.monthlyRentMxn ?? ""}
            placeholder="0"
            className="u-input"
          />
        </Field>
      </div>

      <Field label="Inquilino actual">
        <input
          name="currentTenantName"
          defaultValue={defaults?.currentTenantName ?? ""}
          placeholder="Nombre del inquilino (opcional)"
          className="u-input"
        />
      </Field>

      <Field label="Notas">
        <textarea
          name="internalNotes"
          rows={2}
          defaultValue={defaults?.internalNotes ?? ""}
          className="u-input resize-y min-h-[60px]"
        />
      </Field>
    </>
  );
}

function UnitStyles() {
  return (
    <style>{`
      .u-input {
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
      .u-input:focus {
        border-color: var(--color-navy);
        box-shadow: 0 0 0 3px rgba(7, 11, 31, 0.08);
      }
    `}</style>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] text-slate tracking-wider uppercase">{label}</span>
      {children}
    </label>
  );
}
