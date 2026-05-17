/** 17 · Home del operador GFC — datos reales (Fase 2a). */
import Link from "next/link";
import { redirect } from "next/navigation";

import { IcBell, IcKey, IcSettings } from "@/components/icons";
import { MTabBar } from "@/components/mobile/nav";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { Avatar, MSection } from "@/components/mobile/ui";
import { getOperatorToday, resolveMobileRole } from "@/server/mobile/data";

export const metadata = { title: "Hoy · Propaily Operador" };

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function AdminHomeScreen() {
  const { ctx, role } = await resolveMobileRole();
  if (role === "owner") redirect("/m/inicio");

  const a = await getOperatorToday(ctx);

  return (
    <PullToRefresh>
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-500)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {a.company} · Operador
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
            padding: 14,
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
            Hoy · {dateFmt.format(new Date())}
          </div>
          <div
            style={{
              font: "600 22px var(--font-sans)",
              marginTop: 4,
              letterSpacing: "-0.015em",
              position: "relative",
            }}
          >
            {a.counts.tasks} tarea{a.counts.tasks === 1 ? "" : "s"} ·{" "}
            {a.counts.maintenance} mantenimiento
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {a.counts.maintenance} mantenimiento
            </span>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                background:
                  a.counts.overdue > 0
                    ? "rgba(239,68,68,0.30)"
                    : "rgba(255,255,255,0.15)",
                color: a.counts.overdue > 0 ? "#FCA5A5" : "#fff",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {a.counts.overdue} cobro{a.counts.overdue === 1 ? "" : "s"} vencido
              {a.counts.overdue === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* Cobranza acceso */}
      <MSection title="Cobranza">
        <Link
          href="/m/cobranza"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 14,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid var(--ink-100)",
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: "var(--pp-50)",
              color: "var(--pp-600)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IcKey size={18} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 13px var(--font-sans)" }}>
              Ver cobranza del mes
            </div>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--ink-500)" }}
            >
              {a.counts.overdue} pago(s) vencido(s) por gestionar
            </div>
          </div>
        </Link>
      </MSection>

      {/* Urgentes */}
      <MSection title={`Necesitan acción · ${a.urgent.length}`}>
        {a.urgent.length === 0 && (
          <div
            style={{
              padding: 20,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--ink-100)",
              textAlign: "center",
              fontSize: 13,
              color: "var(--ink-500)",
            }}
          >
            Sin tareas urgentes. Buen trabajo. ✨
          </div>
        )}
        {a.urgent.map((it) => (
          <div
            key={it.id}
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
              <IcSettings size={17} />
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
          </div>
        ))}
      </MSection>

      <MTabBar active={0} />
    </div>
    </PullToRefresh>
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
