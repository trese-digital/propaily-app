"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui";
import { cancelarContrato } from "@/server/leases/actions";

export function CancelContractButton({
  leaseId,
  disabled,
}: {
  leaseId: string;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();
  if (disabled) return null;
  return (
    <Button
      variant="danger"
      size="md"
      disabled={pending}
      onClick={() => {
        if (
          confirm(
            "¿Cancelar este contrato? Los pagos futuros pendientes se cancelarán; el histórico se conserva.",
          )
        ) {
          start(() => void cancelarContrato(leaseId));
        }
      }}
    >
      {pending ? "Cancelando…" : "Cancelar contrato"}
    </Button>
  );
}
