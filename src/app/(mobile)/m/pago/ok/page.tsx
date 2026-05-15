/** 14 · Comprobante enviado · confirmación (MFlowComprobOk del handoff). */
import Link from "next/link";

import { IcCheck } from "@/components/icons";
import { Badge, MSpeiRow } from "@/components/mobile/ui";
import { receipt } from "@/features/mobile/demo-data";

export const metadata = { title: "Pago enviado · Propaily" };

export default function ReceiptOkScreen() {
  const r = receipt;
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero éxito */}
      <div
        style={{
          paddingTop: "calc(var(--m-safe-top) + 26px)",
          paddingBottom: 32,
          background: "linear-gradient(180deg, #ECFDF5 0%, var(--bg-muted) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 32px rgba(16,185,129,0.32)",
          }}
        >
          <IcCheck size={42} style={{ color: "#fff" }} />
        </div>
        <h1
          style={{
            margin: "20px 0 6px",
            font: "600 24px var(--font-sans)",
            letterSpacing: "-0.02em",
            color: "var(--ink-900)",
          }}
        >
          ¡Listo! Pago enviado
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--ink-500)",
            textAlign: "center",
            maxWidth: 290,
            lineHeight: 1.5,
          }}
        >
          Tu administrador recibirá la confirmación y te avisaremos cuando la
          concilien.
        </p>
      </div>

      {/* Recibo */}
      <div style={{ padding: "0 18px", marginTop: -12 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--ink-100)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--ink-100)",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--ink-500)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Folio · {r.folio}
            </span>
            <Badge tone="ok">En revisión</Badge>
          </div>
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <MSpeiRow label="Monto" value={r.amount} mono />
            <MSpeiRow label="Concepto" value={r.concept} />
            <MSpeiRow label="Referencia" value={r.reference} mono accent />
            <MSpeiRow label="Pagado el" value={r.paidAt} />
            <MSpeiRow label="Confirmación" value={r.eta} />
          </div>
        </div>
      </div>

      {/* Qué sigue */}
      <div style={{ padding: "18px 18px 0" }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--ink-500)",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Qué sigue
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Te avisaremos cuando concilien", "Push + correo"],
            r.nextPayment,
          ].map(([t, d]) => (
            <div
              key={t}
              style={{
                padding: 12,
                background: "#fff",
                borderRadius: 10,
                border: "1px solid var(--ink-100)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--pp-500)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)" }}
                >
                  {d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: "14px 18px calc(var(--m-safe-bottom) + 12px)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          type="button"
          style={{
            height: 50,
            borderRadius: 12,
            border: "none",
            background: "var(--ink-900)",
            color: "#fff",
            font: "600 14px var(--font-sans)",
          }}
        >
          Descargar comprobante
        </button>
        <Link
          href="/m/pago"
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid var(--ink-200)",
            background: "#fff",
            color: "var(--ink-700)",
            font: "500 14px var(--font-sans)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
