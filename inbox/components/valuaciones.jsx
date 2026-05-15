// Valuaciones — histórico de avalúos por propiedad + panel de solicitud

const VAL_HISTORY = [
  { date: '12 mar 2026', kind: 'comercial', value: 8420000, source: 'Avalúo BBVA', appraiser: 'Ing. Rodrigo Sosa', official: true, status: 'aprobado' },
  { date: '01 ene 2026', kind: 'fiscal',    value: 5180000, source: 'Catastro León 2026', appraiser: 'Sistema', official: true, status: 'aprobado' },
  { date: '14 oct 2025', kind: 'seguro',    value: 7800000, source: 'GNP · póliza 32118', appraiser: 'GNP Seguros', official: false, status: 'aprobado' },
  { date: '02 abr 2025', kind: 'comercial', value: 7820000, source: 'Tinsa MX', appraiser: 'Arq. Marcela Ruiz', official: true, status: 'aprobado' },
  { date: '01 ene 2025', kind: 'fiscal',    value: 4720000, source: 'Catastro León 2025', appraiser: 'Sistema', official: true, status: 'aprobado' },
  { date: '11 may 2024', kind: 'manual',    value: 7400000, source: 'Estimación interna GFC', appraiser: 'Pablo García', official: false, status: 'aprobado' },
  { date: '03 jun 2024', kind: 'comercial', value: 7480000, source: 'BANORTE · solicitud', appraiser: 'Ing. Daniela Pérez', official: true, status: 'rechazado' },
];

