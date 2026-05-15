// Suscripción · Billing — plan vigente, addons, uso, facturación

const Suscripcion = () => {
  return (
    <AppShell active="suscripcion" hideSidebar breadcrumb={['GFC · Empresa', 'Configuración', 'Suscripción']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '20px 28px 4px', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              GF Consultoría · Plan Growth
            </span>
            <h1 style={{ margin: '4px 0 0', font: '600 24px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Suscripción
            </h1>
          </div>
          <Btn variant="secondary" size="md"><IcDownload size={14}/> Facturas</Btn>
          <Btn size="md">Actualizar plan</Btn>
        </div>

        <div style={{ padding: '18px 28px 28px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Current plan banner */}
            <div style={{
              padding: 22, borderRadius: 14, border: '1px solid var(--pp-200)', position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--pp-500) 0%, var(--pp-700) 100%)', color: '#fff',
            }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Plan actual
                  </span>
                  <div style={{ font: '600 32px var(--font-sans)', letterSpacing: '-0.02em', marginTop: 2 }}>Growth</div>
                  <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.9, maxWidth: 380, lineHeight: 1.5 }}>
                    Hasta 25 propiedades · 5 usuarios · todos los módulos core. Renovación automática anual con descuento del 12%.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Próximo cargo
                  </span>
                  <div className="mono num" style={{ font: '600 32px var(--font-sans)', letterSpacing: '-0.02em', marginTop: 2 }}>
                    $4,800
                  </div>
                  <span className="mono" style={{ fontSize: 12, opacity: 0.8 }}>MXN · 01 jun 2026</span>
                </div>
              </div>

              <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.10)', borderRadius: 10, display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ opacity: 0.85 }}>Propiedades · 12 de 25</span>
                    <span className="mono" style={{ fontWeight: 600 }}>48%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                    <div style={{ width: '48%', height: '100%', background: '#fff' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ opacity: 0.85 }}>Usuarios · 4 de 5</span>
                    <span className="mono" style={{ fontWeight: 600 }}>80%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', background: '#fff' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ opacity: 0.85 }}>Almacenamiento · 8.2 / 25 GB</span>
                    <span className="mono" style={{ fontWeight: 600 }}>33%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                    <div style={{ width: '33%', height: '100%', background: '#fff' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Plans comparison */}
            <Card title="Comparar planes" subtitle="Cambia en cualquier momento — proración automática" padding={0}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
                <PlanCol name="Starter" price="$1,200" sub="hasta 5 propiedades · 2 usuarios" features={['Propiedades · Documentos', 'Visor de cartografía', '5 GB de almacenamiento']} />
                <PlanCol name="Growth" current price="$4,800" sub="hasta 25 propiedades · 5 usuarios" features={['Todo lo de Starter', 'Rentas · Valuaciones · Mantenimiento', '25 GB · soporte prioritario']} />
                <PlanCol name="Pro" price="$9,800" sub="hasta 100 propiedades · 15 usuarios" features={['Todo lo de Growth', 'API · Importación masiva', 'Auditoría · SSO']} />
                <PlanCol name="Enterprise" price="A medida" sub="propiedades y usuarios ilimitados" features={['Todo lo de Pro', 'Dominio dedicado y SLA', 'Onboarding asistido', 'Manager dedicado']} dark />
              </div>
            </Card>

            {/* Add-ons */}
            <Card title="Complementos · Add-ons" subtitle="Activa módulos extra cuando los necesites" padding={16}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <AddonRow
                  name="Cartografía premium" icon={IcMap} tone="violet" enabled
                  price="$1,200" sub="visor León + 32 ciudades · vincular lotes · valor fiscal por m²"
                />
                <AddonRow
                  name="Insights y comparativos" icon={IcChart} tone="info"
                  price="$1,800" sub="proyecciones · valor comparado por zona · alertas de plusvalía"
                />
                <AddonRow
                  name="Calculadoras financieras" icon={IcCalc} tone="warn"
                  price="$800" sub="ROI · cash-on-cash · simulador de crédito y plusvalía"
                />
              </div>
            </Card>
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card title="Método de pago" padding={14}>
              <div style={{
                padding: 14, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--ink-800), var(--ink-900))', color: '#fff',
                display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', overflow: 'hidden',
              }}>
                <span style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 999, background: 'rgba(110,58,255,0.18)' }} />
                <span style={{ position: 'absolute', top: 10, right: -10, width: 80, height: 80, borderRadius: 999, background: 'rgba(110,58,255,0.10)' }} />
                <div className="mono" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Visa · BBVA Empresa
                </div>
                <div className="mono num" style={{ fontSize: 16, letterSpacing: '0.18em' }}>
                  •••• •••• •••• 4218
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11 }}>PABLO GARCIA</span>
                  <span className="mono" style={{ fontSize: 11 }}>08/28</span>
                </div>
              </div>
              <Btn variant="ghost" size="sm" style={{ marginTop: 10 }}><IcEdit size={11}/> Cambiar tarjeta</Btn>
            </Card>

            <Card title="Historial reciente" padding={0}>
              <div style={{ padding: '4px 14px 14px' }}>
                {[
                  ['01 may 2026', '$4,800', 'pagado', 'F-2026-05'],
                  ['01 abr 2026', '$4,800', 'pagado', 'F-2026-04'],
                  ['01 mar 2026', '$4,800', 'pagado', 'F-2026-03'],
                  ['15 feb 2026', '$1,200', 'pagado', 'F-2026-02b · add-on'],
                  ['01 feb 2026', '$3,600', 'pagado', 'F-2026-02'],
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                    borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--ink-900)', fontWeight: 600 }}>{r[0]}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 1 }}>{r[3]}</div>
                    </div>
                    <span className="mono num" style={{ fontSize: 13, color: 'var(--ink-900)', fontWeight: 600 }}>{r[1]}</span>
                    <Badge tone="ok">{r[2]}</Badge>
                    <Btn variant="icon"><IcDownload size={12}/></Btn>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Datos de facturación" padding={14}>
              <Row2 k="Razón social" v="GF Consultoría SC" />
              <Row2 k="RFC" v="GFC180412QW3" mono />
              <Row2 k="Régimen" v="Persona moral" />
              <Row2 k="Email facturación" v="facturas@gfc.mx" />
              <Btn variant="ghost" size="sm" style={{ marginTop: 8 }}>Editar datos fiscales</Btn>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const PlanCol = ({ name, price, sub, features, current, dark }) => (
  <div style={{
    padding: 18, borderRight: '1px solid var(--ink-100)',
    background: current ? 'var(--pp-50)' : dark ? 'var(--ink-900)' : '#fff',
    color: dark ? '#fff' : undefined,
    position: 'relative', display: 'flex', flexDirection: 'column', gap: 12,
    borderTop: current ? '3px solid var(--pp-500)' : '3px solid transparent',
  }}>
    {current && (
      <span style={{ position: 'absolute', top: 12, right: 12 }}><Badge tone="violet">Plan actual</Badge></span>
    )}
    <div>
      <div style={{ font: '600 18px var(--font-sans)', letterSpacing: '-0.01em' }}>{name}</div>
      <div className="mono num" style={{ font: '600 26px var(--font-sans)', letterSpacing: '-0.02em', marginTop: 4 }}>
        {price}<span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7, marginLeft: 4 }}>{price.startsWith('$') ? '/mes' : ''}</span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{sub}</div>
    </div>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      {features.map(f => (
        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: 1.45 }}>
          <span style={{ marginTop: 1, color: current ? 'var(--pp-600)' : dark ? 'var(--pp-300)' : '#10B981' }}>
            <IcCheck size={14}/>
          </span>
          {f}
        </li>
      ))}
    </ul>
    {!current && <Btn variant={dark ? 'primary' : 'secondary'} size="sm" style={{ marginTop: 4, justifyContent: 'center' }}>
      {dark ? 'Hablar con ventas' : 'Cambiar a ' + name}
    </Btn>}
  </div>
);

