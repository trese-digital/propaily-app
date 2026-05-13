import Link from "next/link";
import type { ReactNode } from "react";

import { logout } from "@/app/(auth)/login/actions";
import { AppRail, APP_RAIL_ITEMS, APP_RAIL_WIDTH } from "@/components/app-rail";

export function AppShell({
  user,
  org,
  children,
}: {
  user: { name: string | null; email: string };
  org: string;
  children: ReactNode;
}) {
  const initials = (user.name ?? user.email)
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "U";

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg-muted)", color: "var(--fg)" }}
    >
      <aside
        className="z-20 shrink-0 self-start sticky top-0 h-screen"
        style={{ width: APP_RAIL_WIDTH, flexBasis: APP_RAIL_WIDTH }}
      >
        <AppRail items={APP_RAIL_ITEMS} />
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
        <kbd
          className="mono"
          style={{
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--fg-muted)",
          }}
        >
          ⌘K
        </kbd>
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
        <span
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "linear-gradient(135deg, var(--color-pp-400), var(--color-pp-700))",
            color: "#fff",
            font: "600 11px var(--font-sans)",
          }}
          aria-hidden
        >
          {initials}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="cursor-pointer transition-colors"
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 6,
              background: "transparent",
              color: "var(--fg-muted)",
              border: "1px solid var(--border)",
              font: "500 11px var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
