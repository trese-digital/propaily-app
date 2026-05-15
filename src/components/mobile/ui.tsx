/**
 * Kit visual de la PWA mobile — primitivas presentacionales.
 *
 * Port tipado de los componentes del handoff
 * (`inbox/design_handoff_mobile_pwa/components/{ui-kit,extras,mobile}.jsx`).
 * Todo consume tokens de `globals.css` — sin hex sueltos. Sin `"use client"`:
 * son presentacionales (sin estado), válidos en Server Components.
 */
import type { CSSProperties, ReactNode } from "react";

/* ─────────────────────────── Botón ─────────────────────────── */

export type MBtnVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "icon"
  | "danger";
export type MBtnSize = "lg" | "md" | "sm";

const BTN_SIZE: Record<MBtnSize, CSSProperties> = {
  lg: { padding: "10px 16px", fontSize: 14, height: 40 },
  md: { padding: "8px 12px", fontSize: 13, height: 34 },
  sm: { padding: "6px 10px", fontSize: 12, height: 28 },
};

const BTN_VARIANT: Record<MBtnVariant, CSSProperties> = {
  primary: {
    background: "var(--pp-500)",
    color: "#fff",
    border: "1px solid transparent",
    boxShadow: "0 1px 2px rgba(27,8,83,0.2)",
  },
  secondary: {
    background: "#fff",
    color: "var(--ink-700)",
    border: "1px solid var(--ink-200)",
    boxShadow: "0 1px 2px rgba(27,8,83,0.04)",
  },
  ghost: {
    background: "transparent",
    color: "var(--ink-700)",
    border: "1px solid transparent",
  },
  icon: {
    background: "transparent",
    color: "var(--ink-600)",
    border: "1px solid var(--ink-200)",
    width: 32,
    height: 32,
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  danger: {
    background: "#fff",
    color: "var(--bad)",
    border: "1px solid var(--ink-200)",
  },
};

export function mBtnStyle(
  variant: MBtnVariant = "primary",
  size: MBtnSize = "lg",
  disabled = false,
): CSSProperties {
  const s = { ...BTN_SIZE[size], ...BTN_VARIANT[variant] };
  const fontSize = (s.fontSize as number) ?? 14;
  return {
    ...s,
    borderRadius: 8,
    font: `500 ${fontSize}px var(--font-sans)`,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: variant === "icon" ? "inline-flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    letterSpacing: "-0.005em",
  };
}

export function MBtn({
  children,
  variant = "primary",
  size = "lg",
  disabled = false,
  style = {},
  ...rest
}: {
  children: ReactNode;
  variant?: MBtnVariant;
  size?: MBtnSize;
  disabled?: boolean;
  style?: CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{ ...mBtnStyle(variant, size, disabled), ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── Badge ─────────────────────────── */

export type BadgeTone = "ok" | "warn" | "bad" | "violet" | "neutral" | "info";

const BADGE_TONE: Record<BadgeTone, { bg: string; fg: string; dot: string }> = {
  ok: { bg: "#ECFDF5", fg: "#065F46", dot: "#10B981" },
  warn: { bg: "#FFFBEB", fg: "#92400E", dot: "#F59E0B" },
  bad: { bg: "#FEF2F2", fg: "#991B1B", dot: "#EF4444" },
  info: { bg: "#EFF6FF", fg: "#1E3A8A", dot: "#3B82F6" },
  violet: { bg: "var(--pp-50)", fg: "var(--pp-700)", dot: "var(--pp-500)" },
  neutral: { bg: "var(--ink-50)", fg: "var(--ink-600)", dot: "var(--ink-400)" },
};

export function Badge({
  children,
  tone = "ok",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const t = BADGE_TONE[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 8px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        font: "500 11px var(--font-sans)",
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }}
      />
      {children}
    </span>
  );
}

/* ─────────────────────────── Chip ──────────────────────────── */

export function Chip({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        background: active ? "var(--pp-500)" : "var(--ink-50)",
        color: active ? "#fff" : "var(--ink-700)",
        border: active ? "none" : "1px solid var(--ink-200)",
        font: "500 12px var(--font-sans)",
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────── Avatar ────────────────────────── */

export type AvatarTone = "violet" | "ok" | "warn" | "bad" | "info" | "neutral";

const AVATAR_TONE: Record<AvatarTone, [string, string]> = {
  violet: ["var(--pp-300)", "var(--pp-700)"],
  ok: ["#A7F3D0", "#065F46"],
  warn: ["#FCD34D", "#92400E"],
  bad: ["#FCA5A5", "#991B1B"],
  info: ["#93C5FD", "#1E3A8A"],
  neutral: ["var(--ink-200)", "var(--ink-700)"],
};

export function Avatar({
  name = "",
  size = 28,
  tone = "violet",
}: {
  name?: string;
  size?: number;
  tone?: AvatarTone;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const [a, b] = AVATAR_TONE[tone];
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        flex: "0 0 auto",
        background: `linear-gradient(135deg, ${a}, ${b})`,
        color: "#fff",
        font: `600 ${Math.max(10, Math.round(size * 0.38))}px var(--font-sans)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textShadow: "0 1px 1px rgba(0,0,0,0.1)",
      }}
    >
      {initials}
    </span>
  );
}

/* ─────────────────────────── Dot ───────────────────────────── */

export type DotTone = "violet" | "ok" | "warn" | "bad" | "info" | "neutral";

const DOT_COLOR: Record<DotTone, string> = {
  violet: "var(--pp-500)",
  ok: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
  info: "var(--info)",
  neutral: "var(--ink-400)",
};

export function Dot({
  tone = "violet",
  size = 8,
}: {
  tone?: DotTone;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: DOT_COLOR[tone],
        display: "inline-block",
        flex: "0 0 auto",
      }}
    />
  );
}

/* ─────────────────────────── Progress ──────────────────────── */

export function Progress({
  value = 0,
  tone = "ok",
  height = 6,
  label,
  right,
}: {
  value?: number;
  tone?: DotTone;
  height?: number;
  label?: string;
  right?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {(label || right) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {label && (
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "var(--ink-500)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          )}
          {right && (
            <span
              className="mono num"
              style={{ fontSize: 11, color: "var(--ink-700)", fontWeight: 500 }}
            >
              {right}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height,
          borderRadius: 999,
          background: "var(--ink-100)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            height: "100%",
            background: DOT_COLOR[tone],
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── Layout mobile ─────────────────────── */

export function MStack({
  children,
  gap = 0,
  style = {},
}: {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export function MSection({
  title,
  action,
  children,
  gap = 8,
  style = {},
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ padding: "8px 18px 14px", ...style }}>
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          {title && (
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--ink-500)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {title}
            </span>
          )}
          <span style={{ flex: 1 }} />
          {action}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap }}>
        {children}
      </div>
    </div>
  );
}

export function MCard({
  children,
  style = {},
  accent = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${accent ? "var(--pp-200)" : "var(--ink-100)"}`,
        boxShadow: "var(--shadow-xs)",
        padding: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MetricMini({
  label,
  value,
  tone = "violet",
  small = false,
  mono = false,
}: {
  label: string;
  value: string;
  tone?: "violet" | "ok" | "warn" | "neutral";
  small?: boolean;
  mono?: boolean;
}) {
  const colors = {
    violet: "var(--pp-600)",
    ok: "var(--ok)",
    warn: "var(--warn)",
    neutral: "var(--ink-700)",
  };
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: "0.1em",
          color: "var(--ink-500)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        className={mono ? "mono num" : "num"}
        style={{
          font: `600 ${small ? 15 : 18}px var(--font-sans)`,
          color: colors[tone],
          letterSpacing: "-0.015em",
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function MFormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--ink-700)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function MSpeiRow({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{label}</span>
      <span
        className={mono ? "mono num" : undefined}
        style={{
          fontSize: 13,
          color: accent ? "var(--pp-700)" : "var(--ink-900)",
          fontWeight: accent ? 700 : 500,
          background: accent ? "var(--pp-50)" : "transparent",
          padding: accent ? "2px 8px" : 0,
          borderRadius: 4,
        }}
      >
        {value}
      </span>
    </div>
  );
}
