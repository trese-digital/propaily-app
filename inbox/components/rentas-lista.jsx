// Rentas B · Lista de contratos
// Vista de tabla densa con foco en ciclo del contrato: inquilino, vigencia,
// días para vencer, próximo pago.

const LEASES = [
  { name: 'Sofía Mendoza', email: 'sofia@correo.mx', prop: 'Casa Polanco 412', unit: 'Único', rent: 38000, dep: 76000, start: '01 jun 2024', end: '31 may 2026', nextDue: '01 jun 2026', status: 'por-vencer', days: 17, payDay: 1 },
  { name: 'Daniel Reyes', email: 'd.reyes@firma.com', prop: 'Edificio Roma 88', unit: 'A-302', rent: 24500, dep: 49000, start: '15 sep 2023', end: '14 sep 2026', nextDue: '15 may 2026', status: 'activo', days: 122, payDay: 15 },
  { name: 'Industrias Lumen SA', email: 'admin@lumen.mx', prop: 'Bodega Tlalpan', unit: '—', rent: 86000, dep: 172000, start: '01 ene 2022', end: '31 dic 2026', nextDue: '01 may 2026', status: 'vencido', days: -14, payDay: 1 },
  { name: 'Carolina Vargas', email: 'caro.v@correo.mx', prop: 'Edificio Roma 88', unit: 'B-104', rent: 22000, dep: 44000, start: '01 feb 2025', end: '31 ene 2027', nextDue: '01 jun 2026', status: 'activo', days: 261, payDay: 1 },
  { name: 'Café Quinto', email: 'hola@cafequinto.mx', prop: 'Local Del Valle 12', unit: 'A', rent: 31000, dep: 62000, start: '15 mar 2024', end: '14 mar 2027', nextDue: '15 may 2026', status: 'activo', days: 303, payDay: 15 },
  { name: 'Linda Torres', email: 'l.torres@vc.mx', prop: 'Penthouse Cuauhtémoc', unit: 'PH', rent: 52000, dep: 104000, start: '01 jul 2025', end: '30 jun 2027', nextDue: '01 jun 2026', status: 'activo', days: 411, payDay: 1 },
  { name: 'Carlos y Mariana', email: 'cym@correo.mx', prop: 'Loft Condesa', unit: 'Único', rent: 19500, dep: 39000, start: '01 oct 2024', end: '30 sep 2026', nextDue: '01 may 2026', status: 'vencido', days: -14, payDay: 1 },
  { name: 'Despacho Mireles', email: 'admin@mireles.legal', prop: 'Edificio Roma 88', unit: 'oficina C-201', rent: 28000, dep: 56000, start: '01 abr 2025', end: '31 mar 2027', nextDue: '01 jun 2026', status: 'borrador', days: null, payDay: 1 },
];

const RentasLista = () => {
  return (
    <AppShell active="rentas" breadcrumb={['Portafolio interno', 'Rentas', 'Contratos']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Tabs items={[
          ['contratos', 'Contratos', 8],
          ['pagos', 'Pagos del mes', 23],
          ['calendario', 'Calendario'],
          ['inquilinos', 'Inquilinos', 8],
        ]} active="contratos" />

        {/* Header */}
        <div style={{ padding: '20px 28px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Contratos de arrendamiento
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>
              8 vigentes · 2 por vencer en 30 días · 2 con renta vencida · ingreso esperado <span className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 600 }}>$321,000/mes</span>
            </p>
          </div>
          <Btn variant="secondary" size="md"><IcDownload size={14}/> Exportar</Btn>
          <Btn size="md"><IcPlus size={14}/> Nuevo contrato</Btn>
        </div>

        {/* Filter chips */}
        <div style={{ padding: '0 28px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterChip label="Estatus" value="Todos · Vencido" highlighted />
          <FilterChip label="Propiedad" value="Todas" />
          <FilterChip label="Vence en" value="≤ 90 días" />
          <FilterChip label="Inquilino" icon={<IcSearch size={12}/>} />
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Ordenar:</span>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            border: '1px solid var(--ink-200)', borderRadius: 8, background: '#fff', fontSize: 13, color: 'var(--ink-700)',
          }}>Vencimiento <IcChevD size={12} style={{ color: 'var(--ink-500)' }} /></div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 28px' }}>
          <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2.2fr 2fr 1fr 1fr 1.3fr 1fr 36px',
              padding: '12px 18px', background: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--ink-100)',
              font: '500 11px var(--font-mono)', color: 'var(--ink-500)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              <span>Inquilino</span>
              <span>Propiedad · Unidad</span>
              <span>Renta · Día pago</span>
              <span>Próximo</span>
              <span>Vigencia</span>
              <span>Estatus</span>
              <span></span>
            </div>
            {LEASES.map((l, i) => <LeaseRow key={l.name} l={l} zebra={i % 2 === 1} last={i === LEASES.length - 1} />)}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const LeaseRow = ({ l, zebra, last }) => {
  const tones = { activo: 'ok', 'por-vencer': 'warn', vencido: 'bad', borrador: 'neutral' };
  const labels = { activo: 'Activo', 'por-vencer': 'Por vencer', vencido: 'Renta vencida', borrador: 'Borrador' };
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2.2fr 2fr 1fr 1fr 1.3fr 1fr 36px',
      padding: '14px 18px', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid var(--ink-100)',
      background: zebra ? 'var(--bg-muted)' : '#fff', fontSize: 13,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Avatar name={l.name} size={32} tone={l.status === 'vencido' ? 'bad' : 'violet'} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 500, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.email}</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: 'var(--ink-900)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.prop}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{l.unit}</div>
      </div>
      <div>
        <div className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{fmtMxn(l.rent)}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>día {l.payDay}</div>
      </div>
      <div>
        <div className="mono num" style={{
          color: l.status === 'vencido' ? 'var(--bad)' : 'var(--ink-900)',
          fontWeight: 600,
        }}>{l.nextDue}</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
          {l.status === 'vencido' ? `vencido ${Math.abs(l.days)}d` : l.status === 'borrador' ? '—' : `en ${l.days}d`}
        </div>
      </div>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--ink-500)' }}>{l.start}</span>
          <IcArrowR size={10} style={{ color: 'var(--ink-400)' }} />
          <span>{l.end}</span>
        </div>
        <LeaseLifeBar status={l.status} days={l.days} />
      </div>
      <div><Badge tone={tones[l.status]}>{labels[l.status]}</Badge></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="icon"><IcMore size={14}/></Btn>
      </div>
    </div>
  );
};

const LeaseLifeBar = ({ status, days }) => {
  // 0-100% of life — synthetic.
  const pct = status === 'vencido' ? 96 : status === 'por-vencer' ? 92 : status === 'borrador' ? 0 : Math.min(85, 30 + (730 - Math.max(0, days || 0)) / 730 * 50);
  const tone = status === 'vencido' ? 'bad' : status === 'por-vencer' ? 'warn' : 'violet';
  return (
    <div style={{ marginTop: 4, height: 4, borderRadius: 999, background: 'var(--ink-100)', overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: tone === 'bad' ? '#EF4444' : tone === 'warn' ? '#F59E0B' : 'var(--pp-500)',
      }} />
    </div>
  );
};

Object.assign(window, { RentasLista, LeaseRow });
