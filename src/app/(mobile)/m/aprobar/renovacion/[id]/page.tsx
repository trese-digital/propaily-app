/** 11 · Detalle de aprobación (renovación / avalúo) — datos reales (Fase 2a). */
import { notFound } from "next/navigation";

import { MFlowTopBar, MStickyBar } from "@/components/mobile/nav";
import { Badge, MCard, MSection } from "@/components/mobile/ui";
import { getApprovalDetailData, resolveMobileRole } from "@/server/mobile/data";

export default async function ApproveDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { ctx } = await resolveMobileRole();
  const d = await getApprovalDetailData(ctx, id);
  if (!d) notFound();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 110,
      }}
    >
      <MFlowTopBar title={d.title} backHref="/m/aprobar" />

      <div style={{ padding: "18px 18px 6px" }}>
        <Badge tone={d.kind === "renovacion" ? "violet" : "warn"}>
          {d.badge}
        </Badge>
        <h1
          style={{
            margin: "10px 0 4px",
            font: "600 22px var(--font-sans)",
            letterSpacing: "-0.015em",
          }}
        >
          {d.title}
        </h1>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-500)" }}>
          {d.property}
        </div>
      </div>

      <MSection title="Detalle">
        <MCard style={{ padding: 0 }}>
          {d.rows.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{k}</span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-900)",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </MCard>
      </MSection>

      {d.note && (
        <MSection title="Notas">
          <MCard>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-900)",
                lineHeight: 1.55,
              }}
            >
              {d.note}
            </div>
          </MCard>
        </MSection>
      )}

      <MStickyBar>
        <button
          type="button"
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            border: "1px solid var(--ink-200)",
            background: "#fff",
            font: "500 14px var(--font-sans)",
            color: "var(--ink-700)",
          }}
        >
          Comentar
        </button>
        <button
          type="button"
          style={{
            flex: 1.4,
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 14px var(--font-sans)",
            boxShadow: "0 6px 18px rgba(110,58,255,0.28)",
          }}
        >
          {d.kind === "renovacion" ? "Aprobar renovación" : "Ver avalúo"}
        </button>
      </MStickyBar>
    </div>
  );
}
