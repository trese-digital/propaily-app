"use client";

/**
 * 06 · Login — versión mobile del inicio de sesión (MobileLogin del handoff).
 * Reutiliza el server action `login` y el captcha Turnstile del portal de
 * escritorio: misma autenticación (correo + contraseña), distinto layout.
 */
import Link from "next/link";
import { useActionState } from "react";

import { PropailyMark } from "@/components/mobile/mark";
import { TurnstileWidget } from "@/components/turnstile";
import { mobileLogin, type MobileLoginState } from "./actions";

const initialState: MobileLoginState = {};

export default function MobileLoginScreen() {
  const [state, formAction, pending] = useActionState(mobileLogin, initialState);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: 300,
          background:
            "linear-gradient(160deg, var(--pp-500) 0%, var(--pp-800) 70%, var(--ink-900) 100%)",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 60,
            right: 30,
            width: 90,
            height: 90,
            borderRadius: 22,
            background: "rgba(255,255,255,0.07)",
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 28,
            paddingTop: "calc(var(--m-safe-top) - 10px)",
            display: "flex",
            flexDirection: "column",
            color: "#fff",
          }}
        >
          <PropailyMark size={44} bg="#fff" fg="var(--pp-600)" radius={11} />
          <div style={{ flex: 1 }} />
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
            }}
          >
            by GF Consultoría
          </span>
          <h1
            style={{
              margin: "6px 0 0",
              font: "600 32px/1.1 var(--font-sans)",
              letterSpacing: "-0.025em",
            }}
          >
            Tu portafolio
            <br />
            en el bolsillo.
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 14,
              opacity: 0.85,
              lineHeight: 1.55,
            }}
          >
            Consulta propiedades, aprueba documentos y revisa rentas desde
            cualquier lugar.
          </p>
        </div>
      </div>

      <form
        action={formAction}
        style={{
          padding: "24px 24px calc(var(--m-safe-bottom) + 12px)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="tu@empresa.mx"
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Contraseña"
          style={inputStyle}
        />

        <TurnstileWidget />

        {state.error && (
          <p
            role="alert"
            style={{
              margin: 0,
              fontSize: 12,
              color: "var(--bad)",
              textAlign: "center",
            }}
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            height: 50,
            borderRadius: 12,
            border: "none",
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 15px var(--font-sans)",
            boxShadow: "0 6px 20px rgba(110,58,255,0.25)",
            opacity: pending ? 0.6 : 1,
            cursor: pending ? "wait" : "pointer",
          }}
        >
          {pending ? "Entrando…" : "Iniciar sesión"}
        </button>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 11,
            color: "var(--ink-500)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          ¿Eres inquilino?{" "}
          <span style={{ color: "var(--pp-600)", fontWeight: 600 }}>
            Pide invitación
          </span>{" "}
          a tu administrador para entrar.
        </p>
        <Link
          href="/m/login/email-enviado"
          style={{
            fontSize: 12,
            color: "var(--ink-500)",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 50,
  borderRadius: 12,
  border: "1px solid var(--ink-200)",
  background: "#fff",
  padding: "0 14px",
  font: "400 15px var(--font-sans)",
  color: "var(--ink-900)",
  width: "100%",
};
