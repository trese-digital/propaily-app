/** 12 · Próximo pago del inquilino · SPEI (MobilePago del handoff). */
import Link from "next/link";

import { IcArrowR, IcCheck, IcDownload, IcMore } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { MCard, MSection, MSpeiRow } from "@/components/mobile/ui";
import { tenantPayment } from "@/features/mobile/demo-data";

export const metadata = { title: "Tu pago · Propaily" };

export default function PaymentScreen() {
  const p = tenantPayment;

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
          padding: "var(--m-safe-top) 18px 8px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link href="/m/inicio" aria-label="Atrás" style={iconBtn}>
          <IcArrowR size={14} style={{ transform: "rotate(180deg)" }} />
        </Link>
        <span
          style={{
            flex: 1,
            font: "600 16px var(--font-sans)",
            textAlign: "center",
          }}
        >
          Tu pago
        </span>
        <span style={iconBtn}>
          <IcMore size={14} />
        </span>
      </div>

      {/* Hero del pago */}
      <div style={{ padding: "14px 14px 0" }}>
        <div
          style={{
            padding: 22,
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, var(--pp-500) 0%, var(--pp-700) 100%)",
            color: "#fff",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ position: "relative" }}>
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Próximo pago
            </span>
            <div
              className="num"
              style={{
                font: "600 44px/1 var(--font-sans)",
                letterSpacing: "-0.025em",
                marginTop: 4,
              }}
            >
              {p.amount}
            </div>
            <span style={{ fontSize: 13, opacity: 0.85 }}>
              {p.currency} · {p.property}
            </span>

            <div
              style={{
                marginTop: 20,
                padding: "12px 14px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#fff",
                  color: "var(--pp-700)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 8, letterSpacing: "0.08em", fontWeight: 600 }}
                >
                  {p.dueMonth}
                </span>
                <span
                  className="mono"
                  style={{ font: "700 18px var(--font-sans)", lineHeight: 1 }}
                >
                  {p.dueDay}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 13px var(--font-sans)" }}>
                  {p.dueLabel}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}
                >
                  {p.dueDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div
        style={{
          padding: "14px 14px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          type="button"
          style={{
            height: 52,
            borderRadius: 12,
            border: "none",
            background: "var(--ink-900)",
            color: "#fff",
            font: "600 15px var(--font-sans)",
          }}
        >
          Pagar ahora con SPEI
        </button>
        <Link
          href="/m/pago/comprobante"
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid var(--ink-200)",
            background: "#fff",
            color: "var(--ink-700)",
            font: "500 14px var(--font-sans)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <IcDownload size={13} style={{ transform: "rotate(180deg)" }} /> Subir
          comprobante
        </Link>
      </div>

      {/* Datos SPEI */}
      <MSection title="Datos para SPEI">
        <MCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {p.spei.map((row) => (
              <MSpeiRow
                key={row.label}
                label={row.label}
                value={row.value}
                mono={row.mono}
                accent={row.accent}
              />
            ))}
          </div>
        </MCard>
      </MSection>

      {/* Historial */}
      <MSection title="Tus últimos pagos">
        <MCard style={{ padding: 0 }}>
          {p.history.map(([month, amount, date, status], i) => (
            <div
              key={month}
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
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: status === "pagado" ? "#ECFDF5" : "#FFFBEB",
                  color: status === "pagado" ? "var(--ok)" : "var(--warn)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IcCheck size={14} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: "500 13px var(--font-sans)" }}>{month}</div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)" }}
                >
                  {status === "pagado"
                    ? "Confirmado"
                    : "Pagado · 1 día tarde"}{" "}
                  · {date}
                </div>
              </div>
              <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>
                {amount}
              </span>
            </div>
          ))}
        </MCard>
      </MSection>

      <MTabBar active={3} />
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
