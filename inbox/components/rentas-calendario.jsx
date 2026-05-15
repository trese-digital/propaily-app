// Rentas A · Calendario de pagos
// Timeline mensual: filas = inquilinos, columnas = meses, celdas = estatus de pago.
// Vista "salud financiera" del portafolio. Colorida y expresiva en data.

const RENT_TENANTS = [
  { name: 'Sofía Mendoza',     unit: 'Casa Polanco 412 · PB',     amount: 38000, since: 'jun 2024', tone: 'violet' },
  { name: 'Daniel Reyes',      unit: 'Roma 88 · A-302',           amount: 24500, since: 'sep 2023', tone: 'ok' },
  { name: 'Carolina Vargas',   unit: 'Roma 88 · B-104',           amount: 22000, since: 'feb 2025', tone: 'info' },
  { name: 'Industrias Lumen',  unit: 'Bodega Tlalpan · 1',        amount: 86000, since: 'ene 2022', tone: 'warn' },
  { name: 'Café Quinto',       unit: 'Local Del Valle 12 · A',    amount: 31000, since: 'mar 2024', tone: 'ok' },
  { name: 'Linda Torres',      unit: 'Penthouse Cuauhtémoc · PH', amount: 52000, since: 'jul 2025', tone: 'violet' },
  { name: 'Carlos & Mariana',  unit: 'Loft Condesa · único',      amount: 19500, since: 'oct 2024', tone: 'bad' },
  { name: 'Despacho Mireles',  unit: 'Roma 88 · oficina C-201',   amount: 28000, since: 'abr 2025', tone: 'info' },
];

// 12 meses, cada inquilino con un pequeño "patrón" plausible.
// Estatus: paid · paid-late · pending · overdue · empty (sin contrato aún)
const RENT_CELLS = [
  ['paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','paid'],
  ['paid','paid','paid-late','paid','paid','paid','paid','paid-late','paid','paid','paid','paid'],
  ['empty','empty','empty','empty','empty','empty','empty','empty','paid','paid','paid','paid'],
  ['paid','paid','paid','paid','paid','paid','paid','paid','paid-late','paid-late','overdue','overdue'],
  ['paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','pending'],
  ['empty','empty','empty','empty','empty','empty','paid','paid','paid','paid','paid','paid'],
  ['paid','paid','paid','paid','paid','paid','overdue','overdue','overdue','overdue','overdue','overdue'],
  ['empty','empty','empty','empty','paid','paid','paid','paid','paid','paid','paid-late','pending'],
];

const MONTHS = ['Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May'];

