/** 13 · Subir comprobante de pago (MFlowComprobUpload del handoff). */
import Link from "next/link";

import { IcCheck, IcDownload, IcPhoto } from "@/components/icons";
import { MFlowTopBar, MStickyBar } from "@/components/mobile/nav";
import { MFormField } from "@/components/mobile/ui";

export const metadata = { title: "Comprobante · Propaily" };

export default function ReceiptUploadScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 120,
      }}
    >
      <MFlowTopBar title="Comprobante de pago" backHref="/m/pago" />

      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            padding: 14,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--ink-100)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--pp-500)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <IcCheck size={20} style={{ color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 13px var(--font-sans)" }}>
              Transferencia hecha
            </div>
            <div
              className="mono num"
              style={{ fontSize: 11, color: "var(--ink-500)" }}
            >
              $38,000 · 14 may · 11:42
            </div>
          </div>
        </div>

        <MFormField label="Sube el comprobante que te dio tu banco">
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/m/camara"
              style={{
                flex: 1,
                height: 130,
                borderRadius: 12,
                border: "1.5px dashed var(--pp-300)",
                background: "var(--pp-50)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "var(--pp-700)",
              }}
            >
              <IcPhoto size={26} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Tomar foto</span>
              <span className="mono" style={{ fontSize: 9, opacity: 0.7 }}>
                Cámara del teléfono
              </span>
            </Link>
            <div
              style={{
                flex: 1,
                height: 130,
                borderRadius: 12,
                border: "1.5px dashed var(--ink-300)",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "var(--ink-600)",
              }}
            >
              <IcDownload size={26} style={{ transform: "rotate(180deg)" }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Subir imagen</span>
              <span className="mono" style={{ fontSize: 9, opacity: 0.7 }}>
                PDF o JPG
              </span>
            </div>
          </div>
        </MFormField>

        <div style={{ marginTop: 18 }}>
          <MFormField label="Vista previa">
            <div
              className="pp-img-ph"
              style={{
                height: 220,
                borderRadius: 12,
                fontSize: 11,
              }}
            >
              Comprobante BBVA · 38,000.00 MXN
            </div>
          </MFormField>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 12,
            background: "#ECFDF5",
            borderRadius: 10,
            border: "1px solid #A7F3D0",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              background: "var(--ok)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <IcCheck size={12} />
          </span>
          <div style={{ flex: 1, fontSize: 12, color: "#065F46", lineHeight: 1.4 }}>
            Detectamos <strong>$38,000</strong> y <strong>POL412-001</strong>.
            Coincide con tu pago.
          </div>
        </div>
      </div>

      <MStickyBar>
        <Link
          href="/m/pago/ok"
          style={{
            width: "100%",
            height: 50,
            borderRadius: 12,
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 15px var(--font-sans)",
            boxShadow: "0 6px 18px rgba(110,58,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Enviar comprobante
        </Link>
      </MStickyBar>
    </div>
  );
}
