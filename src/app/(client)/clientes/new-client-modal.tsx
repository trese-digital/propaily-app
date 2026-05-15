"use client";

import { useActionState, useState } from "react";

import { IcPlus } from "@/components/icons";
import { Button, Field, Input, Modal, Select, Textarea } from "@/components/ui";
import { crearCliente, type ClientFormState } from "@/server/clients/actions";

const TYPES = [
  { value: "family", label: "Familia / Family office" },
  { value: "individual", label: "Individual" },
  { value: "company", label: "Empresa" },
  { value: "trust", label: "Fideicomiso" },
  { value: "other", label: "Otro" },
];

const FORM_ID = "new-client-form";

export function NewClientModal() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ClientFormState, FormData>(
    crearCliente,
    {},
  );

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)}>
        <IcPlus size={14} />
        Nuevo cliente
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo cliente"
        description="Family office, empresa o persona que GF administra."
        maxWidth={620}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={pending}>
              {pending ? "Creando…" : "Crear cliente"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Nombre *" error={state.fieldErrors?.name} full>
            <Input name="name" required autoFocus placeholder="Familia Mendoza" />
          </Field>
          <Field label="Tipo *" error={state.fieldErrors?.type}>
            <Select name="type" defaultValue="family">
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="RFC" error={state.fieldErrors?.taxId}>
            <Input name="taxId" placeholder="XAXX010101000" />
          </Field>
          <Field label="Email de contacto" error={state.fieldErrors?.primaryEmail}>
            <Input name="primaryEmail" type="email" placeholder="contacto@…" />
          </Field>
          <Field label="Teléfono" error={state.fieldErrors?.phone}>
            <Input name="phone" placeholder="477 123 4567" />
          </Field>
          <Field label="Domicilio fiscal" error={state.fieldErrors?.fiscalAddress} full>
            <Input name="fiscalAddress" placeholder="Calle, número, colonia, CP" />
          </Field>
          <Field label="Contacto administrativo" error={state.fieldErrors?.administrativeContact}>
            <Input name="administrativeContact" placeholder="Nombre · teléfono" />
          </Field>
          <Field label="Contacto legal" error={state.fieldErrors?.legalContact}>
            <Input name="legalContact" placeholder="Nombre · despacho" />
          </Field>
          <Field label="Notas internas" full>
            <Textarea name="internalNotes" rows={3} placeholder="Sólo visible para el equipo." />
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
