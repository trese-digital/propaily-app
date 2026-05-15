/** 10 · Pendientes de aprobación del propietario (MFlowOwnerPending). */
import Link from "next/link";

import { IcChevR, IcDoc, IcFilter, IcSettings } from "@/components/icons";
import { MFlowTopBar, MTabBar } from "@/components/mobile/nav";
import { Avatar, Badge } from "@/components/mobile/ui";
import { approvals, renewalDetail } from "@/features/mobile/demo-data";

export const metadata = { title: "Te toca aprobar · Propaily" };

export default function OwnerPendingScreen() {
  const compact = approvals.filter((a) => a.kind !== "renovacion");

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      <MFlowTopBar
        title="Te toca aprobar"
        backHref="/m/inicio"
        right={
          <span
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
            <IcFilter size={14} />
          </span>
        }
      />

      <div style={{ padding: "14px 18px 6px" }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--ink-500)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Esperan tu decisión · {approvals.length}
        </div>
      </div>

      <div
        style={{
          padding: "8px 18px 0",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Destacado — renovación */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--pp-200)",
            boxShadow: "0 4px 16px rgba(110,58,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              background: "var(--pp-50)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Badge tone="violet">Renovación</Badge>
            <span style={{ flex: 1 }} />
            <span
              className="mono"
              style={{ fontSize: 10, color: "var(--pp-700)", fontWeight: 600 }}
            >
              VENCE EN {renewalDetail.expiresIn.toUpperCase()}
            </span>
          </div>
          <div style={{ padding: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <Avatar name={renewalDetail.tenant} size={42} tone="violet" />
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 14px var(--font-sans)" }}>
                  {renewalDetail.tenant}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-500)" }}
                >
                  {renewalDetail.property} · inquilina desde jun 2024
                </div>
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: "var(--ink-25)",
                borderRadius: 10,
                border: "1px solid var(--ink-100)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "var(--ink-500)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Renta actual
                </div>
                <div
                  className="num"
                  style={{ font: "500 15px var(--font-sans)", marginTop: 2 }}
                >
                  {renewalDetail.currentRent}
                </div>
              </div>
              <div>
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
                  Propuesta
                </div>
                <div
                  className="num"
                  style={{
                    font: "600 15px var(--font-sans)",
                    color: "var(--pp-700)",
                    marginTop: 2,
                  }}
                >
                  {renewalDetail.proposedRent}{" "}
                  <span style={{ color: "var(--ok)", fontSize: 11 }}>+6.6%</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href={`/m/aprobar/renovacion/${renewalDetail.id}`}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  border: "1px solid var(--ink-200)",
                  background: "#fff",
                  color: "var(--ink-700)",
                  font: "500 13px var(--font-sans)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Ver detalles
              </Link>
              <Link
                href={`/m/aprobar/renovacion/${renewalDetail.id}`}
                style={{
                  flex: 1.4,
                  height: 40,
                  borderRadius: 10,
                  border: "none",
                  background: "var(--pp-500)",
                  color: "#fff",
                  font: "600 13px var(--font-sans)",
                  boxShadow: "0 4px 14px rgba(110,58,255,0.25)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Aprobar
              </Link>
            </div>
          </div>
        </div>

        {/* Compactos */}
        {compact.map((it) => (
          <Link
            key={it.id}
            href={`/m/aprobar/renovacion/${it.id}`}
            style={{
              padding: 14,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: it.tone === "warn" ? "#FFFBEB" : "#EFF6FF",
                color: it.tone === "warn" ? "var(--warn)" : "var(--info)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {it.tone === "warn" ? (
                <IcDoc size={18} />
              ) : (
                <IcSettings size={18} />
              )}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 2 }}>
                <Badge tone={it.tone === "warn" ? "warn" : "neutral"}>
                  {it.tag}
                </Badge>
              </div>
              <div style={{ font: "600 13px var(--font-sans)" }}>
                {it.title}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}
              >
                {it.detail}
              </div>
            </div>
            <IcChevR size={14} style={{ color: "var(--ink-400)" }} />
          </Link>
        ))}

        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-500)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Sin pendientes anteriores
          </span>
        </div>
      </div>

      <MTabBar active={3} />
    </div>
  );
}
