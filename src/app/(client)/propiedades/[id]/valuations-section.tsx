"use client";

import { useActionState, useState, useTransition } from "react";

import { IcChart, IcPlus } from "@/components/icons";
import { Badge, type BadgeTone, Button, Field, Modal, Textarea, Card, CardHeader, CardBody } from "@/components/ui";
import {
  cancelarSolicitud,
  solicitarValuacion,
  type ValuationRequestState,
} from "@/server/valuations/actions";

export type ValuationItem = {
  id: string;
  typeLabel: string;
  valueLabel: string;
  dateLabel: string;
  source: string | null;
  isOfficial: boolean;
};

export type OpenRequest = {
  id: string;
  statusLabel: string;
  tone: BadgeTone;
  createdLabel: string;
  cancelable: boolean;
};

const FORM_ID = "valuation-request-form";

export function ValuationsSection({
  propertyId,
  valuations,
  openRequest,
}: {
  propertyId: string;
  valuations: ValuationItem[];
  openRequest: OpenRequest | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startCancel] = useTransition();
  const [state, action, submitting] = useActionState<ValuationRequestState, FormData>(
    solicitarValuacion,
    {},
  );

  // Cierra el modal en la transición a éxito (patrón "valor previo": evita
  // que un `state.ok` pegajoso impida reabrir el modal después).
  const [prevOk, setPrevOk] = useState(false);
  if ((state.ok ?? false) !== prevOk) {
    setPrevOk(state.ok ?? false);
    if (state.ok) setOpen(false);
  }

  return (
    <Card>
      <CardHeader
        title="Valuaciones"
        action={
          !openRequest ? (
            <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
              <IcPlus size={13} />
              Solicitar actualización
            </Button>
          ) : (
            <span className="text-xs text-ink-500">Histórico de avalúos GF · append-only</span>
          )
        }
      />
      <CardBody className="flex flex-col gap-3.5">
        {openRequest && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-pp-50 border border-pp-100">
            <Badge tone={openRequest.tone}>{openRequest.statusLabel}</Badge>
            <span className="flex-1 text-sm text-pp-700">
              Solicitud enviada el {openRequest.createdLabel}. El equipo de GF la atenderá.
            </span>
            {openRequest.cancelable && (
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  if (confirm("¿Cancelar la solicitud de valuación?")) {
                    startCancel(() => void cancelarSolicitud(openRequest.id));
                  }
                }}
              >
                {pending ? "Cancelando…" : "Cancelar"}
              </Button>
            )}
          </div>
        )}

        {valuations.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "22px 0",
              textAlign: "center",
            }}
          >
            <IcChart size={22} />
            <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)" }}>
              Sin valuaciones registradas. GF cargará el avalúo inicial.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            {valuations.map((v, i) => (
              <li
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ font: "500 13px var(--font-sans)", color: "var(--fg)" }}>
                      {v.typeLabel}
                    </span>
                    {v.isOfficial && <Badge tone="violet">Oficial</Badge>}
                    {i === 0 && <Badge tone="ok">Vigente</Badge>}
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-muted)" }}>
                    {v.dateLabel}
                    {v.source ? ` · ${v.source}` : ""}
                  </span>
                </div>
                <span
                  className="num"
                  style={{ font: "600 15px var(--font-sans)", color: "var(--fg)" }}
                >
                  {v.valueLabel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Solicitar actualización de valuación"
        description="El equipo de GF realizará el avalúo y cargará el nuevo valor."
        maxWidth={520}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} size="md" disabled={submitting}>
              {submitting ? "Enviando…" : "Enviar solicitud"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} action={action} className="grid gap-3.5">
          <input type="hidden" name="propertyId" value={propertyId} />
          <Field label="Motivo o contexto (opcional)" error={state.fieldErrors?.notes} full>
            <Textarea
              name="notes"
              rows={4}
              placeholder="Ej. actualización anual, remodelación reciente, cambio de uso de suelo…"
            />
          </Field>
          {state.error && (
            <p className="text-sm font-medium text-bad">{state.error}</p>
          )}
        </form>
      </Modal>
    </Card>
  );
}
