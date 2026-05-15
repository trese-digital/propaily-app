// Dashboard / Home — portfolio overview

const Dashboard = () => {
  return (
    <AppShell active="dashboard" breadcrumb={['Portafolio interno', 'Inicio']}>
      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22, height: '100%', overflow: 'hidden' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Martes · 12 mayo · 2026
            </span>
            <h1 style={{ margin: '6px 0 4px', font: '600 28px/1.1 var(--font-sans)', letterSpacing: '-0.025em' }}>
              Buenos días, Pablo.
            </h1>
            <p style={{ margin: 0, color: 'var(--ink-500)', fontSize: 14 }}>
              4 documentos esperan revisión · 1 valuación está vencida · 2 propiedades se actualizaron ayer.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="md"><IcDownload size={14}/> Reporte Q2</Btn>
            <Btn size="md"><IcPlus size={14}/> Nueva propiedad</Btn>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <Kpi label="Valor portafolio" value="$184,420,000" delta="+4.2%" deltaTone="ok" suffix="MXN" spark />
          <Kpi label="Propiedades activas" value="12" delta="+2" deltaTone="ok" suffix="en 4 ciudades" />
          <Kpi label="Renta mensual" value="$842,000" delta="+1.8%" deltaTone="ok" suffix="MXN · mes" spark />
          <Kpi label="Documentos pendientes" value="4" delta="vencidos: 1" deltaTone="bad" suffix="por revisar" />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
          {/* Map preview */}
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <CardHeader title="Mapa del portafolio" subtitle="12 propiedades · clustered por colonia">
              <Btn variant="ghost" size="sm">Abrir cartografía <IcArrowUR size={12}/></Btn>
            </CardHeader>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <MapPlaceholder pins />
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            {/* Activity */}
            <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <CardHeader title="Actividad reciente">
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>últimas 48h</span>
              </CardHeader>
              <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column' }}>
                {[
                  { who: 'Marcela',  did: 'subió 3 documentos a', what: 'Casa Polanco 412', time: 'hace 2h', tone: 'violet' },
                  { who: 'Sistema',   did: 'actualizó valor catastral de', what: 'Edificio Roma 88', time: 'hace 4h', tone: 'neutral' },
                  { who: 'Pablo',     did: 'vinculó lote con',           what: 'Loft Condesa', time: 'ayer', tone: 'ok' },
                  { who: 'Sistema',   did: 'detectó vencimiento de',     what: 'Avalúo BBVA', time: 'ayer', tone: 'bad' },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
                    borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 999, flex: '0 0 auto',
                      background: a.tone === 'violet' ? 'var(--pp-100)' :
                                  a.tone === 'bad' ? '#FEE2E2' :
                                  a.tone === 'ok' ? '#D1FAE5' : 'var(--ink-100)',
                      color: a.tone === 'violet' ? 'var(--pp-700)' :
                              a.tone === 'bad' ? '#991B1B' :
                              a.tone === 'ok' ? '#065F46' : 'var(--ink-700)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      font: '600 11px var(--font-sans)',
                    }}>{a.who[0]}</span>
                    <div style={{ flex: 1, lineHeight: 1.45 }}>
                      <div style={{ fontSize: 13, color: 'var(--ink-700)' }}>
                        <span style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{a.who}</span> {a.did} <span style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{a.what}</span>
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
              <CardHeader title="Por hacer">
                <Btn variant="ghost" size="sm">Todas <IcArrowUR size={12}/></Btn>
              </CardHeader>
              <div style={{ padding: '0 16px 14px' }}>
                {[
                  { t: 'Revisar avalúo de Casa Polanco 412', due: 'hoy', tone: 'warn' },
                  { t: 'Subir contrato de Loft Condesa', due: 'jue 14 may', tone: 'neutral' },
                  { t: 'Vincular lote a Local Del Valle 12', due: 'vie 15 may', tone: 'neutral' },
                ].map((task, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none' }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid var(--ink-300)', flex: '0 0 auto' }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-700)' }}>{task.t}</span>
                    <Badge tone={task.tone}>{task.due}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row — recent properties */}
        <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff' }}>
          <CardHeader title="Propiedades recientes">
            <Btn variant="ghost" size="sm">Ver todas (12) <IcArrowUR size={12}/></Btn>
          </CardHeader>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '4px 16px 16px' }}>
            {[
              ['Casa Polanco 412', 'Polanco V', '218 m²', '$8.4M', 'ok'],
              ['Edificio Roma 88', 'Roma Nte', '1,420 m²', '$48.0M', 'ok'],
              ['Loft Condesa', 'Condesa', '92 m²', '$3.2M', 'neutral'],
              ['Local Del Valle 12', 'Del Valle', '180 m²', '$6.1M', 'warn'],
            ].map((p, i) => (
              <div key={i} style={{ border: '1px solid var(--ink-100)', borderRadius: 10, overflow: 'hidden' }}>
                <div className="pp-img-ph" style={{ height: 80, borderRadius: 0 }}>{p[0]}</div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ font: '500 13px var(--font-sans)' }}>{p[0]}</span>
                    <span className="mono num" style={{ fontSize: 13, fontWeight: 500 }}>{p[3]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{p[1]} · {p[2]}</span>
                    <Badge tone={p[4]}>{p[4]==='ok'?'Activa':p[4]==='warn'?'En revisión':'Borrador'}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Kpi = ({ label, value, delta, deltaTone = 'ok', suffix, spark }) => (
  <div style={{
    border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', padding: 16,
    display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden',
  }}>
    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
      {label}
    </span>
    <div className="num" style={{ font: '600 26px/1 var(--font-sans)', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-500)' }}>
      <Badge tone={deltaTone}>{delta}</Badge>
      <span>{suffix}</span>
    </div>
    {spark && (
      <svg viewBox="0 0 100 24" style={{ position: 'absolute', right: 12, bottom: 12, width: 80, height: 24, opacity: 0.85 }}>
        <path d="M0,20 L12,18 L24,19 L36,14 L48,15 L60,10 L72,12 L84,6 L100,4" stroke="var(--pp-500)" strokeWidth="1.5" fill="none"/>
      </svg>
    )}
  </div>
);

const CardHeader = ({ title, subtitle, children }) => (
  <div style={{
    padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: '1px solid var(--ink-100)',
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ font: '600 14px var(--font-sans)', color: 'var(--ink-900)', letterSpacing: '-0.005em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

// Stylised map background — used in Dashboard and Cartografía screens.
const MapPlaceholder = ({ pins = false, withColonyShading = false }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: '#EEEAF6',
    backgroundImage: `
      linear-gradient(135deg, rgba(110,58,255,0.03) 0%, rgba(110,58,255,0) 60%),
      radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4), transparent 30%),
      radial-gradient(circle at 70% 60%, rgba(110,58,255,0.06), transparent 40%)
    `,
    overflow: 'hidden',
  }}>
    {/* roads */}
    <svg viewBox="0 0 800 500" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="block" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#FBFAFE"/>
          <path d="M0 0 L80 0 M0 0 L0 80" stroke="#E1DCEE" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#block)" opacity="0.7"/>
      {/* main avenues */}
      <path d="M0,200 Q400,180 800,260" stroke="#C6BFD7" strokeWidth="6" fill="none" opacity="0.7"/>
      <path d="M200,0 Q220,250 280,500" stroke="#C6BFD7" strokeWidth="6" fill="none" opacity="0.7"/>
      <path d="M520,0 Q540,300 600,500" stroke="#C6BFD7" strokeWidth="4" fill="none" opacity="0.5"/>
      <path d="M0,380 L800,400" stroke="#C6BFD7" strokeWidth="3" fill="none" opacity="0.5"/>
      {/* colony shapes */}
      {withColonyShading && (
        <>
          <path d="M120,80 L320,90 L340,260 L140,250 Z" fill="rgba(110,58,255,0.18)" stroke="#6E3AFF" strokeWidth="1.5" strokeDasharray="0"/>
          <path d="M380,110 L580,100 L600,300 L390,310 Z" fill="rgba(110,58,255,0.10)" stroke="#6E3AFF" strokeWidth="1" opacity="0.7"/>
          <path d="M180,300 L370,290 L380,460 L200,470 Z" fill="rgba(110,58,255,0.06)" stroke="#6E3AFF" strokeWidth="1" opacity="0.5"/>
        </>
      )}
    </svg>

    {pins && (
      <>
        {[[28,38],[60,52],[44,68],[72,28],[16,72]].map(([x,y], i) => (
          <span key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)',
            width: 22, height: 22, borderRadius: '50% 50% 50% 2px / 50% 50% 50% 2px', rotate: '-45deg',
            background: 'var(--pp-500)', boxShadow: '0 4px 12px rgba(110,58,255,0.35)',
            border: '2px solid #fff',
          }} />
        ))}
      </>
    )}
    {/* attribution */}
    <span className="mono" style={{
      position: 'absolute', right: 8, bottom: 8, fontSize: 10,
      color: 'var(--ink-500)', background: 'rgba(255,255,255,0.7)',
      padding: '2px 6px', borderRadius: 4,
    }}>© OpenStreetMap · Propaily</span>
  </div>
);

Object.assign(window, { Dashboard, Kpi, CardHeader, MapPlaceholder });
