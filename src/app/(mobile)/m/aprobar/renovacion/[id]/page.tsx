/** 11 · Aprobar renovación · detalle (MFlowApproveDetail del handoff). */
import { IcDoc, IcDownload } from "@/components/icons";
import { MFlowTopBar, MStickyBar } from "@/components/mobile/nav";
import { Avatar, Badge, MCard, MSection } from "@/components/mobile/ui";
import { renewalDetail } from "@/features/mobile/demo-data";

export default async function ApproveDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  const d = renewalDetail;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 130,
      }}
    >
      <MFlowTopBar
        title={`Renovación · ${d.tenant.split(" ")[0]} ${d.tenant.split(" ")[1]?.[0] ?? ""}.`}
        backHref="/m/aprobar"
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
            <IcDownload size={14} />
          </span>
        }
      />

      <div style={{ padding: "18px 18px 6px" }}>
        <Badge tone="warn">Vence en {d.expiresIn}</Badge>
        <h1
          style={{
            margin: "10px 0 4px",
            font: "600 22px var(--font-sans)",
            letterSpacing: "-0.015em",
          }}
        >
          Propuesta de renovación
        </h1>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-500)" }}>
          {d.property} · {d.term}
        </div>
      </div>

      {/* Comparación */}
      <div style={{ padding: "14px 18px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid var(--ink-100)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid var(--ink-100)",
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
                style={{
                  font: "500 22px var(--font-sans)",
                  color: "var(--ink-700)",
                  letterSpacing: "-0.015em",
                  marginTop: 4,
                }}
              >
                {d.currentRent}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}
              >
                {d.currentSince}
              </div>
            </div>
            <div
              style={{
                borderLeft: "1px solid var(--ink-100)",
                paddingLeft: 14,
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
                Propuesta
              </div>
              <div
                className="num"
                style={{
                  font: "600 22px var(--font-sans)",
                  color: "var(--pp-700)",
                  letterSpacing: "-0.015em",
                  marginTop: 4,
                }}
              >
                {d.proposedRent}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--ok)",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {d.proposedDelta}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: "var(--ink-25)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {d.terms.map(([k, v, h]) => (
              <div
                key={k}
                style={{ display: "flex", alignItems: "baseline", gap: 8 }}
              >
                <span
                  style={{ fontSize: 12, color: "var(--ink-600)", flex: 1 }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink-900)",
                    fontWeight: 500,
                  }}
                >
                  {v}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--ink-500)",
                    minWidth: 80,
                    textAlign: "right",
                  }}
                >
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nota del inquilino */}
      <MSection title="Nota del inquilino">
        <MCard>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Avatar name={d.tenant} size={32} tone="violet" />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-900)",
                  lineHeight: 1.55,
                }}
              >
                “{d.tenantNote}”
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 6 }}
              >
                {d.noteAge}
              </div>
            </div>
          </div>
        </MCard>
      </MSection>

      {/* Documentos */}
      <MSection title={`Documentos adjuntos · ${d.docs.length}`}>
        <MCard style={{ padding: 0 }}>
          {d.docs.map(([name, meta], i) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--pp-50)",
                  color: "var(--pp-600)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IcDoc size={15} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "500 13px var(--font-sans)" }}>{name}</div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 1 }}
                >
                  {meta}
                </div>
              </div>
            </div>
          ))}
        </MCard>
      </MSection>

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
          Negociar
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
          Aprobar propuesta
        </button>
      </MStickyBar>
    </div>
  );
}
