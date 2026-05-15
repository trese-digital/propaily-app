"use client";

/** 05 · Selector de rol — owner / tenant / admin (MFlowRole del handoff). */
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { IcBuilding, IcChart, IcCheck, IcKey } from "@/components/icons";
import { PropailyMark } from "@/components/mobile/mark";
import { roles, type Role } from "@/features/mobile/demo-data";

const ICONS = { owner: IcChart, tenant: IcKey, admin: IcBuilding } as const;
const HOME: Record<Role, Route> = {
  owner: "/m/inicio",
  tenant: "/m/pago",
  admin: "/m/admin",
};

export default function RoleScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("owner");
  const current = roles.find((r) => r.id === selected)!;

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
      <div style={{ padding: "20px 24px 0" }}>
        <PropailyMark size={36} bg="var(--pp-500)" fg="#fff" radius={9} />
        <h1
          style={{
            margin: "22px 0 6px",
            font: "600 26px/1.15 var(--font-sans)",
            letterSpacing: "-0.025em",
          }}
        >
          ¿Cómo usarás Propaily?
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "var(--ink-500)",
            lineHeight: 1.55,
          }}
        >
          Detectamos tu cuenta. Elige el rol con el que quieres empezar — puedes
          cambiarlo después desde tu perfil.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {roles.map((r) => {
          const Icon = ICONS[r.id];
          const active = r.id === selected;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r.id)}
              style={{
                padding: 16,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 14,
                textAlign: "left",
                background: active ? "var(--pp-50)" : "#fff",
                border: active
                  ? "1.5px solid var(--pp-400)"
                  : "1px solid var(--ink-200)",
                boxShadow: active
                  ? "0 6px 20px rgba(110,58,255,0.12)"
                  : "var(--shadow-xs)",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: active ? "var(--pp-500)" : "var(--ink-50)",
                  color: active ? "#fff" : "var(--ink-600)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                <Icon size={20} />
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    font: "600 15px var(--font-sans)",
                    color: "var(--ink-900)",
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-500)",
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {r.desc}
                </div>
              </div>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: active ? "none" : "1.5px solid var(--ink-300)",
                  background: active ? "var(--pp-500)" : "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                {active && <IcCheck size={12} style={{ color: "#fff" }} />}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "0 24px 32px" }}>
        <button
          type="button"
          onClick={() => router.push(HOME[selected])}
          style={{
            height: 52,
            width: "100%",
            borderRadius: 12,
            border: "none",
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 15px var(--font-sans)",
            boxShadow: "0 6px 20px rgba(110,58,255,0.25)",
          }}
        >
          Continuar como {current.name}
        </button>
        <Link
          href="/m/login"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 14,
            fontSize: 13,
            color: "var(--pp-600)",
            fontWeight: 600,
          }}
        >
          Iniciar sesión con otra cuenta
        </Link>
      </div>
    </div>
  );
}
