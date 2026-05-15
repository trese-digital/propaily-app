/** 17 · Home del operador GFC · hoy en campo (MFlowAdminHome del handoff). */
import Link from "next/link";

import {
  IcArrowR,
  IcBell,
  IcBuilding,
  IcKey,
  IcSettings,
  IcUsers,
} from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { Avatar, MCard, MSection } from "@/components/mobile/ui";
import { adminToday } from "@/features/mobile/demo-data";

export const metadata = { title: "Hoy · Propaily Operador" };

const QUICK = [
  [IcBuilding, "Propiedades"],
  [IcUsers, "Clientes"],
  [IcKey, "Rentas"],
  [IcSettings, "Manten."],
] as const;

export default function AdminHomeScreen() {
  const a = adminToday;
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "var(--m-safe-top) 18px 18px",
          background: "#fff",
          borderBottom: "1px solid var(--ink-100)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <Avatar name={a.operator} size={36} tone="warn" />
          <div style={{ flex: 1 }}>
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-500)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              GFC · Operador
            </span>
            <div style={{ font: "600 16px var(--font-sans)" }}>
              Hola, {a.operator.split(" ")[0]}
            </div>
          </div>
          <Link href="/m/avisos" aria-label="Avisos" style={iconBtn}>
            <IcBell size={16} />
          </Link>
        </div>

        {/* Resumen del día */}
        <div
          style={{
            padding: 12,
            background: "var(--ink-900)",
            borderRadius: 12,
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 999,
              background: "rgba(110,58,255,0.25)",
            }}
          />
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.65,
              fontWeight: 600,
            }}
          >
            {a.dateLabel}
          </div>
          <div
            style={{
              font: "600 22px var(--font-sans)",
              marginTop: 4,
              letterSpacing: "-0.015em",
              position: "relative",
            }}
          >
            {a.summary}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            {a.chips.map((c) => (
              <span
                key={c.label}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: c.urgent
                    ? "rgba(245,158,11,0.30)"
                    : "rgba(255,255,255,0.15)",
                  color: c.urgent ? "#FCD34D" : "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ruta */}
      <MSection title="Tu ruta · 4 paradas">
        <MCard style={{ padding: 0 }}>
          <div
            className="pp-img-ph"
            style={{ height: 140, borderRadius: 0, position: "relative" }}
          >
            Ruta del día
            <span
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                padding: "4px 8px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}
            >
              {a.route.distance}
            </span>
          </div>
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                background: "var(--pp-500)",
                color: "#fff",
                font: "600 11px var(--font-sans)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              1
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ font: "500 13px var(--font-sans)" }}>
                {a.route.firstStop.title}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)" }}
              >
                {a.route.firstStop.detail}
              </div>
            </div>
            <IcArrowR size={13} style={{ color: "var(--ink-400)" }} />
          </div>
        </MCard>
      </MSection>

      {/* Urgentes */}
      <MSection title={`Necesitan acción · ${a.urgent.length}`}>
        {a.urgent.map((it) => (
          <div
            key={it.title}
            style={{
              padding: 12,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                background: it.tone === "bad" ? "#FEF2F2" : "#FFFBEB",
                color: it.tone === "bad" ? "var(--bad)" : "var(--warn)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {it.tone === "bad" ? (
                <IcBell size={17} />
              ) : (
                <IcSettings size={17} />
              )}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 13px var(--font-sans)" }}>
                {it.title}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)" }}
              >
                {it.detail}
              </div>
            </div>
            <Link
              href="/m/cobranza"
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: it.tone === "bad" ? "var(--bad)" : "var(--pp-500)",
                color: "#fff",
                font: "600 12px var(--font-sans)",
              }}
            >
              {it.cta}
            </Link>
          </div>
        ))}
      </MSection>

      {/* Acceso rápido */}
      <MSection title="Acceso rápido">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {QUICK.map(([Icon, label]) => (
            <div
              key={label}
              style={{
                padding: "14px 4px 10px",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid var(--ink-100)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--pp-50)",
                  color: "var(--pp-600)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} />
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--ink-700)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </MSection>

      <MTabBar active={0} />
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
