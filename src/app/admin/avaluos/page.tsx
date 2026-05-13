import { db } from "@/server/db/client";

export default async function AdminAvaluosPage() {
  const pendientes = await db.valuationRequest.count({ where: { status: "pending" } });
  const enProgreso = await db.valuationRequest.count({ where: { status: "in_progress" } });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF · servicio profesional
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Avalúos
        </h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {pendientes} pendiente{pendientes === 1 ? "" : "s"} · {enProgreso} en progreso
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
          Próximamente · Fase 5b
        </p>
        <h2 className="mt-2 text-base font-semibold">Cola + alta directa</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-muted)]">
          Cola de ValuationRequests + acción para crear `Valuation` (append-only) directo en
          propiedades para onboarding y actualización anual.
        </p>
      </div>
    </div>
  );
}
