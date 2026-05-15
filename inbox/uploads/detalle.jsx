// Detalle de propiedad — 1440 × 1380

const Detalle = () => {
  return (
    <AppShell active="propiedades" breadcrumb={['Portafolio interno', 'Propiedades', 'Casa Polanco 412']}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        {/* Hero — cover + key meta */}
        <div style={{ position: 'relative', height: 320 }}>
          <div className="pp-img-ph" style={{ position: 'absolute', inset: 0, borderRadius: 0, fontSize: 0 }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(14,10,22,0.0) 30%, rgba(14,10,22,0.7) 100%)',
          }} />
          <div style={{
            position: 'absolute', left: 28, right: 28, bottom: 22, color: '#fff',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24,
          }}>
            <div>
              <Badge tone="ok">Activa</Badge>
              <h1 style={{ margin: '8px 0 4px', font: '600 36px var(--font-sans)', letterSpacing: '-0.025em' }}>
                Casa Polanco 412
              </h1>
              <div className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', gap: 14 }}>
                <span><IcPin size={11} style={{ verticalAlign: '-2px' }} /> Polanco V Sección · CDMX</span>
                <span>FOLIO 04-12-A</span>
                <span>Vinculada con lote · ✓</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="secondary" size="md" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                <IcMap size={14}/> Ver en mapa
              </Btn>
              <Btn variant="secondary" size="md" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                <IcDownload size={14}/> Exportar
              </Btn>
              <Btn size="md"><IcEdit size={14}/> Editar</Btn>
            </div>
          </div>
          {/* Photo counter */}
          <div style={{
            position: 'absolute', top: 20, right: 28,
            padding: '6px 10px', background: 'rgba(14,10,22,0.55)', color: '#fff',
            backdropFilter: 'blur(8px)', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 6,
            font: '500 12px var(--font-sans)',
          }}>
            <IcPhoto size={12}/> 1 / 14
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--ink-100)', padding: '0 28px', display: 'flex', gap: 4, background: '#fff' }}>
          {[['Resumen', true], ['Fotos · 14', false], ['Unidades · 1', false], ['Documentos · 7', false], ['Valuaciones', false], ['Actividad', false]].map(([t, on]) => (
            <button key={t} style={{
              padding: '14px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
              font: `${on ? 500 : 400} 13px var(--font-sans)`,
              color: on ? 'var(--ink-900)' : 'var(--ink-500)',
              borderBottom: on ? '2px solid var(--pp-500)' : '2px solid transparent',
              marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Datos catastrales */}
            <Panel title="Datos catastrales" badge="área real prevalece sobre catastro">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                <Stat k="Área real" v="218" u="m²" mono />
                <Stat k="Área catastro (ref.)" v="214" u="m²" mono />
                <Stat k="Frente" v="12.4" u="m" mono />
                <Stat k="Fondo" v="17.5" u="m" mono />
                <Stat k="Sector" v="04-12" mono />
                <Stat k="Uso de suelo" v="H30/20/Z" mono />
                <Stat k="Valor fiscal /m²" v="$78,420" mono />
                <Stat k="Valor comercial /m²" v="$182,300" mono />
              </div>
            </Panel>

            {/* Gallery */}
            <Panel title="Galería" actions={<><Btn variant="ghost" size="sm"><IcPhoto size={12}/> Subir</Btn></>}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="pp-img-ph" style={{ aspectRatio: '1', borderRadius: 8, fontSize: 0, position: 'relative' }}>
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', top: 6, left: 6, padding: '2px 6px',
                        background: 'var(--ink-900)', color: '#fff', borderRadius: 4,
                        font: '500 9px var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}>portada</span>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Unidades */}
            <Panel title="Unidades · 1" actions={<Btn variant="ghost" size="sm"><IcPlus size={12}/> Nueva unidad</Btn>}>
              <div style={{ border: '1px solid var(--ink-100)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr 1fr 48px',
                  padding: '10px 14px', background: 'var(--bg-subtle)', color: 'var(--ink-500)',
                  font: '500 11px var(--font-sans)', letterSpacing: '0.04em', textTransform: 'uppercase',
                  borderBottom: '1px solid var(--ink-100)',
                }}>
                  <span>Unidad</span><span>Tipo</span><span>Área</span><span>Inquilino</span><span style={{ textAlign: 'right' }}>Renta /mes</span><span />
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr 1fr 48px',
                  padding: '14px', alignItems: 'center', fontSize: 13,
                }}>
                  <span style={{ font: '500 13px var(--font-sans)' }}>Principal</span>
                  <span>Casa completa</span>
                  <span className="mono num">218 m²</span>
                  <span>Sra. Marcela Fernández</span>
                  <span className="mono num" style={{ textAlign: 'right', fontWeight: 500 }}>$42,000</span>
                  <Btn variant="icon"><IcMore size={14}/></Btn>
                </div>
              </div>
            </Panel>

            {/* Documents */}
            <Panel title="Documentos · 7" actions={
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn variant="ghost" size="sm"><IcFilter size={12}/> Categoría</Btn>
                <Btn variant="ghost" size="sm"><IcPlus size={12}/> Subir</Btn>
              </div>
            }>
              <DocRow />
            </Panel>
          </div>

          {/* Side rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SidePanel title="Valor">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Valor estimado
                </span>
                <div className="num" style={{ font: '600 28px/1 var(--font-sans)', letterSpacing: '-0.02em' }}>
                  $8,420,000
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-500)' }}>
                  <Badge tone="ok"><IcArrowUp size={10}/> +6.1%</Badge>
                  <span>vs 2025</span>
                </div>
                <div style={{ height: 1, background: 'var(--ink-100)', margin: '10px 0' }}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <Line k="Avalúo BBVA mar-2026" v="$8,420,000" />
                  <Line k="Catastro 2025"        v="$7,930,000" />
                  <Line k="Compra (2018)"        v="$5,200,000" />
                </div>
                <Btn variant="secondary" size="md" style={{ marginTop: 10, justifyContent: 'center' }}>
                  <IcChart size={14}/> Solicitar valuación
                </Btn>
              </div>
            </SidePanel>

            <SidePanel title="Vínculo cartográfico" tone="violet">
              <div style={{ height: 120, borderRadius: 8, position: 'relative', overflow: 'hidden', border: '1px solid var(--pp-100)' }}>
                <MapPlaceholder />
                <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <rect x="160" y="70" width="80" height="60" fill="#6E3AFF" stroke="#fff" strokeWidth="2" rx="4"/>
                </svg>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-600)', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                <span>Lote 04-12-A</span>
                <span>19.4326°N · 99.1932°W</span>
              </div>
              <Btn variant="ghost" size="sm" style={{ marginTop: 8, padding: 0 }}>
                Ver en mapa <IcArrowR size={12}/>
              </Btn>
            </SidePanel>

            <SidePanel title="Ingresos · 12 meses">
              <div className="num" style={{ font: '600 22px var(--font-sans)' }}>$504,000</div>
              <svg viewBox="0 0 240 80" style={{ width: '100%', height: 80, marginTop: 8 }}>
                {Array.from({length: 12}).map((_, i) => {
                  const h = [50,52,55,48,52,55,58,60,62,60,64,68][i];
                  return <rect key={i} x={i*20+2} y={80-h} width="14" height={h} fill="var(--pp-300)" rx="2"/>;
                })}
              </svg>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', display: 'flex', justifyContent: 'space-between' }}>
                <span>JUN 25</span><span>MAY 26</span>
              </div>
            </SidePanel>

            <SidePanel title="Equipo & permisos">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['PG', 'Pablo García', 'company_admin', 'var(--pp-500)'],
                  ['MF', 'Marcela Fernández', 'agent', 'var(--ink-600)'],
                  ['JR', 'Jorge Rivera', 'viewer', 'var(--ink-400)'],
                ].map(([i, n, r, c]) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 999, background: c, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '600 10px var(--font-sans)' }}>{i}</span>
                    <span style={{ flex: 1, font: '500 13px var(--font-sans)' }}>{n}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.06em' }}>{r}</span>
                  </div>
                ))}
              </div>
            </SidePanel>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Panel = ({ title, badge, actions, children }) => (
  <section style={{
    border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff',
  }}>
    <header style={{
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid var(--ink-100)',
    }}>
      <h2 style={{ margin: 0, font: '600 14px var(--font-sans)', letterSpacing: '-0.005em' }}>{title}</h2>
      {badge && <span className="mono" style={{
        fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.06em',
        padding: '2px 6px', background: 'var(--bg-subtle)', borderRadius: 4, border: '1px solid var(--ink-100)',
      }}>{badge}</span>}
      <div style={{ flex: 1 }} />
      {actions}
    </header>
    <div style={{ padding: 16 }}>{children}</div>
  </section>
);

const SidePanel = ({ title, tone, children }) => (
  <section style={{
    border: `1px solid ${tone === 'violet' ? 'var(--pp-200)' : 'var(--ink-100)'}`,
    background: tone === 'violet' ? 'var(--pp-50)' : '#fff',
    borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--pp-500)' }} />
      <h3 style={{ margin: 0, font: '600 12px var(--font-sans)', letterSpacing: '-0.005em' }}>{title}</h3>
    </div>
    {children}
  </section>
);

const Line = ({ k, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
    <span style={{ color: 'var(--ink-500)' }}>{k}</span>
    <span className="mono num" style={{ color: 'var(--ink-700)', fontWeight: 500 }}>{v}</span>
  </div>
);

Object.assign(window, { Detalle, Panel, SidePanel, Line });
