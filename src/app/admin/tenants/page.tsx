export default function AdminTenantsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Cuentas y suscripciones
        </h1>
      </header>
      <Stub
        title="En construcción"
        body="Listado de ManagementCompany con su Subscription, plan, addons activos, fechas. Hoy se activan vía `node scripts/seed-subscription.mjs`."
      />
    </div>
  );
}

function Stub({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
        Próximamente
      </p>
      <h2 className="mt-2 text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-muted)]">{body}</p>
    </div>
  );
}
