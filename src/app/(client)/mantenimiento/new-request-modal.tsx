"use client";

import { useActionState, useEffect, useState } from "react";

import { IcPlus } from "@/components/icons";
import { Button, Field, Input, Modal, Select, Textarea } from "@/components/ui";
import {
  crearSolicitudMantenimiento,
  type MaintenanceFormState,
} from "@/server/maintenance/actions";

const CATEGORIES = [
  { value: "plumbing", label: "Plomería" },
  { value: "electrical", label: "Eléctrico" },
  { value: "painting", label: "Pintura" },
  { value: "carpentry", label: "Carpintería" },
  { value: "cleaning", label: "Limpieza" },
  { value: "gardening", label: "Jardinería" },
  { value: "structural", label: "Estructural" },
  { value: "other", label: "Otro" },
];

const PRIORITIES = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const FORM_ID = "new-maintenance-form";

export function NewRequestModal({
  properties,
}: {
  properties: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<
    MaintenanceFormState,
    FormData
  >(crearSolicitudMantenimiento, {});

  // Al crear con éxito, cierra el modal. El revalidatePath del action refresca
  // el tablero.
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  const noProperties = properties.length === 0;

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)} disabled={noProperties}>
        <IcPlus size={14} />
        Nueva solicitud
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nueva solicitud de mantenimiento"
        description="Sobre una propiedad del portafolio."
        maxWidth={620}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={pending}>
              {pending ? "Creando…" : "Crear solicitud"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="grid gap-3.5 sm:grid-cols-2">
          <Field
            label="Propiedad *"
            error={state.fieldErrors?.propertyId}
            full
          >
            <Select name="propertyId" defaultValue="" required>
              <option value="" disabled>
                Selecciona una propiedad…
              </option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Título *" error={state.fieldErrors?.title} full>
            <Input
              name="title"
              required
              autoFocus
              placeholder="Fuga en baño de planta baja"
            />
          </Field>
          <Field label="Categoría *" error={state.fieldErrors?.category}>
            <Select name="category" defaultValue="other">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Prioridad *" error={state.fieldErrors?.priority}>
            <Select name="priority" defaultValue="medium">
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Costo estimado (MXN)"
            error={state.fieldErrors?.estimatedCostMxn}
            full
          >
            <Input
              name="estimatedCostMxn"
              type="number"
              min="0"
              step="any"
              placeholder="Opcional"
            />
          </Field>
          <Field label="Descripción *" error={state.fieldErrors?.description} full>
            <Textarea
              name="description"
              rows={3}
              required
              placeholder="Detalle del problema, ubicación exacta, urgencia…"
            />
          </Field>
          {state.error && (
            <p className="col-span-full text-sm font-medium text-bad">
              {state.error}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
}