const Valuaciones = () => {
  return (
    <AppShell active="valuaciones" breadcrumb={['Portafolio interno', 'Propiedades', 'Casa Polanco 412', 'Valuaciones']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 28px 14px', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Casa Polanco 412 · Avalúos
            </span>
            <h1 style={{ margin: '4px 0 0', font: '600 24px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Histórico de valuaciones
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>
              7 avalúos registrados · último comercial hace 64 días · variación 2024-2026 <span style={{ color: '#10B981', fontWeight: 600 }}>+13.8%</span>
            </p>
          </div>
          <Btn variant="secondary" size="md"><IcDownload size={14}/> Exportar PDF</Btn>
          <Btn size="md"><IcPlus size={14}/> Registrar avalúo</Btn>
        </div>

        {/* Value strip + chart */}
        <div style={{ padding: '0 28px 18px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
          {/* Current values card */}
          <div style={{
            border: '1px solid var(--pp-100)', borderRadius: 12, padding: 18,
            background: 'linear-gradient(180deg, var(--pp-50) 0%, #fff 100%)',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--pp-700)', textTransform: 'uppercase', fontWeight: 600 }}>
              Valores vigentes
            </span>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>Comercial · oficial</span>
                <Badge tone="ok">vigente</Badge>
              </div>
              <div className="mono num" style={{ font: '600 28px var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--ink-900)', marginTop: 2 }}>
                $8,420,000
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>BBVA · 12 mar 2026</span>
            </div>
            <div style={{ height: 1, background: 'var(--pp-100)' }} />
            <ValMini label="Fiscal · Catastro" value="$5,180,000" sub="2026 · oficial" />
            <ValMini label="Seguro · GNP" value="$7,800,000" sub="oct 2025 · póliza activa" />
            <ValMini label="Estimación interna" value="$8,650,000" sub="proyectado may 2026" />
            <Btn variant="secondary" size="sm" style={{ marginTop: 4 }}><IcSpark size={12}/> Solicitar avalúo a GF</Btn>
          </div>

          {/* Chart */}
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', padding: 18,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <span style={{ font: '600 14px var(--font-sans)', color: 'var(--ink-900)' }}>Evolución 24 meses</span>
              <span style={{ flex: 1 }} />
              <ValLegend />
            </div>
            <ValChart />
          </div>
        </div>

        {/* Timeline list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Registro completo · append-only
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
            <FilterChip label="Tipo" value="Todos" />
            <FilterChip label="Oficial" value="Sí · No" />
          </div>

          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* timeline rail */}
            <span style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: 'var(--ink-100)', borderRadius: 999 }} />
            {VAL_HISTORY.map((v, i) => <ValTimelineItem key={i} v={v} first={i === 0} />)}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const ValMini = ({ label, value, sub }) => (
  <div>
    <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{label}</span>
    <div className="mono num" style={{ font: '500 18px var(--font-sans)', color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>{value}</div>
    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{sub}</span>
  </div>
);

const ValLegend = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    {[
      ['var(--pp-500)', 'Comercial'],
      ['#10B981', 'Fiscal'],
      ['#3B82F6', 'Seguro'],
      ['var(--ink-400)', 'Manual'],
    ].map(([c, l]) => (
      <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-600)' }}>
        <span style={{ width: 10, height: 2, background: c, borderRadius: 2 }} />{l}
      </span>
    ))}
  </div>
);

const ValChart = () => {
  // Synthetic series points (0-100 X, value normalized)
  const seriesCom = [
    [0,72],[10,73],[20,73.5],[30,75],[40,76],[50,77.5],[60,78.2],[70,78.5],[80,80.2],[90,82],[100,84.2],
  ];
  const seriesFis = [
    [0,42],[20,42],[40,45],[60,47.2],[80,49.5],[100,51.8],
  ];
  const seriesSeg = [
    [0,68],[40,72],[70,77],[100,78],
  ];
  const seriesMan = [
    [0,74],[100,86.5],
  ];

  const toPath = (pts) => pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + (100 - p[1])).join(' ');
  return (
    <div style={{ position: 'relative', height: 200 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {/* gridlines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--ink-100)" strokeWidth="0.3" />
        ))}
        {/* comm fill */}
        <defs>
          <linearGradient id="val-com-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--pp-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--pp-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={toPath(seriesCom) + ' L100,100 L0,100 Z'} fill="url(#val-com-fill)" />
        <path d={toPath(seriesCom)} stroke="var(--pp-500)" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
        <path d={toPath(seriesFis)} stroke="#10B981" strokeWidth="0.6" fill="none" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <path d={toPath(seriesSeg)} stroke="#3B82F6" strokeWidth="0.6" fill="none" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
        <path d={toPath(seriesMan)} stroke="var(--ink-400)" strokeWidth="0.6" fill="none" strokeDasharray="0.5 2" vectorEffect="non-scaling-stroke" />
        {/* markers on com */}
        {seriesCom.map(([x, y]) => (
          <circle key={x} cx={x} cy={100 - y} r="0.8" fill="#fff" stroke="var(--pp-500)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {/* X axis labels */}
      <div className="mono" style={{
        position: 'absolute', left: 0, right: 0, bottom: -18, display: 'flex',
        justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-500)',
      }}>
        <span>jun 2024</span><span>dic 2024</span><span>jun 2025</span><span>dic 2025</span><span>jun 2026</span>
      </div>
      {/* Y axis labels */}
      <div className="mono" style={{ position: 'absolute', left: -2, top: 0, bottom: 0, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-500)' }}>
        <span>$4M</span><span></span><span>$6M</span><span></span><span>$9M</span>
      </div>
    </div>
  );
};

const ValTimelineItem = ({ v, first }) => {
  const tones = { comercial: 'violet', fiscal: 'ok', seguro: 'info', manual: 'neutral', profesional: 'warn' };
  const kindColors = {
    comercial: 'var(--pp-500)', fiscal: '#10B981', seguro: '#3B82F6', manual: 'var(--ink-400)',
  };
  return (
    <div style={{ position: 'relative', paddingBottom: 14 }}>
      <span style={{
        position: 'absolute', left: -22, top: 18, width: 12, height: 12, borderRadius: 999,
        background: '#fff', border: `2.5px solid ${kindColors[v.kind]}`,
        boxShadow: first ? '0 0 0 4px rgba(110,58,255,0.15)' : 'none',
      }} />
      <div style={{
        border: v.status === 'rechazado' ? '1px solid #FECACA' : '1px solid var(--ink-100)',
        borderRadius: 10, padding: 14, background: v.status === 'rechazado' ? '#FEF2F2' : '#fff',
        display: 'grid', gridTemplateColumns: '110px 1fr auto auto', gap: 14, alignItems: 'center',
      }}>
        <div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-900)', fontWeight: 600 }}>{v.date}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {first && 'más reciente'}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <Badge tone={tones[v.kind]}>{v.kind.toUpperCase()}</Badge>
            {v.official && <SensitivityPill level="sensible" />}
            {v.status === 'rechazado' && <Badge tone="bad">Rechazado</Badge>}
          </div>
          <div style={{ font: '500 14px var(--font-sans)', color: 'var(--ink-900)' }}>{v.source}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{v.appraiser}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono num" style={{ font: '600 18px var(--font-sans)', color: v.status === 'rechazado' ? 'var(--ink-500)' : 'var(--ink-900)', textDecoration: v.status === 'rechazado' ? 'line-through' : 'none' }}>
            {fmtMxn(v.value)}
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>MXN</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn variant="icon"><IcDoc size={14}/></Btn>
          <Btn variant="icon"><IcMore size={14}/></Btn>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Valuaciones, ValChart, ValTimelineItem, ValMini, ValLegend });
