/** 07 · Revisa tu correo — confirmación de envío de enlace (MFlowMagicSent). */
import Link from "next/link";

import { IcArrowR } from "@/components/icons";

export const metadata = { title: "Revisa tu correo · Propaily" };

export default function MagicSentScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        paddingTop: "var(--m-safe-top)",
      }}
    >
      <div style={{ padding: "12px 18px", display: "flex", alignItems: "center" }}>
        <Link
          href="/m/login"
          aria-label="Atrás"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--ink-200)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-600)",
          }}
        >
          <IcArrowR size={14} style={{ transform: "rotate(180deg)" }} />
        </Link>
      </div>

      <div
        style={{
          flex: 1,
          padding: "40px 28px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 22,
            background:
              "linear-gradient(135deg, var(--pp-100) 0%, var(--pp-300) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            boxShadow: "0 14px 32px rgba(110,58,255,0.20)",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--pp-700)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 7l9 6 9-6" />
            <rect x="3" y="5" width="18" height="14" rx="2" />
          </svg>
        </div>

        <h1
          style={{
            margin: 0,
            font: "600 24px/1.2 var(--font-sans)",
            letterSpacing: "-0.02em",
          }}
        >
          Revisa tu correo
        </h1>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "var(--ink-500)",
            lineHeight: 1.55,
          }}
        >
          Enviamos un enlace seguro a
        </p>
        <span
          className="mono"
          style={{
            marginTop: 6,
            padding: "6px 12px",
            borderRadius: 8,
            background: "var(--pp-50)",
            color: "var(--pp-700)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          pablo@gfc.mx
        </span>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 13,
            color: "var(--ink-500)",
            lineHeight: 1.5,
            maxWidth: 290,
          }}
        >
          Toca el enlace en cualquier dispositivo para continuar. Caduca en 15
          minutos.
        </p>

        <div style={{ marginTop: 28, width: "100%", maxWidth: 320 }}>
          <a
            href="https://mail.google.com"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 48,
              borderRadius: 12,
              background: "var(--ink-900)",
              color: "#fff",
              font: "600 14px var(--font-sans)",
            }}
          >
            Abrir Gmail
          </a>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {["Outlook", "Otra app"].map((l) => (
              <a
                key={l}
                href="https://outlook.live.com"
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: "1px solid var(--ink-200)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "500 13px var(--font-sans)",
                  color: "var(--ink-700)",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 28px calc(var(--m-safe-bottom) + 12px)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--ink-500)" }}>
          ¿No te llegó?{" "}
        </span>
        <Link
          href="/m/login"
          style={{ fontSize: 12, color: "var(--pp-600)", fontWeight: 600 }}
        >
          Volver e intentar de nuevo
        </Link>
      </div>
    </div>
  );
}
