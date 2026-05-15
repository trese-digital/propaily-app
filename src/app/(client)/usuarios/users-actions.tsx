"use client";

import { useActionState, useState, useTransition } from "react";
import type { Role } from "@prisma/client";

import { IcPlus } from "@/components/icons";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import {
  cambiarEstadoUsuario,
  cambiarRol,
  invitarUsuario,
  type InviteFormState,
} from "@/server/users/actions";

export type UserScope = "gf" | "client";

const ROLE_OPTIONS: Record<UserScope, { value: Role; label: string }[]> = {
  client: [
    { value: "owner", label: "Administrador" },
    { value: "guest", label: "Sólo lectura" },
  ],
  gf: [
    { value: "company_admin", label: "Administrador GF" },
    { value: "company_operator", label: "Operador GF" },
  ],
};

const FORM_ID = "invite-user-form";

/** Botón + modal para invitar un usuario nuevo. */
export function InviteUserButton({ scope }: { scope: UserScope }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<InviteFormState, FormData>(
    invitarUsuario,
    {},
  );

  // Cierra el modal en la transición a éxito (patrón "valor previo").
  const [prevOk, setPrevOk] = useState(false);
  if ((state.ok ?? false) !== prevOk) {
    setPrevOk(state.ok ?? false);
    if (state.ok) setOpen(false);
  }

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)}>
        <IcPlus size={14} />
        Invitar usuario
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invitar usuario"
        description="Se le enviará un correo con el enlace de acceso a Propaily."
        maxWidth={480}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={pending}>
              {pending ? "Enviando…" : "Enviar invitación"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="grid gap-3.5">
          <Field label="Nombre *" error={state.fieldErrors?.name} full>
            <Input name="name" required autoFocus placeholder="Nombre y apellido" />
          </Field>
          <Field label="Email *" error={state.fieldErrors?.email} full>
            <Input name="email" type="email" required placeholder="persona@correo.com" />
          </Field>
          <Field label="Rol *" error={state.fieldErrors?.role} full>
            <Select name="role" defaultValue={ROLE_OPTIONS[scope][0].value}>
              {ROLE_OPTIONS[scope].map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </Field>
          {state.error && (
            <p className="text-sm font-medium text-bad">{state.error}</p>
          )}
        </form>
      </Modal>
    </>
  );
}

/**
 * Controles por fila: selector de rol + suspender/reactivar.
 * Si el rol del miembro no es asignable desde este alcance (p. ej. un
 * `super_admin` o un `tenant`), el rol se muestra fijo.
 */
export function MemberActions({
  membershipId,
  currentRole,
  currentRoleLabel,
  scope,
  suspended,
  isSelf,
}: {
  membershipId: string;
  currentRole: Role;
  currentRoleLabel: string;
  scope: UserScope;
  suspended: boolean;
  isSelf: boolean;
}) {
  const [pending, start] = useTransition();
  const options = ROLE_OPTIONS[scope];
  const editable = options.some((o) => o.value === currentRole);

  if (isSelf) {
    return (
      <span className="mono text-[11px] uppercase tracking-[0.06em] text-ink-400">
        Tú
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {editable ? (
        <Select
          defaultValue={currentRole}
          disabled={pending}
          aria-label="Rol del usuario"
          className="h-8 w-[150px]"
          onChange={(e) => {
            const next = e.target.value as Role;
            if (next !== currentRole) {
              start(() => void cambiarRol(membershipId, next));
            }
          }}
        >
          {options.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      ) : (
        <span className="text-[13px] text-ink-500">{currentRoleLabel}</span>
      )}
      <Button
        size="sm"
        variant={suspended ? "secondary" : "danger"}
        disabled={pending}
        onClick={() =>
          start(() => void cambiarEstadoUsuario(membershipId, !suspended))
        }
      >
        {suspended ? "Reactivar" : "Suspender"}
      </Button>
    </div>
  );
}