const AddonRow = ({ name, icon: I, tone, enabled, price, sub }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14, padding: 14,
    border: enabled ? '1px solid var(--pp-200)' : '1px solid var(--ink-100)',
    background: enabled ? 'var(--pp-50)' : '#fff', borderRadius: 10,
  }}>
    <span style={{
      width: 40, height: 40, borderRadius: 9,
      background: enabled ? 'var(--pp-500)' : 'var(--ink-50)',
      color: enabled ? '#fff' : 'var(--ink-600)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}><I size={18}/></span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ font: '600 14px var(--font-sans)', color: enabled ? 'var(--pp-700)' : 'var(--ink-900)' }}>{name}</span>
        {enabled && <Badge tone="violet">Activo</Badge>}
      </div>
      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-600)' }}>{sub}</p>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div className="mono num" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>{price}<span style={{ fontSize: 11, color: 'var(--ink-500)', marginLeft: 2 }}>/mes</span></div>
    </div>
    <span style={{
      width: 36, height: 20, borderRadius: 999, background: enabled ? 'var(--pp-500)' : 'var(--ink-200)',
      position: 'relative', cursor: 'pointer', transition: '.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: enabled ? 18 : 2, width: 16, height: 16, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: '.2s',
      }} />
    </span>
  </div>
);

Object.assign(window, { Suscripcion, PlanCol, AddonRow });
