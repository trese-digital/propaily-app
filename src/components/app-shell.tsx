import Link from "next/link";
import type { ReactNode } from "react";

import { logout } from "@/app/(auth)/login/actions";
import { AppRail } from "@/components/app-rail";
import { buildRailItems, APP_RAIL_WIDTH } from "@/components/app-rail-items";
import { IcBell } from "@/components/icons";
import { ConnectionStatus } from "@/components/pwa/connection-status";
import { DesktopTitlebar } from "@/components/pwa/desktop-titlebar";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { KeyboardShortcuts } from "@/components/pwa/keyboard-shortcuts";
import { Avatar, Button, initialsFrom } from "@/components/ui";
import { APP_VERSION } from "@/lib/version";
import type { AddonState } from "@/server/access/has-addon";

/** Desplazamiento del contenido bajo el titlebar WCO (0 fuera de la PWA). */
const TITLEBAR_OFFSET = "env(titlebar-area-height, 0px)";

export function AppShell({
  user,
  org,
  addons,
  unreadCount = 0,
  children,
}: {
  user: { name: string | null; email: string };
  org: string;
  addons: AddonState;
  unreadCount?: number;
  children: ReactNode;
}) {
  const railItems = buildRailItems(addons);
  const initials = initialsFrom(user.name ?? user.email);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "var(--bg-muted)",
        color: "var(--fg)",
        paddingTop: TITLEBAR_OFFSET,
      }}
    >
      <DesktopTitlebar />

      <div className="flex min-h-0 flex-1">
        <aside
          className="z-20 shrink-0 self-start sticky"
          style={{
            width: APP_RAIL_WIDTH,
            flexBasis: APP_RAIL_WIDTH,
            top: TITLEBAR_OFFSET,
            height: `calc(100vh - ${TITLEBAR_OFFSET})`,
          }}
        >
          <AppRail items={railItems} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            user={user}
            org={org}
            initials={initials}
            unreadCount={unreadCount}
          />
          <main className="min-w-0 flex-1" style={{ background: "var(--bg)" }}>
            {children}
          </main>
        </div>
      </div>

      <KeyboardShortcuts />
      <InstallPrompt />
      <ConnectionStatus />
    </div>
  );
}

function TopBar({
  user,
  org,
  initials,
  unreadCount,
}: {
  user: { name: string | null; email: string };
  org: string;
  initials: string;
  unreadCount: number;
}) {
  return (
    <header
      className="sticky z-10 flex items-center gap-4 px-6"
      style={{
        top: TITLEBAR_OFFSET,
        height: 56,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href="/"
        className="flex items-baseline gap-3 transition-opacity hover:opacity-80"
      >
        <span
          style={{
            font: "600 16px var(--font-sans)",
            color: "var(--color-pp-700)",
            letterSpacing: "-0.01em",
          }}
        >
          propaily
        </span>
        <span
          className="endoso"
          style={{ color: "var(--fg-muted)", paddingLeft: 12, borderLeft: "1px solid var(--border)" }}
        >
          {org}
          <span style={{ opacity: 0.7 }}> · V{APP_VERSION}</span>
        </span>
      </Link>

      <div className="flex-1" />

      <Link
        href="/propiedades"
        className="hidden items-center gap-2 px-3 transition-colors md:flex hover:border-(--color-pp-300)"
        style={{
          height: 34,
          minWidth: 320,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg-subtle)",
          color: "var(--fg-muted)",
          font: "400 13px var(--font-sans)",
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="flex-1">Buscar en propiedades…</span>
      </Link>

      <Link
        href="/propiedades/nueva"
        className="inline-flex items-center gap-2 px-3 transition-colors"
        style={{
          height: 34,
          borderRadius: 8,
          background: "var(--color-pp-500)",
          color: "#fff",
          font: "500 13px var(--font-sans)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva propiedad
      </Link>

      <Link
        href={"/avisos" as never}
        aria-label={
          unreadCount > 0 ? `Avisos · ${unreadCount} sin leer` : "Avisos"
        }
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-(--bg-muted) hover:text-ink-800"
      >
        <IcBell size={18} />
        {unreadCount > 0 && (
          <span
            className="mono absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
            style={{ background: "var(--color-pp-500)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-2">
        <Avatar initials={initials} size={28} />
        <form action={logout}>
          <Button type="submit" variant="secondary" size="sm">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
