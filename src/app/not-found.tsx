import Link from "next/link";

/**
 * 404 global. Se monta dentro del root layout (sin AppShell), así que es una
 * pantalla autónoma y centrada.
 */
export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-5 px-8 text-center"
      style={{ background: "var(--bg-muted)", color: "var(--fg)" }}
    >
      <span
        className="mono text-[13px] uppercase tracking-[0.18em]"
        style={{ color: "var(--color-pp-600)" }}
      >
        Error 404
      </span>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">
        Esta página no existe
      </h1>
      <p className="max-w-[380px] text-[13px] leading-relaxed text-ink-500">
        El enlace pudo haber cambiado o la propiedad ya no está disponible.
        Vuelve al inicio y navega desde el portafolio.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-lg bg-pp-500 px-4 text-sm font-medium text-white transition-colors hover:bg-pp-600"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
