/**
 * Navegación de la PWA mobile — tab bar inferior, top bar y page dots.
 * Server-safe: la navegación es vía `<Link>` (sin estado de cliente).
 */
import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { IcArrowR, IcBuilding, IcBell, IcChart, IcKey, IcUsers } from "@/components/icons";
import type { IconProps } from "@/components/icons";

/* ───────────────────────── Tab bar (5 tabs) ─────────────────── */

type TabItem = {
  id: string;
  label: string;
  href: Route;
  Icon: (p: IconProps) => ReactNode;
  dot?: boolean;
};

const TABS: TabItem[] = [
  { id: "inicio", label: "Inicio", href: "/m/inicio", Icon: IcChart },
  { id: "prop", label: "Propiedades", href: "/m/inicio", Icon: IcBuilding },
  { id: "rentas", label: "Rentas", href: "/m/pago", Icon: IcKey },
  { id: "avisos", label: "Avisos", href: "/m/avisos", Icon: IcBell, dot: true },
  { id: "yo", label: "Tú", href: "/m/perfil", Icon: IcUsers },
];

export function MTabBar({ active = 0 }: { active?: number }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 440,
        zIndex: 40,
        paddingBottom: "var(--m-safe-bottom)",
        paddingTop: 10,
        paddingInline: 8,
        borderTop: "1px solid var(--ink-100)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {TABS.map((it, i) => {
        const on = i === active;
        return (
          <Link
            key={it.id}
            href={it.href}
            aria-label={it.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: on ? "var(--pp-600)" : "var(--ink-500)",
              font: "500 10px var(--font-sans)",
              position: "relative",
              textDecoration: "none",
              minWidth: "var(--m-tap)",
            }}
          >
            <it.Icon size={22} />
            {it.label}
            {it.dot && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: 14,
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "var(--pp-500)",
                  border: "2px solid #fff",
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ───────────────────────── Top bar ─────────────────────────── */

export function MFlowTopBar({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: Route;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "calc(var(--m-safe-top)) 14px 12px",
        background: "#fff",
        borderBottom: "1px solid var(--ink-100)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Atrás"
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
          <IcArrowR size={14} style={{ transform: "rotate(180deg)" }} />
        </Link>
      ) : (
        <span style={{ width: 32 }} />
      )}
      <span
        style={{
          flex: 1,
          font: "600 16px var(--font-sans)",
          textAlign: "center",
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </span>
      {right || <span style={{ width: 32 }} />}
    </div>
  );
}

/* ─────────────────── Barra de acción pegajosa ───────────────── */

export function MStickyBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 440,
        zIndex: 40,
        background: "#fff",
        borderTop: "1px solid var(--ink-100)",
        padding: "12px 18px calc(var(--m-safe-bottom) + 4px)",
        display: "flex",
        gap: 8,
        boxShadow: "0 -8px 24px rgba(27,8,83,0.06)",
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Page dots ───────────────────────── */

export function PageDots({
  count = 3,
  active = 0,
  color = "#fff",
}: {
  count?: number;
  active?: number;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const on = i === active;
        const dotStyle: CSSProperties = {
          width: on ? 22 : 6,
          height: 6,
          borderRadius: 999,
          background: color,
          opacity: on ? 1 : 0.35,
          transition: "width .2s",
        };
        return <span key={i} style={dotStyle} />;
      })}
    </div>
  );
}
