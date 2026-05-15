/** 20 · Detalle de aviso · tipo `overdue` (MFlowAvisoDetalle del handoff). */
import { IcBell, IcMore } from "@/components/icons";
import { MFlowTopBar, MStickyBar } from "@/components/mobile/nav";
import { Badge, MCard, MSection } from "@/components/mobile/ui";
import { Dot, type DotTone } from "@/components/mobile/ui";
import { noticeDetail } from "@/features/mobile/demo-data";

export default async function NoticeDetailScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  const d = noticeDetail;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg-muted)",
        paddingBottom: 110,
      }}
    >
      <MFlowTopBar
        title="Aviso"
        backHref="/m/avisos"
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
            <IcMore size={14} />
          </span>
        }
      />

      <div style={{ padding: "18px 18px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#FEF2F2",
              color: "var(--bad)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <IcBell size={20} />
          </span>
          <div style={{ flex: 1 }}>
            <Badge tone="bad">Renta vencida</Badge>
            <div
              style={{
                font: "600 17px var(--font-sans)",
                marginTop: 6,
                letterSpacing: "-0.015em",
              }}
            >
              {d.title}
            </div>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}
            >
              {d.age}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "8px 18px" }}>
        <MCard accent>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {[
              ["Monto", d.amount, "var(--bad)"],
              ["Vencido", d.overdueDays, "var(--bad)"],
              ["Fecha original", d.originalDate, "var(--ink-900)"],
              ["Multa acumulada", d.penalty, "var(--ink-900)"],
            ].map(([k, v, color]) => (
              <div key={k}>
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    color: "var(--ink-500)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {k}
                </div>
                <div
                  className="num"
                  style={{
                    font: "600 18px var(--font-sans)",
                    marginTop: 4,
                    color,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </MCard>
      </div>

      <MSection title="Histórico del inquilino">
        <MCard style={{ padding: 0 }}>
          {d.history.map(([month, label, tone], i) => (
            <div
              key={month}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
              }}
            >
              <Dot tone={tone as DotTone} size={8} />
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 13px var(--font-sans)" }}>{month}</div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)" }}
                >
                  {label}
                </div>
              </div>
              <span className="num" style={{ fontSize: 12, fontWeight: 500 }}>
                {d.amount}
              </span>
            </div>
          ))}
        </MCard>
      </MSection>

      <MSection title="Acciones tomadas">
        {d.actions.map(([title, meta, tone]) => (
          <div
            key={`${title}-${meta}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              background: "#fff",
              borderRadius: 10,
              border: "1px solid var(--ink-100)",
            }}
          >
            <Dot tone={tone as DotTone} size={7} />
            <div style={{ flex: 1, fontSize: 12 }}>
              <span style={{ fontWeight: 500 }}>{title}</span>
              <span
                className="mono"
                style={{ marginLeft: 6, fontSize: 10, color: "var(--ink-500)" }}
              >
                {meta}
              </span>
            </div>
          </div>
        ))}
      </MSection>

      <MStickyBar>
        <button
          type="button"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 10,
            border: "1px solid var(--ink-200)",
            background: "#fff",
            font: "500 13px var(--font-sans)",
            color: "var(--ink-700)",
          }}
        >
          Reenviar aviso
        </button>
        <button
          type="button"
          style={{
            flex: 1.4,
            height: 46,
            borderRadius: 10,
            border: "none",
            background: "var(--pp-500)",
            color: "#fff",
            font: "600 13px var(--font-sans)",
            boxShadow: "0 4px 14px rgba(110,58,255,0.25)",
          }}
        >
          Marcar como pagado
        </button>
      </MStickyBar>
    </div>
  );
}
