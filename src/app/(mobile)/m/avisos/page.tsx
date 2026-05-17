/** 19 · Avisos · lista — datos reales (Fase 2a). */
import Link from "next/link";

import { IcCheck, IcSettings } from "@/components/icons";
import { MNotif } from "@/components/mobile/notif";
import { MTabBar } from "@/components/mobile/nav";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { Chip, MSection } from "@/components/mobile/ui";
import { getNotificationsData, resolveMobileRole } from "@/server/mobile/data";

export const metadata = { title: "Avisos · Propaily" };

export default async function NotificationsScreen() {
  const { ctx } = await resolveMobileRole();
  const { today, earlier, total, unread } = await getNotificationsData(ctx);

  return (
    <PullToRefresh>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--bg-muted)",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          padding: "var(--m-safe-top) 18px 14px",
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
          <h1
            style={{
              margin: 0,
              font: "600 22px var(--font-sans)",
              letterSpacing: "-0.015em",
              flex: 1,
            }}
          >
            Avisos
          </h1>
          <span style={iconBtn}>
            <IcCheck size={14} />
          </span>
          <span style={iconBtn}>
            <IcSettings size={14} />
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          <Chip active>Todos · {total}</Chip>
          <Chip>No leídos · {unread}</Chip>
        </div>
      </div>

      {total === 0 && (
        <div style={{ padding: "40px 32px", textAlign: "center" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink-700)",
              marginBottom: 4,
            }}
          >
            Sin avisos
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-500)" }}>
            Aquí verás renovaciones, pagos, avalúos y tareas.
          </div>
        </div>
      )}

      {today.length > 0 && (
        <MSection title="Hoy">
          {today.map((n) => (
            <Link key={n.id} href={`/m/avisos/${n.id}`}>
              <MNotif n={n} />
            </Link>
          ))}
        </MSection>
      )}

      {earlier.length > 0 && (
        <MSection title="Anteriores">
          {earlier.map((n) => (
            <Link key={n.id} href={`/m/avisos/${n.id}`}>
              <MNotif n={n} />
            </Link>
          ))}
        </MSection>
      )}

      <MTabBar active={4} />
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
