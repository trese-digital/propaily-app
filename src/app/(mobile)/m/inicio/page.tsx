/** 08 · Home del propietario (MobileHome del handoff). */
import Link from "next/link";

import { IcBell, IcChevR } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { Avatar, Badge, MSection } from "@/components/mobile/ui";
import {
  approvals,
  demoUser,
  portfolio,
  properties,
  upcomingPayments,
} from "@/features/mobile/demo-data";

export const metadata = { title: "Inicio · Propaily" };

export default function OwnerHomeScreen() {
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
          <Avatar name={demoUser.name} size={36} tone="warn" />
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
              {demoUser.account}
            </span>
            <div style={{ font: "600 16px var(--font-sans)" }}>
              Buenos días, {demoUser.name.split(" ")[0]}
            </div>
          </div>
          <Link
            href="/m/avisos"
            aria-label="Avisos"
            style={iconBtnStyle}
          >
            <IcBell size={16} />
          </Link>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "var(--pp-50)",
              border: "1px solid var(--pp-100)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 9,
                color: "var(--pp-700)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Patrimonio
            </div>
            <div
              className="num"
              style={{
                font: "600 20px var(--font-sans)",
                letterSpacing: "-0.015em",
                marginTop: 2,
              }}
            >
              {portfolio.patrimonio}
            </div>
            <div
              style={{ fontSize: 10, color: "var(--ok)", fontWeight: 600, marginTop: 1 }}
            >
              ↗ {portfolio.patrimonioDelta}
            </div>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid var(--ink-100)",
            }}
          >
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
              Renta del mes
            </div>
            <div
              className="num"
              style={{
                font: "600 20px var(--font-sans)",
                letterSpacing: "-0.015em",
                marginTop: 2,
              }}
            >
              {portfolio.rentaMes}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 1 }}>
              {portfolio.rentaMesNota}
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de aprobaciones */}
      <MSection gap={10} style={{ padding: "14px 18px 8px" }}>
        <Link
          href="/m/aprobar"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: 12,
            background: "#FFFBEB",
            borderRadius: 12,
            border: "1px solid #FDE68A",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--warn)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
              fontWeight: 700,
            }}
          >
            !
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 13px var(--font-sans)", color: "#92400E" }}>
              {approvals.length} cosas necesitan tu aprobación
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#92400E",
                opacity: 0.85,
                marginTop: 2,
              }}
            >
              Propuesta de renovación · avalúo BBVA
            </div>
          </div>
          <IcChevR size={16} style={{ color: "#92400E", alignSelf: "center" }} />
        </Link>
      </MSection>

      {/* Propiedades */}
      <MSection
        title={`Tus propiedades · ${properties.length}`}
        action={
          <span
            style={{ fontSize: 12, color: "var(--pp-600)", fontWeight: 600 }}
          >
            Ver todas
          </span>
        }
      >
        {properties.slice(0, 3).map((p) => (
          <Link
            key={p.id}
            href={`/m/propiedad/${p.id}`}
            style={{
              display: "flex",
              gap: 12,
              padding: 10,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              alignItems: "center",
            }}
          >
            <div
              className="pp-img-ph"
              style={{ width: 56, height: 56, borderRadius: 8, flex: "0 0 auto" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 14px var(--font-sans)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.name}
              </div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 1 }}
              >
                {p.colony}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <span
                  className="num"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {p.value}
                </span>
                <Badge tone={p.statusTone}>{p.status}</Badge>
              </div>
            </div>
            <IcChevR size={14} style={{ color: "var(--ink-400)" }} />
          </Link>
        ))}
      </MSection>

      {/* Próximos pagos */}
      <MSection title="Próximos pagos · 30 días">
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid var(--ink-100)",
            overflow: "hidden",
          }}
        >
          {upcomingPayments.map((r, i) => (
            <div
              key={r.tenant}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderTop: i > 0 ? "1px solid var(--ink-100)" : "none",
              }}
            >
              <Avatar name={r.tenant} size={28} tone={r.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    font: "500 13px var(--font-sans)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.tenant}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-500)" }}
                >
                  {r.property}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  className="num"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {r.amount}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color:
                      r.status === "vencido"
                        ? "var(--bad)"
                        : "var(--ink-500)",
                  }}
                >
                  {r.date}
                </div>
              </div>
              <Badge tone={r.tone}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </MSection>

      <MTabBar active={0} />
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
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
