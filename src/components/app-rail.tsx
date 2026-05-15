"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import type { RailItem } from "@/components/app-rail-items";

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
