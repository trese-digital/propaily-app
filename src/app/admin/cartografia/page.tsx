export default function AdminCartografiaPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          Backoffice GF · vincular catastro
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Cartografía
        </h1>
      </header>

      <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-pp-700)]">
          Próximamente · Fase 5b
        </p>
        <h2 className="mt-2 text-base font-semibold">Buscar propiedades sin lote</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-muted)]">
          Listado cross-tenant de Property sin `cartoPredioId` + acción para vincular con lote del
          catastro. El visor `/cartografia` ya hace esto desde el lado cliente; aquí se hace en
          batch por GF.
        </p>
      </div>
    </div>
  );
}
