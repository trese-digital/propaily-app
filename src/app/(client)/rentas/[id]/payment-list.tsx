"use client";

import { useTransition } from "react";

import { Badge, type BadgeTone, Button } from "@/components/ui";
import { registrarPago, revertirPago } from "@/server/rent-payments/actions";

export type PaymentItem = {
  id: string;
  periodLabel: string;
  dueLabel: string;
  amountLabel: string;
  status: string;
  /** pendiente con vencimiento ya pasado */
  isOverdue: boolean;
};

const STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pendiente", tone: "neutral" },
  proof_uploaded: { label: "Comprobante", tone: "info" },
  confirmed: { label: "Pagado", tone: "ok" },
  overdue: { label: "Vencido", tone: "bad" },
  cancelled: { label: "Cancelado", tone: "neutral" },
};

export function PaymentList({ payments }: { payments: PaymentItem[] }) {
  const [pending, start] = useTransition();

  if (payments.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-ink-500">
        Este contrato no tiene pagos en el calendario.
      </p>
    );
  }

  return (
    <ul>
      {payments.map((p) => {
        const st = STATUS[p.status] ?? STATUS.pending;
        const tone: BadgeTone =
          p.status === "pending" && p.isOverdue ? "bad" : st.tone;
        const label =
          p.status === "pending" && p.isOverdue ? "Vencido" : st.label;
        return (
          <li
            key={p.id}
            className="flex items-center gap-3 border-t border-ink-100 px-4 py-3 first:border-t-0"
          >
            <div className="w-28">
              <div className="text-[13px] font-medium text-ink-900">
                {p.periodLabel}
              </div>
              <div className="mono text-[11px] text-ink-500">
                vence {p.dueLabel}
              </div>
            </div>
            <div className="mono num flex-1 text-[13px] font-semibold text-ink-900">
              {p.amountLabel}
            </div>
            <Badge tone={tone}>{label}</Badge>
            <div className="w-32 text-right">
              {p.status === "cancelled" ? null : p.status === "confirmed" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => start(() => void revertirPago(p.id))}
                >
                  Revertir
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pending}
                  onClick={() => start(() => void registrarPago(p.id))}
                >
                  Registrar pago
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
