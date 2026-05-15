"use client";

/** 02–03 · Onboarding — consulta + aprueba (MFlowOnboard1/2 del handoff). */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageDots } from "@/components/mobile/nav";

const SLIDES = [
  {
    bg: "linear-gradient(140deg, var(--pp-50) 0%, var(--ink-25) 70%)",
    title: ["Tu portafolio,", "donde estés"],
    body: "Consulta el valor, las rentas y los avalúos de tus propiedades sin abrir la laptop.",
  },
  {
    bg: "linear-gradient(140deg, #FFFBEB 0%, var(--ink-25) 70%)",
    title: ["Aprueba con", "un toque"],
    body: "Renovaciones, avalúos y propuestas — todo lo que necesita tu visto bueno te llega aquí.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];

  function next() {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else router.push("/m/instalar");
  }

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
      <div
        style={{ padding: "8px 18px", display: "flex", justifyContent: "flex-end" }}
      >
        <Link
          href="/m/instalar"
          style={{ font: "500 14px var(--font-sans)", color: "var(--ink-500)" }}
        >
          Omitir
        </Link>
      </div>

      <div
        style={{
          flex: 1,
          margin: "8px 22px",
          borderRadius: 22,
          background: slide.bg,
          padding: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: 320,
        }}
      >
        {step === 0 ? <PreviewConsulta /> : <PreviewAprueba />}
      </div>

      <div style={{ padding: "24px 28px 18px", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            font: "600 26px/1.15 var(--font-sans)",
            letterSpacing: "-0.025em",
            color: "var(--ink-900)",
          }}
        >
          {slide.title[0]}
          <br />
          {slide.title[1]}
        </h1>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "var(--ink-500)",
            lineHeight: 1.55,
          }}
        >
          {slide.body}
        </p>
      </div>

      <div style={{ padding: "0 24px 32px" }}>
        <PageDots count={2} active={step} color="var(--pp-500)" />
        <button
          type="button"
          onClick={next}
          style={{
            marginTop: 18,
            height: 50,
            width: "100%",
            borderRadius: 12,
            border: "none",
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 15px var(--font-sans)",
            boxShadow: "0 6px 20px rgba(110,58,255,0.25)",
          }}
        >
          {step < SLIDES.length - 1 ? "Continuar" : "Empezar"}
        </button>
      </div>
    </div>
  );
}

function PreviewConsulta() {
  return (
    <div
      style={{
        width: 220,
        transform: "rotate(-3deg)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          padding: 14,
          background: "#fff",
          borderRadius: 14,
          border: "1px solid var(--pp-100)",
          boxShadow: "0 10px 28px rgba(110,58,255,0.18)",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--pp-700)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Patrimonio
        </div>
        <div
          className="mono num"
          style={{
            font: "600 28px var(--font-sans)",
            letterSpacing: "-0.02em",
            marginTop: 2,
          }}
        >
          $62.7M
        </div>
        <div style={{ fontSize: 10, color: "var(--ok)", fontWeight: 600 }}>
          ↗ +4.2% trimestre
        </div>
      </div>
      <div
        style={{
          padding: 10,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid var(--ink-100)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div
          className="pp-img-ph"
          style={{ width: 38, height: 38, borderRadius: 7 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ font: "600 11px var(--font-sans)" }}>
            Casa Polanco 412
          </div>
          <div
            className="mono"
            style={{ fontSize: 9, color: "var(--ink-500)" }}
          >
            $8.4M · rentada
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewAprueba() {
  return (
    <div style={{ width: 232, display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          padding: 14,
          background: "#fff",
          borderRadius: 14,
          border: "1px solid var(--ink-100)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
          transform: "rotate(-2deg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "var(--warn)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            !
          </span>
          <span style={{ font: "600 12px var(--font-sans)" }}>
            Renovación pendiente
          </span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-500)" }}>
          Casa Polanco · Sofía M.
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <span
            style={{
              flex: 1,
              padding: "6px 0",
              textAlign: "center",
              borderRadius: 6,
              border: "1px solid var(--ink-200)",
              fontSize: 11,
            }}
          >
            Rechazar
          </span>
          <span
            style={{
              flex: 1,
              padding: "6px 0",
              textAlign: "center",
              borderRadius: 6,
              background: "var(--pp-500)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Aprobar
          </span>
        </div>
      </div>
      <div
        style={{
          padding: 12,
          background: "#ECFDF5",
          borderRadius: 12,
          border: "1px solid #A7F3D0",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transform: "rotate(1.5deg)",
          marginLeft: 18,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "var(--ok)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          ✓
        </span>
        <span style={{ fontSize: 12, color: "#065F46", fontWeight: 600 }}>
          Aprobado · listo
        </span>
      </div>
    </div>
  );
}
