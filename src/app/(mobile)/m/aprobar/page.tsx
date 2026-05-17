/** 10 · Pendientes del propietario — datos reales (Fase 2a). */
import Link from "next/link";

import { IcChevR, IcDoc, IcKey } from "@/components/icons";
import { MFlowTopBar, MTabBar } from "@/components/mobile/nav";
import { Badge } from "@/components/mobile/ui";
import { getApprovalsData, resolveMobileRole } from "@/server/mobile/data";

export const metadata = { title: "Te toca revisar · Propaily" };

export default async function OwnerPendingScreen() {
  const { ctx } = await resolveMobileRole();
  const { approvals } = await getApprovalsData(ctx);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      <MFlowTopBar title="Te toca revisar" backHref="/m/inicio" />

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
          Renovaciones y avalúos · {approvals.length}
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
        {approvals.length === 0 && (
          <div
            style={{
              padding: 28,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              textAlign: "center",
              fontSize: 13,
              color: "var(--ink-500)",
            }}
          >
            No tienes nada pendiente por revisar. 🎉
          </div>
        )}

        {approvals.map((it) => (
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
                background: it.kind === "renovacion" ? "var(--pp-50)" : "#FFFBEB",
                color:
                  it.kind === "renovacion" ? "var(--pp-600)" : "var(--warn)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {it.kind === "renovacion" ? (
                <IcKey size={18} />
              ) : (
                <IcDoc size={18} />
              )}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 2 }}>
                <Badge tone={it.tone}>{it.tag}</Badge>
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
      </div>

      <MTabBar active={4} />
    </div>
  );
}
