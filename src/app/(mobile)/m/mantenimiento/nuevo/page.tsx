"use client";

/** 15 · Nueva solicitud de mantenimiento (MobileMantenimiento del handoff). */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { IcChevD, IcPlus, IcX } from "@/components/icons";
import { Dot } from "@/components/mobile/ui";
import { MFormField } from "@/components/mobile/ui";
import { maintenanceCategories } from "@/features/mobile/demo-data";

const PRIORITIES = [
  ["Baja", "neutral"],
  ["Media", "info"],
  ["Alta", "warn"],
  ["Urgente", "bad"],
] as const;

export default function MaintenanceScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<number | null>(null);
  const [priority, setPriority] = useState(1);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState(0);

  // Regla del Spec §4·15: categoría + descripción ≥ 20 chars + ≥ 1 foto.
  const valid =
    category !== null && description.trim().length >= 20 && photos >= 1;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg-muted)" }}>
      <div
        style={{
          padding: "var(--m-safe-top) 14px 14px",
          background: "#fff",
          borderBottom: "1px solid var(--ink-100)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link href="/m/inicio" aria-label="Cerrar" style={iconBtn}>
          <IcX size={14} />
        </Link>
        <span
          style={{
            flex: 1,
            font: "600 16px var(--font-sans)",
            textAlign: "center",
          }}
        >
          Nueva solicitud
        </span>
        <button
          type="button"
          disabled={!valid}
          onClick={() => router.push("/m/avisos")}
          style={{
            font: "500 12px var(--font-sans)",
            color: valid ? "var(--pp-600)" : "var(--ink-400)",
            background: "transparent",
            border: "none",
            cursor: valid ? "pointer" : "not-allowed",
            padding: "6px 10px",
          }}
        >
          Enviar
        </button>
      </div>

      <div
        style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}
      >
        <MFormField label="Propiedad">
          <div
            style={{
              padding: 12,
              background: "#fff",
              borderRadius: 10,
              border: "1px solid var(--ink-200)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              className="pp-img-ph"
              style={{ width: 32, height: 32, borderRadius: 6, flex: "0 0 auto" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ font: "500 13px var(--font-sans)" }}>
                Casa Polanco 412
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)" }}
              >
                seleccionada por tu unidad
              </div>
            </div>
            <IcChevD size={12} style={{ color: "var(--ink-500)" }} />
          </div>
        </MFormField>

        <MFormField label="Categoría">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 6,
            }}
          >
            {maintenanceCategories.map(([name, emoji], i) => {
              const on = category === i;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(i)}
                  style={{
                    padding: "10px 4px",
                    borderRadius: 8,
                    background: on ? "var(--pp-50)" : "#fff",
                    border: on
                      ? "1px solid var(--pp-300)"
                      : "1px solid var(--ink-200)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: on ? "var(--pp-700)" : "var(--ink-700)",
                      fontWeight: 500,
                    }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </MFormField>

        <MFormField label="Prioridad">
          <div style={{ display: "flex", gap: 6 }}>
            {PRIORITIES.map(([label, tone], i) => {
              const on = priority === i;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPriority(i)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    background: on ? "var(--pp-50)" : "#fff",
                    border: on
                      ? "1px solid var(--pp-300)"
                      : "1px solid var(--ink-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    cursor: "pointer",
                  }}
                >
                  <Dot tone={tone} size={7} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: on ? "var(--pp-700)" : "var(--ink-700)",
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </MFormField>

        <MFormField label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema con detalle (mínimo 20 caracteres)…"
            rows={3}
            style={{
              padding: 12,
              minHeight: 80,
              background: "#fff",
              borderRadius: 10,
              border: "1px solid var(--ink-200)",
              fontSize: 13,
              color: "var(--ink-900)",
              lineHeight: 1.5,
              font: "400 13px var(--font-sans)",
              resize: "vertical",
            }}
          />
          <span
            className="mono"
            style={{
              fontSize: 10,
              color:
                description.trim().length >= 20
                  ? "var(--ok)"
                  : "var(--ink-500)",
            }}
          >
            {description.trim().length} / 20 caracteres
          </span>
        </MFormField>

        <MFormField label="Fotos · ayudan al diagnóstico">
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: photos }).map((_, i) => (
              <div
                key={i}
                className="pp-img-ph"
                style={{ width: 70, height: 70, borderRadius: 8 }}
              />
            ))}
            {photos < 5 && (
              <button
                type="button"
                onClick={() => setPhotos((n) => n + 1)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 8,
                  border: "1.5px dashed var(--ink-300)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  color: "var(--ink-500)",
                  gap: 3,
                  cursor: "pointer",
                }}
              >
                <IcPlus size={18} />
                <span style={{ fontSize: 9 }}>Agregar</span>
              </button>
            )}
          </div>
        </MFormField>

        <div
          style={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingBottom: "var(--m-safe-bottom)",
          }}
        >
          <button
            type="button"
            disabled={!valid}
            onClick={() => router.push("/m/avisos")}
            style={{
              height: 50,
              borderRadius: 12,
              border: "none",
              background: "var(--pp-500)",
              color: "#fff",
              font: "600 15px var(--font-sans)",
              boxShadow: "0 6px 18px rgba(110,58,255,0.25)",
              opacity: valid ? 1 : 0.45,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            Enviar solicitud
          </button>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-500)",
              textAlign: "center",
            }}
          >
            Tu administrador la verá en cuanto llegue.
          </span>
        </div>
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid var(--ink-200)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink-600)",
  flex: "0 0 auto",
};
