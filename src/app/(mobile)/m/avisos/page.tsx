/** 19 · Avisos · lista (MobileNotif del handoff). */
import Link from "next/link";

import { IcCheck, IcSettings } from "@/components/icons";
import { MNotif } from "@/components/mobile/notif";
import { MTabBar } from "@/components/mobile/nav";
import { Chip, MSection } from "@/components/mobile/ui";
import {
  notificationsToday,
  notificationsYesterday,
} from "@/features/mobile/demo-data";

export const metadata = { title: "Avisos · Propaily" };

export default function NotificationsScreen() {
  const total = notificationsToday.length + notificationsYesterday.length;
  const unread = [...notificationsToday, ...notificationsYesterday].filter(
    (n) => !n.read,
  ).length;

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
          <Chip>Pagos</Chip>
          <Chip>Tareas</Chip>
        </div>
      </div>

      <MSection title="Hoy">
        {notificationsToday.map((n) => (
          <Link key={n.id} href={`/m/avisos/${n.id}`}>
            <MNotif n={n} />
          </Link>
        ))}
      </MSection>

      <MSection title="Ayer">
        {notificationsYesterday.map((n) => (
          <Link key={n.id} href={`/m/avisos/${n.id}`}>
            <MNotif n={n} />
          </Link>
        ))}
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
