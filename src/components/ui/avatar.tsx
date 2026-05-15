/** Avatar — círculo con iniciales sobre gradiente morado. */
import { cn } from "@/lib/cn";

/** Deriva hasta 2 iniciales de un nombre o email. */
export function initialsFrom(value: string): string {
  const parts = value
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "");
  return parts.join("") || "U";
}

export function Avatar({
  initials,
  size = 32,
  className,
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background:
          "linear-gradient(135deg, var(--color-pp-400), var(--color-pp-700))",
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
