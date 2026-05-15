/**
 * Item de notificación de la PWA mobile + mapa tipo→icono.
 * Cubre los 9 tipos de aviso del Spec §5.
 */
import type { ReactNode } from "react";

import {
  IcBell,
  IcChart,
  IcCheck,
  IcDoc,
  IcSettings,
  IcSpark,
  IcUsers,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";

export type NotifType =
  | "overdue"
  | "doc-exp"
  | "mention"
  | "maintenance"
  | "payment"
  | "invite"
  | "valuation"
  | "approval"
  | "task";

type TypeStyle = { bg: string; c: string; Icon: (p: IconProps) => ReactNode };

export const TYPE_ICON: Record<NotifType, TypeStyle> = {
  overdue: { bg: "#FEF2F2", c: "#EF4444", Icon: IcBell },
  "doc-exp": { bg: "#FFFBEB", c: "#F59E0B", Icon: IcDoc },
  mention: { bg: "var(--pp-50)", c: "var(--pp-600)", Icon: IcUsers },
  maintenance: { bg: "#EFF6FF", c: "#3B82F6", Icon: IcSettings },
  payment: { bg: "#ECFDF5", c: "#10B981", Icon: IcCheck },
  invite: { bg: "var(--pp-50)", c: "var(--pp-600)", Icon: IcUsers },
  valuation: { bg: "#EFF6FF", c: "#3B82F6", Icon: IcChart },
  approval: { bg: "#ECFDF5", c: "#10B981", Icon: IcCheck },
  task: { bg: "var(--pp-50)", c: "var(--pp-600)", Icon: IcSpark },
};

export type NotifItem = {
  id: string;
  type: NotifType;
  t: string;
  body: string;
  time: string;
  read: boolean;
};

export function MNotif({ n }: { n: NotifItem }) {
  const t = TYPE_ICON[n.type] ?? TYPE_ICON.task;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 14,
        background: n.read ? "#fff" : "var(--pp-50)",
        borderRadius: 12,
        border: `1px solid ${n.read ? "var(--ink-100)" : "var(--pp-200)"}`,
        position: "relative",
      }}
    >
      {!n.read && (
        <span
          style={{
            position: "absolute",
            left: 4,
            top: "50%",
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--pp-500)",
            transform: "translateY(-50%)",
          }}
        />
      )}
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: t.bg,
          color: t.c,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <t.Icon size={16} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{ font: "600 13px var(--font-sans)", color: "var(--ink-900)" }}
        >
          {n.t}
        </div>
        <p
          style={{
            margin: "2px 0 6px",
            fontSize: 12,
            color: "var(--ink-600)",
            lineHeight: 1.4,
          }}
        >
          {n.body}
        </p>
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-500)" }}
        >
          {n.time}
        </span>
      </div>
    </div>
  );
}
