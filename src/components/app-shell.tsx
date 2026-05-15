import Link from "next/link";
import type { ReactNode } from "react";

import { logout } from "@/app/(auth)/login/actions";
import { AppRail } from "@/components/app-rail";
import { buildRailItems, APP_RAIL_WIDTH } from "@/components/app-rail-items";
import { Avatar, Button, Kbd, initialsFrom } from "@/components/ui";
import { APP_VERSION } from "@/lib/version";
import type { AddonState } from "@/server/access/has-addon";

export function AppShell({
  user,
  org,
  addons,
  children,
}: {
  user: { name: string | null; email: string };
  org: string;
  addons: AddonState;
  children: ReactNode;
}) {
  const railItems = buildRailItems(addons);
  const initials = initialsFrom(user.name ?? user.email);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg-muted)", color: "var(--fg)" }}
    >
      <aside
        className="z-20 shrink-0 self-start sticky top-0 h-screen"
        style={{ width: APP_RAIL_WIDTH, flexBasis: APP_RAIL_WIDTH }}
      >
        <AppRail items={railItems} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} org={org} initials={initials} />
        <main className="min-w-0 flex-1" style={{ background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function TopBar({
  user,
  org,
  initials,
}: {
  user: { name: string | null; email: string };
  org: string;
  initials: string;
}) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-4 px-6"
      style={{
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

      <div
        className="hidden items-center gap-2 px-3 md:flex"
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
        <span className="flex-1">Buscar colonia, propiedad, folio…</span>
        <Kbd>⌘K</Kbd>
      </div>

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
