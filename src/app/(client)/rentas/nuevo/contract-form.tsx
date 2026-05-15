"use client";

import { useActionState } from "react";

import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { crearContrato, type LeaseFormState } from "@/server/leases/actions";
import type { RentableOption } from "@/server/leases/rentable-options";

export function ContractForm({
  properties,
  units,
}: {
  properties: RentableOption[];
  units: RentableOption[];
}) {
  const [state, action, pending] = useActionState<LeaseFormState, FormData>(
    crearContrato,
    {},
  );
  const hasTargets = properties.length + units.length > 0;

  if (!hasTargets) {
    return (
      <p className="rounded-xl border border-ink-100 bg-white p-6 text-sm text-ink-600">
        No hay propiedades ni unidades disponibles. Registra una propiedad antes
        de crear un contrato.
      </p>
    );
  }

  return (
    <form
      action={action}
      className="grid gap-4 rounded-xl border border-ink-100 bg-white p-6 sm:grid-cols-2"
    >
      <Field
        label="Propiedad o unidad *"
        error={state.fieldErrors?.target}
        hint="Renta de la propiedad completa, o de una unidad específica."
        full
      >
        <Select name="target" required defaultValue="">
          <option value="" disabled>
            Selecciona…
          </option>
          {properties.length > 0 && (
            <optgroup label="Propiedades completas">
              {properties.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )}
          {units.length > 0 && (
            <optgroup label="Unidades">
              {units.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )}
        </Select>
      </Field>

      <Field label="Inquilino *" error={state.fieldErrors?.tenantName}>
        <Input name="tenantName" required placeholder="Nombre del inquilino" />
      </Field>
      <Field label="Email del inquilino" error={state.fieldErrors?.tenantEmail}>
        <Input name="tenantEmail" type="email" placeholder="inquilino@…" />
      </Field>

      <Field label="Renta mensual (MXN) *" error={state.fieldErrors?.monthlyRentMxn}>
        <Input
          name="monthlyRentMxn"
          type="number"
          min="1"
          step="1"
          required
          placeholder="38000"
        />
      </Field>
      <Field
        label="Día de pago *"
        error={state.fieldErrors?.paymentDay}
        hint="1–31. En meses cortos se cobra el último día."
      >
        <Input
          name="paymentDay"
          type="number"
          min="1"
          max="31"
          required
          defaultValue="1"
        />
      </Field>

      <Field label="Inicio del contrato *" error={state.fieldErrors?.startDate}>
        <Input name="startDate" type="date" required />
      </Field>
      <Field label="Fin del contrato *" error={state.fieldErrors?.endDate}>
        <Input name="endDate" type="date" required />
      </Field>

      <Field
        label="Depósito en garantía (MXN)"
        error={state.fieldErrors?.securityDepositMxn}
      >
        <Input
          name="securityDepositMxn"
          type="number"
          min="0"
          step="1"
          placeholder="76000"
        />
      </Field>

      <Field label="Notas" full>
        <Textarea name="notes" rows={2} placeholder="Observaciones del contrato." />
      </Field>

      <label className="col-span-full flex items-center gap-2.5 text-[13px] text-ink-700">
        <input
          type="checkbox"
          name="activate"
          defaultChecked
          className="h-4 w-4 accent-pp-500"
        />
        Activar el contrato al crearlo (si no, queda como borrador).
      </label>

      {state.error && (
        <p className="col-span-full text-sm font-medium text-bad">
          {state.error}
        </p>
      )}

      <div className="col-span-full flex gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando contrato…" : "Crear contrato"}
        </Button>
      </div>
    </form>
  );
}
