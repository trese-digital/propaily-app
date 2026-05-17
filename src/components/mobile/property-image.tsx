import type { CSSProperties } from "react";

interface PropertyImageProps {
  src?: string | null;
  alt: string;
  style?: CSSProperties;
  className?: string;
  fallbackStyle?: CSSProperties;
}

export function PropertyImage({
  src,
  alt,
  style,
  className,
  fallbackStyle
}: PropertyImageProps) {
  if (!src) {
    return (
      <div
        className={`pp-img-ph ${className || ""}`}
        style={{ ...style, ...fallbackStyle }}
        aria-label={`Placeholder para ${alt}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        objectFit: "cover",
        ...style
      }}
      className={className}
      loading="lazy"
    />
  );
}