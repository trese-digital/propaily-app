/**
 * Iconos del sistema — stroke minimal, viewBox 24, `currentColor`.
 * Port tipado de `inbox/components/icons.jsx`. Estética tech (Linear-like):
 * stroke 1.6, joins redondeados.
 *
 * Sin `"use client"` — son SVG puros, válidos en Server y Client Components.
 */
import type { CSSProperties, ReactNode } from "react";

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
};

function Ic({
  children,
  size = 18,
  strokeWidth = 1.6,
  className,
  style,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "block", flex: "0 0 auto", ...style }}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IcMap = (p: IconProps) => (
  <Ic {...p}>
    <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
    <path d="M9 3v16M15 5v16" />
  </Ic>
);
export const IcBuilding = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
  </Ic>
);
export const IcChart = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 3 3 5-6" />
  </Ic>
);
export const IcCalc = (p: IconProps) => (
  <Ic {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
  </Ic>
);
export const IcDoc = (p: IconProps) => (
  <Ic {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Ic>
);
export const IcUsers = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4a3.5 3.5 0 0 1 0 7" />
    <path d="M22 20a6.5 6.5 0 0 0-5-6.3" />
  </Ic>
);
export const IcSearch = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Ic>
);
export const IcSettings = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.7.39 1 .7" />
  </Ic>
);
export const IcBell = (p: IconProps) => (
  <Ic {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </Ic>
);
export const IcPlus = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 5v14M5 12h14" />
  </Ic>
);
export const IcFilter = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z" />
  </Ic>
);
export const IcGrid = (p: IconProps) => (
  <Ic {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Ic>
);
export const IcList = (p: IconProps) => (
  <Ic {...p}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </Ic>
);
export const IcChevR = (p: IconProps) => (
  <Ic {...p}>
    <path d="m9 6 6 6-6 6" />
  </Ic>
);
export const IcChevD = (p: IconProps) => (
  <Ic {...p}>
    <path d="m6 9 6 6 6-6" />
  </Ic>
);
export const IcArrowUR = (p: IconProps) => (
  <Ic {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Ic>
);
export const IcPin = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </Ic>
);
export const IcLayers = (p: IconProps) => (
  <Ic {...p}>
    <path d="m12 2 10 6-10 6L2 8l10-6Z" />
    <path d="m2 16 10 6 10-6" />
    <path d="m2 12 10 6 10-6" />
  </Ic>
);
export const IcCmd = (p: IconProps) => (
  <Ic {...p}>
    <path d="M9 6a3 3 0 1 0-3 3h3V6Zm0 0v12m0 0a3 3 0 1 1-3-3h3v3Zm0 0h6m0 0a3 3 0 1 0 3-3h-3v3Zm0 0V6m0 0a3 3 0 1 1 3 3h-3V6Z" />
  </Ic>
);
export const IcDownload = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 4v12m0 0-4-4m4 4 4-4M4 18v2h16v-2" />
  </Ic>
);
export const IcEdit = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
    <path d="m14 6 4 4" />
  </Ic>
);
export const IcMore = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="5" cy="12" r="1.2" />
    <circle cx="12" cy="12" r="1.2" />
    <circle cx="19" cy="12" r="1.2" />
  </Ic>
);
export const IcArrowR = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ic>
);
export const IcShield = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
  </Ic>
);
export const IcSpark = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </Ic>
);
export const IcCheck = (p: IconProps) => (
  <Ic {...p}>
    <path d="m5 12 5 5 9-11" />
  </Ic>
);
export const IcX = (p: IconProps) => (
  <Ic {...p}>
    <path d="M6 6 18 18M6 18 18 6" />
  </Ic>
);
export const IcPhoto = (p: IconProps) => (
  <Ic {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="m3 18 5-5 4 4 3-3 6 6" />
  </Ic>
);
export const IcKey = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9M16 7l3 3M14 9l3 3" />
  </Ic>
);
export const IcArrowUp = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Ic>
);
export const IcArrowDown = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </Ic>
);
export const IcHome = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 11 12 3l9 8" />
    <path d="M5 10v10h4v-6h6v6h4V10" />
  </Ic>
);
