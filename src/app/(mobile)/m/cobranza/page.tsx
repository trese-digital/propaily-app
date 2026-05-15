/** 18 · Cobranza del operador (MFlowAdminCobranza del handoff). */
import { MTabBar } from "@/components/mobile/nav";
import { Avatar, Chip, Progress } from "@/components/mobile/ui";
import { collections } from "@/features/mobile/demo-data";

export const metadata = { title: "Cobranza · Propaily" };

export default function CollectionsScreen() {
  const c = collections;
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          padding: "var(--m-safe-top) 18px 12px",
          background: "#fff",
          borderBottom: "1px solid var(--ink-100)",
        }}
      >
        <h1
          style={{
            margin: 0,
            font: "600 22px var(--font-sans)",
            letterSpacing: "-0.015em",
          }}
        >
          Cobranza
        </h1>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-500)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {c.monthLabel}
        </div>

        <div style={{ marginTop: 14 }}>
          <Progress
            value={c.collectedPct}
            tone="ok"
            label="Cobrado este mes"
            right={c.collectedLabel}
            height={8}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <Chip active>Vencidos · {c.overdue.length}</Chip>
            <Chip>Esta sem.</Chip>
            <Chip>Pagados · 19</Chip>
          </div>
        </div>
      </div>

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
          Vencidos · prioridad
        </div>
      </div>

      <div
        style={{
          padding: "0 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {c.overdue.map((row) => (
          <div
            key={row.name}
            style={{
              padding: 14,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <Avatar name={row.name} size={40} tone={row.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "600 14px var(--font-sans)" }}>
                  {row.name}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)" }}
                >
                  {row.property} · {row.tel}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  className="num"
                  style={{ font: "600 15px var(--font-sans)" }}
                >
                  {row.amount}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--bad)",
                    fontWeight: 600,
                  }}
                >
                  {row.days} d vencido
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <a
                href={`tel:${row.tel.replace(/\s/g, "")}`}
                style={actionBtn(false)}
              >
                Llamar
              </a>
              <a
                href={`https://wa.me/52${row.tel.replace(/\s/g, "")}`}
                style={actionBtn(false)}
              >
                WhatsApp
              </a>
              <button type="button" style={actionBtn(true)}>
                Marcar pago
              </button>
            </div>
          </div>
        ))}
      </div>

      <MTabBar active={2} />
    </div>
  );
}

function actionBtn(primary: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "8px 0",
    borderRadius: 8,
    border: primary ? "none" : "1px solid var(--ink-200)",
    background: primary ? "var(--pp-500)" : "#fff",
    color: primary ? "#fff" : "var(--ink-700)",
    font: `${primary ? 600 : 500} 12px var(--font-sans)`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };
}
