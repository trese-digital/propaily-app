/** SensitivityPill — marca la sensibilidad de un documento. */
import { IcShield } from "@/components/icons";
import { cn } from "@/lib/cn";

export function SensitivityPill({
  level,
  className,
}: {
  level: "normal" | "sensible";
  className?: string;
}) {
  const sensible = level === "sensible";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium",
        sensible
          ? "border-pp-200 bg-pp-50 text-pp-700"
          : "border-ink-200 bg-ink-50 text-ink-600",
        className,
      )}
    >
      <IcShield size={12} />
      Sensibilidad · {level}
    </span>
  );
}
