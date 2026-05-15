"use client";

import { useActionState, useEffect, useState } from "react";

import { IcPlus } from "@/components/icons";
import { Button, Field, Input, Modal, Textarea } from "@/components/ui";
import {
  crearPortafolio,
  type PortfolioFormState,
} from "@/server/portfolios/actions";

const FORM_ID = "new-portfolio-form";

export function NewPortfolioModal({
  clientId,
  variant = "primary",
}: {
  clientId: string;
  variant?: "primary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<PortfolioFormState, FormData>(
    crearPortafolio,
    {},
  );

  // crearPortafolio no redirige (revalida y devuelve ok) — cerramos al éxito.
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  return (
    <>
      <Button variant={variant} size={variant === "ghost" ? "sm" : "md"} onClick={() => setOpen(true)}>
        <IcPlus size={variant === "ghost" ? 12 : 14} />
        {variant === "ghost" ? "Crear" : "Nuevo portafolio"}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo portafolio"
        description="Agrupa propiedades dentro de este cliente."
        maxWidth={480}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={pending}>
              {pending ? "Creando…" : "Crear portafolio"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="flex flex-col gap-3.5">
          <input type="hidden" name="clientId" value={clientId} />
          <Field label="Nombre *" error={state.fieldErrors?.name}>
            <Input name="name" required autoFocus placeholder="Residencial CDMX" />
          </Field>
          <Field label="Descripción" error={state.fieldErrors?.description}>
            <Textarea
              name="description"
              rows={2}
              placeholder="Qué agrupa este portafolio."
            />
          </Field>
          {state.error && (
            <p className="text-sm font-medium text-bad">{state.error}</p>
          )}
        </form>
      </Modal>
    </>
  );
}
