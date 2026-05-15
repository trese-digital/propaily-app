"use client";

import { useActionState, useState, useTransition } from "react";

import { Button, Field, Input, Modal, Select, Textarea } from "@/components/ui";
import {
  completarSolicitud,
  registrarValuacion,
  tomarSolicitud,
  type ValuationFormState,
} from "@/server/valuations/admin-actions";

export type PropertyOption = {
  id: string;
  name: string;
  clientName: string;
};

const VALUATION_TYPES = [
  { value: "professional", label: "Profesional GF" },
  { value: "commercial", label: "Comercial" },
  { value: "fiscal", label: "Fiscal" },
  { value: "insurance", label: "Seguro" },
  { value: "manual", label: "Manual" },
];

const FORM_ID = "register-valuation-form";

/** Toma una solicitud: pending → in_progress. */
export function TakeButton({ requestId }: { requestId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={pending}
      onClick={() => start(() => void tomarSolicitud(requestId))}
    >
      {pending ? "…" : "Tomar"}
    </Button>
  );
}

/** Cierra una solicitud sin registrar valuación (pide una nota de respuesta). */
export function CompleteButton({ requestId }: { requestId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        const response = prompt(
          "Nota de cierre para esta solicitud (visible para el cliente):",
        );
        if (response != null) {
          start(() => void completarSolicitud(requestId, response));
        }
      }}
    >
      {pending ? "…" : "Cerrar"}
    </Button>
  );
}

/**
 * Modal para registrar una `Valuation`. Dos modos:
 *  - con `preset` → la propiedad viene fija (desde una solicitud de la cola),
 *  - sin `preset` → selector de propiedad (alta directa, p. ej. actualización anual).
 */
export function RegisterValuationButton({
  properties,
  preset,
  label = "Registrar valuación",
  variant = "primary",
  size = "md",
}: {
  properties: PropertyOption[];
  preset?: { propertyId: string; propertyName: string; requestId?: string };
  label?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ValuationFormState, FormData>(
    registrarValuacion,
    {},
  );

  // Cierra el modal en la transición a éxito (patrón "valor previo").
  const [prevOk, setPrevOk] = useState(false);
  if ((state.ok ?? false) !== prevOk) {
    setPrevOk(state.ok ?? false);
    if (state.ok) setOpen(false);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Button size={size} variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Registrar valuación"
        description="El avalúo se agrega al histórico (append-only) y actualiza el valor de la propiedad."
        maxWidth={560}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={pending}>
              {pending ? "Guardando…" : "Guardar valuación"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="grid gap-3.5 sm:grid-cols-2">
          {preset?.requestId && (
            <input type="hidden" name="requestId" value={preset.requestId} />
          )}
          {preset ? (
            <>
              <input type="hidden" name="propertyId" value={preset.propertyId} />
              <Field label="Propiedad" full>
                <Input value={preset.propertyName} readOnly disabled />
              </Field>
            </>
          ) : (
            <Field label="Propiedad *" error={state.fieldErrors?.propertyId} full>
              <Select name="propertyId" defaultValue="" required>
                <option value="" disabled>
                  Selecciona una propiedad…
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.clientName}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Tipo *" error={state.fieldErrors?.type}>
            <Select name="type" defaultValue="professional">
              {VALUATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Valor (MXN) *" error={state.fieldErrors?.valueMxn}>
            <Input
              name="valueMxn"
              type="number"
              min="1"
              step="1"
              required
              placeholder="3500000"
            />
          </Field>
          <Field label="Fecha del avalúo *" error={state.fieldErrors?.valuationDate}>
            <Input name="valuationDate" type="date" defaultValue={today} required />
          </Field>
          <Field label="Fuente" error={state.fieldErrors?.source}>
            <Input name="source" placeholder="GF Consultoría" />
          </Field>
          <Field label="Notas" error={state.fieldErrors?.notes} full>
            <Textarea name="notes" rows={3} placeholder="Metodología, supuestos, observaciones…" />
          </Field>
          <label className="col-span-full flex items-center gap-2 text-[13px] text-ink-700">
            <input type="checkbox" name="isOfficial" defaultChecked className="accent-pp-500" />
            Marcar como valuación oficial
          </label>
          {state.error && (
            <p className="col-span-full text-sm font-medium text-bad">{state.error}</p>
          )}
        </form>
      </Modal>
    </>
  );
}