const RentasCalendario = () => {
  return (
    <AppShell active="rentas" breadcrumb={['Portafolio interno', 'Rentas', 'Calendario']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 28px 12px', display: 'flex', alignItems: 'flex-end', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Rentas · Salud financiera
            </span>
            <h1 style={{ margin: '4px 0 0', font: '600 26px var(--font-sans)', letterSpacing: '-0.02em' }}>
              Calendario de pagos
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="md"><IcDownload size={14}/> Estado de cuenta</Btn>
            <Btn size="md"><IcPlus size={14}/> Nuevo contrato</Btn>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ padding: '0 28px 14px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <Kpi label="Cobrado · MAY 2026" value="$248,000" delta="89% del esperado" deltaTone="ok" suffix="" />
          <Kpi label="Por cobrar" value="$31,000" delta="2 pagos" deltaTone="warn" suffix="vence esta semana" />
          <Kpi label="Vencido" value="$86,000" delta="2 inquilinos" deltaTone="bad" suffix="Industrias Lumen · Carlos & M." />
          <Kpi label="Ocupación" value="87%" delta="+2pp" deltaTone="ok" suffix="13 de 15 unidades" spark />
          <Kpi label="Renta mensual" value="$321,000" delta="+1.8%" deltaTone="ok" suffix="MXN · mes" spark />
        </div>

        {/* Filter bar */}
        <div style={{
          margin: '0 28px', padding: '10px 14px',
          background: 'var(--bg-subtle)', borderRadius: 10, border: '1px solid var(--ink-100)',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Periodo
          </span>
          <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 8, border: '1px solid var(--ink-200)', background: '#fff' }}>
            <SegBtn>3 meses</SegBtn>
            <SegBtn active>12 meses</SegBtn>
            <SegBtn>Año fiscal</SegBtn>
          </div>
          <span style={{ width: 1, height: 20, background: 'var(--ink-200)' }} />
          <Chip>Todos los portafolios</Chip>
          <Chip active>Solo activos</Chip>
          <Chip>Con vencidos</Chip>
          <div style={{ flex: 1 }} />
          <RentaLegend />
        </div>

        {/* Calendar grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 28px 28px' }}>
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden',
          }}>
            {/* Months header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '300px repeat(12, 1fr) 80px',
              background: 'var(--bg-subtle)', borderBottom: '1px solid var(--ink-100)',
              padding: '10px 0',
            }}>
              <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Inquilino · 8
                </span>
              </div>
              {MONTHS.map((m, i) => (
                <div key={m} style={{ textAlign: 'center' }}>
                  <div className="mono" style={{
                    fontSize: 11, color: i === 11 ? 'var(--pp-700)' : 'var(--ink-500)',
                    letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: i === 11 ? 600 : 500,
                  }}>{m}</div>
                  {i === 11 && (
                    <div className="mono" style={{ fontSize: 9, color: 'var(--pp-500)', marginTop: 1 }}>actual</div>
                  )}
                </div>
              ))}
              <div style={{ textAlign: 'right', padding: '0 18px' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>YTD</span>
              </div>
            </div>

            {/* Rows */}
            {RENT_TENANTS.map((t, i) => {
              const cells = RENT_CELLS[i];
              const paid = cells.filter(c => c === 'paid' || c === 'paid-late').length;
              const ytd = paid * t.amount;
              return (
                <div key={t.name} style={{
                  display: 'grid', gridTemplateColumns: '300px repeat(12, 1fr) 80px',
                  alignItems: 'center', padding: '10px 0',
                  borderBottom: i < RENT_TENANTS.length - 1 ? '1px solid var(--ink-100)' : 'none',
                  background: i % 2 === 1 ? 'var(--bg-muted)' : '#fff',
                }}>
                  <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={t.name} tone={t.tone} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.name}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.unit}
                      </div>
                    </div>
                    <span className="mono num" style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 500 }}>
                      {fmtMxn(t.amount)}
                    </span>
                  </div>
                  {cells.map((c, j) => <RentCell key={j} status={c} isCurrent={j === 11} />)}
                  <div style={{ textAlign: 'right', padding: '0 18px' }}>
                    <div className="mono num" style={{ fontSize: 12, color: 'var(--ink-900)', fontWeight: 600 }}>
                      {fmtMxn(ytd / 1000)}K
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>
                      {paid}/12
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Totals row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '300px repeat(12, 1fr) 80px',
              padding: '12px 0', alignItems: 'center',
              background: 'var(--pp-50)', borderTop: '1px solid var(--pp-100)',
            }}>
              <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--pp-700)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total mensual esperado
                </span>
              </div>
              {[279000, 279000, 279000, 279000, 301000, 301000, 332000, 332000, 332000, 332000, 332000, 321000].map((v, j) => (
                <div key={j} style={{ textAlign: 'center' }}>
                  <span className="mono num" style={{ fontSize: 10, color: 'var(--pp-700)', fontWeight: 500 }}>
                    {(v/1000).toFixed(0)}K
                  </span>
                </div>
              ))}
              <div style={{ textAlign: 'right', padding: '0 18px' }}>
                <span className="mono num" style={{ fontSize: 13, color: 'var(--pp-700)', fontWeight: 700 }}>
                  $3.7M
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const RentCell = ({ status, isCurrent }) => {
  const map = {
    paid:        { bg: '#10B981', icon: '✓', label: 'Pagado' },
    'paid-late': { bg: '#F59E0B', icon: '✓', label: 'Pagado tarde' },
    pending:     { bg: 'var(--pp-200)', icon: '·', label: 'Pendiente', stroke: 'var(--pp-500)' },
    overdue:     { bg: '#EF4444', icon: '!', label: 'Vencido' },
    empty:       { bg: 'transparent', icon: '', label: '—', stroke: 'var(--ink-200)' },
  };
  const m = map[status];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 4px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: m.bg, color: status === 'pending' ? 'var(--pp-700)' : '#fff',
        border: m.stroke ? `1.5px dashed ${m.stroke}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: status === 'overdue' ? 13 : 12,
        boxShadow: isCurrent && status !== 'empty' ? '0 0 0 2px rgba(110,58,255,0.25)' : 'none',
      }}>
        {m.icon}
      </div>
    </div>
  );
};

const RentaLegend = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    {[
      ['#10B981','Pagado'],
      ['#F59E0B','Tarde'],
      ['var(--pp-200)','Pendiente'],
      ['#EF4444','Vencido'],
    ].map(([c, l]) => (
      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        <span style={{ fontSize: 11, color: 'var(--ink-600)' }}>{l}</span>
      </div>
    ))}
  </div>
);

Object.assign(window, { RentasCalendario, RentCell, RentaLegend });
