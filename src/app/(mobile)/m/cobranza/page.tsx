/** 18 · Cobranza del operador — datos reales (Fase 2a). */
import { MTabBar } from "@/components/mobile/nav";
import { Avatar, Chip, Progress } from "@/components/mobile/ui";
import { getCollectionsData, resolveMobileRole } from "@/server/mobile/data";

export const metadata = { title: "Cobranza · Propaily" };

const monthFmt = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
});

export default async function CollectionsScreen() {
  const { ctx } = await resolveMobileRole();
  const c = await getCollectionsData(ctx);

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
          {monthFmt.format(new Date())} · {c.monthLabel}
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
            <Chip>Este mes</Chip>
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
        {c.overdue.length === 0 && (
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
            Sin rentas vencidas. Cobranza al día. ✅
          </div>
        )}

        {c.overdue.map((row, i) => (
          <div
            key={`${row.name}-${i}`}
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
          </div>
        ))}
      </div>

      <MTabBar active={2} />
    </div>
  );
}
