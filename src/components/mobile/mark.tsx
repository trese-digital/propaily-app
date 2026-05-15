/**
 * Isotipo de Propaily — la "P" extraída del wordmark.
 * SVG puro: válido en Server y Client Components. Port de
 * `inbox/design_handoff_mobile_pwa/components/logo.jsx` (PropailyMark).
 */
import type { CSSProperties } from "react";

type MarkProps = {
  size?: number;
  bg?: string;
  fg?: string;
  radius?: number;
  style?: CSSProperties;
};

export function PropailyMark({
  size = 32,
  bg = "var(--pp-500)",
  fg = "#fff",
  radius = 8,
  style = {},
}: MarkProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 38 68"
        height={size * 0.62}
        style={{ display: "block", overflow: "visible" }}
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,35.26c0-11.97,8.08-19.11,18.96-19.11s19.25,7.71,19.25,19.18c0,12.4-9.23,18.31-17.3,18.31-4.25,0-7.86-1.66-10.09-4.83v19.11H0v-32.66ZM27.25,34.9c0-5.12-3.32-8.65-8.22-8.65s-8.22,3.53-8.22,8.65,3.32,8.65,8.22,8.65,8.22-3.53,8.22-8.65Z"
        />
      </svg>
    </span>
  );
}
