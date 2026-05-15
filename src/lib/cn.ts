/**
 * Une clases condicionalmente. Minimal — sin dependencias.
 * `cn("a", cond && "b", undefined)` → `"a b"`.
 */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
