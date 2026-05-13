"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { logout } from "@/app/(auth)/login/actions";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  matchPrefix?: string;
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Resumen",
    icon: <IconSquares />,
  },
  {
    href: "/admin/tenants",
    label: "Cuentas",
    icon: <IconBuilding />,
    matchPrefix: "/admin/tenants",
  },
  {
    href: "/admin/avaluos",
    label: "Avalúos",
    icon: <IconScale />,
    matchPrefix: "/admin/avaluos",
  },
  {
    href: "/admin/cartografia",
    label: "Cartografía",
    icon: <IconMap />,
    matchPrefix: "/admin/cartografia",
  },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string | null; email: string };
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const initials =
    (user.name ?? user.email)
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className="min-h-screen bg-[var(--color-ink-50)] text-[var(--fg)]">
      <TopBar
        initials={initials}
        onToggleMenu={() => setMobileOpen((v) => !v)}
        mobileOpen={mobileOpen}
      />

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Sidebar desktop (md+) + overlay drawer mobile */}
        <SideNav pathname={pathname} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function TopBar({
  initials,
  onToggleMenu,
  mobileOpen,
}: {
  initials: string;
  onToggleMenu: () => void;
  mobileOpen: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--color-ink-900)] px-4 text-white md:px-6"
    >
      {/* Hamburger — solo mobile */}
      <button
        type="button"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileOpen}
        onClick={onToggleMenu}
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10 md:hidden"
      >
        {mobileOpen ? <IconClose /> : <IconHamburger />}
      </button>

      <Link href={"/admin" as never} className="flex items-baseline gap-3 transition-opacity hover:opacity-80">
        <span className="text-base font-semibold tracking-tight text-white md:text-lg">
          propaily
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-pp-300)]">
          admin · gf
        </span>
      </Link>

      <div className="flex-1" />

      <div className="hidden items-center gap-2 text-xs text-white/70 md:flex">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-pp-400)] to-[var(--color-pp-700)] text-[11px] font-semibold">
          {initials}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="h-7 cursor-pointer rounded-md border border-white/15 bg-transparent px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white/70 transition-colors hover:bg-white/10"
          >
            Salir
          </button>
        </form>
      </div>

      {/* Mobile: avatar + logout */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-pp-400)] to-[var(--color-pp-700)] text-[10px] font-semibold">
          {initials}
        </span>
      </div>
    </header>
  );
}

function SideNav({
  pathname,
  mobileOpen,
  onClose,
}: {
  pathname: string;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay tap-to-close en mobile */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 top-14 z-30 w-64 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] transition-transform md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3" aria-label="Navegación admin">
          {NAV.map((it) => {
            const active = it.matchPrefix
              ? pathname === it.matchPrefix || pathname.startsWith(it.matchPrefix + "/")
              : pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href as never}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--color-pp-700)]"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                <span aria-hidden className="shrink-0">
                  {it.icon}
                </span>
                <span className="truncate">{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3 rounded-md border border-[var(--border)] bg-[var(--bg-muted)] p-3 text-xs text-[var(--fg-muted)]">
          <p className="m-0 mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
            Backoffice GF
          </p>
          <p className="m-0 leading-snug">
            Acceso cross-tenant. Cada acción queda registrada en AuditLog.
          </p>
        </div>
      </aside>
    </>
  );
}

/* ── Iconos (SVG inline, neutral stroke=currentColor) ────────────── */

function IconSquares() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 9h2a2 2 0 0 1 2 2v10" />
      <path d="M8 7h4M8 11h4M8 15h4" />
    </svg>
  );
}
function IconScale() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M6 8h12" />
      <path d="m6 8-3 6a3 3 0 0 0 6 0z" />
      <path d="m18 8-3 6a3 3 0 0 0 6 0z" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
function IconHamburger() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
