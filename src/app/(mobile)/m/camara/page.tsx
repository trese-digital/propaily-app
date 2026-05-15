/**
 * 16 · Cámara · viewfinder (MFlowCamera del handoff).
 *
 * Fase 1: UI del visor. El stream real (`getUserMedia`, EXIF stripping,
 * `ImageCapture`) se conecta en Fase 2 — ver Spec §4·16.
 */
import Link from "next/link";

import { IcX } from "@/components/icons";

export const metadata = { title: "Cámara · Propaily" };

export default function CameraScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Viewfinder simulado */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #2a2530 0%, #100c1c 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 60%, rgba(110,58,255,0.10) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: "translate(-50%,-50%)",
            width: 180,
            height: 180,
            borderRadius: 12,
            background: "linear-gradient(135deg, #4a3a30 0%, #2a1f18 100%)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: "var(--m-safe-top)",
          left: 0,
          right: 0,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href="/m/pago/comprobante"
          aria-label="Cerrar cámara"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <IcX size={18} />
        </Link>
        <span style={{ flex: 1 }} />
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Flash · auto
        </span>
      </div>

      {/* Indicador central */}
      <div
        style={{
          position: "absolute",
          top: "calc(var(--m-safe-top) + 56px)",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(110,58,255,0.85)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Fuga en cocina · foto 2 de 3
        </span>
      </div>

      {/* Marcas de enfoque */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%,-50%)",
          width: 80,
          height: 80,
          pointerEvents: "none",
        }}
      >
        {(["TL", "TR", "BL", "BR"] as const).map((c) => (
          <span
            key={c}
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              ...(c.includes("T") ? { top: 0 } : { bottom: 0 }),
              ...(c.includes("L") ? { left: 0 } : { right: 0 }),
              borderTop: c.includes("T") ? "2px solid #fff" : undefined,
              borderBottom: c.includes("B") ? "2px solid #fff" : undefined,
              borderLeft: c.includes("L") ? "2px solid #fff" : undefined,
              borderRight: c.includes("R") ? "2px solid #fff" : undefined,
            }}
          />
        ))}
      </div>

      {/* Miniaturas capturadas */}
      <div
        style={{
          position: "absolute",
          top: "calc(var(--m-safe-top) + 100px)",
          right: 18,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[1, 2].map((n) => (
          <div
            key={n}
            className="pp-img-ph"
            style={{
              width: 48,
              height: 60,
              borderRadius: 8,
              border: "2px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          />
        ))}
      </div>

      {/* Controles inferiores */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(var(--m-safe-bottom) + 30px)",
          left: 0,
          right: 0,
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="pp-img-ph"
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.4)",
          }}
        />
        <Link
          href="/m/pago/comprobante"
          aria-label="Capturar foto"
          style={{
            width: 74,
            height: 74,
            borderRadius: 999,
            border: "4px solid #fff",
            background: "transparent",
            position: "relative",
            display: "block",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: 999,
              background: "#fff",
            }}
          />
        </Link>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 16V8a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="m16 8 4 4-4 4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
