"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type RailItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  matchPrefix?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
};

export function AppRail({ items, activeId }: { items: RailItem[]; activeId?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      aria-label="Módulos"
      className="flex h-full w-full flex-col items-center gap-1 py-4"
      style={{ background: "var(--color-ink-900)", color: "#fff" }}
    >
      {/* Isotipo P */}
      <Link href="/" aria-label="Propaily — inicio" className="mb-3">
        <span
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--color-pp-500)",
            color: "#fff",
            font: "600 16px var(--font-sans)",
          }}
        >
          P
        </span>
      </Link>

      {items.map((it) => {
        const isActive =
          it.active ??
          (activeId
            ? activeId === it.id
            : it.matchPrefix
              ? pathname === it.matchPrefix || pathname.startsWith(it.matchPrefix + "/")
              : it.href
                ? pathname === it.href
                : false);

        const base =
          "relative flex h-10 w-10 items-center justify-center border-0 bg-transparent transition-colors";
        const stateClass = it.disabled
          ? "opacity-30 cursor-not-allowed"
          : isActive
            ? "cursor-pointer"
            : "cursor-pointer hover:bg-white/10";

        const inner = (
          <>
            {isActive && !it.disabled && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: -4,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  borderRadius: 999,
                  background: "var(--color-pp-400)",
                }}
              />
            )}
            <span
              aria-hidden
              style={{
                color: isActive
                  ? "#fff"
                  : it.disabled
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.7)",
                background: isActive ? "rgba(110,58,255,0.22)" : "transparent",
                borderRadius: 8,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {it.icon}
            </span>
          </>
        );

        if (!it.disabled && it.href && !it.onClick) {
          return (
            <Link
              key={it.id}
              href={it.href as never}
              title={it.label}
              aria-label={it.label}
              className={`${base} ${stateClass}`}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={it.id}
            type="button"
            disabled={it.disabled}
            onClick={
              it.onClick ?? (it.href && !it.disabled ? () => router.push(it.href as never) : undefined)
            }
            title={it.label + (it.disabled ? " · próximamente" : "")}
            aria-label={it.label}
            className={`${base} ${stateClass}`}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const RailIcons = {
  Home: (
    <svg viewBox="0 0 24 24" width="18" height="18" {...stroke}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h4v-6h6v6h4V10" />
    </svg>
  ),
  Map: (
    <svg viewBox="0 0 24 24" width="18" height="18" {...stroke}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  Properties: (
    <svg viewBox="0 0 24 24" width="18" height="18" {...stroke}>
      <path d="M3 21V9l6-4 6 4v12" />
      <path d="M15 21V12l6-3v12" />
      <path d="M3 21h18" />
    </svg>
  ),
  Insights: (
    <svg viewBox="0 0 24 24" width="18" height="18" {...stroke}>
      <path d="M3 20V10" />
      <path d="M9 20V4" />
      <path d="M15 20v-7" />
      <path d="M21 20v-12" />
    </svg>
  ),
  Calculator: (
    <svg viewBox="0 0 24 24" width="18" height="18" {...stroke}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="13" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="10" y2="16" />
      <line x1="13" y1="16" x2="16" y2="16" />
    </svg>
  ),
};

/**
 * Construye los ítems del rail según los addons habilitados para la cuenta.
 * Home y Propiedades son CORE — siempre presentes. Addons aparecen como
 * disabled cuando la Subscription no los incluye, para que el cliente vea que
 * existen y pueda pedir el upgrade. El gating real de acceso vive en el server
 * (route handlers + page server components), no acá.
 */
export function buildRailItems(addons: {
  cartografia: boolean;
  insights: boolean;
  calculadoras: boolean;
}): RailItem[] {
  return [
    { id: "home", label: "Inicio", icon: RailIcons.Home, href: "/" },
    {
      id: "propiedades",
      label: "Propiedades",
      icon: RailIcons.Properties,
      href: "/propiedades",
      matchPrefix: "/propiedades",
    },
    {
      id: "cartografia",
      label: addons.cartografia ? "Cartografía" : "Cartografía · addon",
      icon: RailIcons.Map,
      href: addons.cartografia ? "/cartografia" : undefined,
      matchPrefix: "/cartografia",
      disabled: !addons.cartografia,
    },
    {
      id: "insights",
      label: addons.insights ? "Insights" : "Insights · addon",
      icon: RailIcons.Insights,
      disabled: !addons.insights,
    },
    {
      id: "calculadoras",
      label: addons.calculadoras ? "Calculadoras" : "Calculadoras · addon",
      icon: RailIcons.Calculator,
      disabled: !addons.calculadoras,
    },
  ];
}

export const APP_RAIL_WIDTH = 56;
