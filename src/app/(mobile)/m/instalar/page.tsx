/** 04 · Añadir a pantalla de inicio — hint de instalación PWA (MFlowInstall). */
import Link from "next/link";

import { PropailyMark } from "@/components/mobile/mark";

export const metadata = { title: "Instalar · Propaily" };

export default function InstallScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        position: "relative",
        background: "rgba(20, 14, 48, 0.55)",
        overflow: "hidden",
      }}
    >
      {/* Fondo difuminado de la app */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, var(--pp-50) 0%, var(--ink-25) 100%)",
          opacity: 0.5,
        }}
      />

      {/* Bottom sheet estilo iOS */}
      <div
        data-anim
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 30,
          background: "#F2F2F7",
          borderRadius: 14,
          padding: "20px 18px 14px",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.25)",
          animation: "pp-slide-up 250ms var(--ease-out)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <PropailyMark size={56} bg="#fff" fg="var(--pp-600)" radius={12} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "600 17px var(--font-sans)", letterSpacing: "-0.4px" }}>
              Propaily
            </div>
            <div style={{ fontSize: 13, color: "#8E8E93", marginTop: 2 }}>
              app.propaily.com
            </div>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "#3C3C43",
            lineHeight: 1.45,
          }}
        >
          Añade Propaily a tu pantalla de inicio para acceder rápido, recibir
          avisos y trabajar sin conexión.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[
            ["1", "Toca el botón Compartir de tu navegador"],
            ["2", "Elige “Añadir a pantalla de inicio”"],
          ].map(([n, label]) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "#000",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: "#007AFF",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  flex: "0 0 auto",
                }}
              >
                {n}
              </span>
              <span style={{ fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/m/rol"
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 44,
            borderRadius: 10,
            background: "#007AFF",
            color: "#fff",
            font: "600 15px var(--font-sans)",
          }}
        >
          Entendido
        </Link>
        <Link
          href="/m/rol"
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 12,
            color: "#8E8E93",
            marginTop: 8,
          }}
        >
          Recordarme después
        </Link>
      </div>
    </div>
  );
}
