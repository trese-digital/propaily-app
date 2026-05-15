// Rentas C · Detalle de contrato
// Vista completa de un contrato con timeline de pagos + documentos + acciones.

const RentasDetalle = () => {
  return (
    <AppShell active="rentas" breadcrumb={['Portafolio interno', 'Rentas', 'Contratos', 'Casa Polanco 412 · Sofía Mendoza']}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Main column */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
          {/* Hero card */}
          <div style={{
            display: 'flex', gap: 18, alignItems: 'center', padding: 20,
            background: 'linear-gradient(135deg, var(--pp-50) 0%, #fff 60%)',
            border: '1px solid var(--pp-100)', borderRadius: 14, marginBottom: 20,
          }}>
            <Avatar name="Sofía Mendoza" size={56} tone="violet" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--pp-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Contrato · LSE-2024-018
                </span>
                <Badge tone="warn">Por vencer · 17 días</Badge>
              </div>
              <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
                Sofía Mendoza Aguilar
              </h1>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>
                sofia.mendoza@correo.mx · 55 1234 5678 · inquilina desde jun 2024
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--ink-200)', paddingLeft: 20, textAlign: 'right' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Renta mensual
              </span>
              <div className="mono num" style={{ font: '600 28px var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
                $38,000
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>MXN · día 1 de cada mes</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="secondary" size="md">Generar recibo</Btn>
              <Btn size="md">Renovar</Btn>
            </div>
          </div>

          {/* Mini KPI strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            border: '1px solid var(--ink-100)', borderRadius: 12, marginBottom: 20,
            background: '#fff', overflow: 'hidden',
          }}>
            <KpiCell label="Cobrado YTD" value="$190,000" sub="5 meses · $38K c/u" tone="ok" />
            <KpiCell label="Saldo" value="$0" sub="al corriente" tone="ok" border />
            <KpiCell label="Depósito" value="$76,000" sub="2 meses · retenido" tone="violet" border />
            <KpiCell label="Cumplimiento" value="100%" sub="5 pagos puntuales" tone="ok" border progress={100} />
          </div>

          {/* Payment timeline */}
          <Card title="Historial de pagos" subtitle="24 meses · vista mes a mes" action={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" size="sm">Estado de cuenta <IcDownload size={12}/></Btn>
              <Btn variant="secondary" size="sm"><IcPlus size={12}/> Registrar pago</Btn>
            </div>
          } padding={0} style={{ marginBottom: 20 }}>
            <PaymentTimeline />
          </Card>

          {/* Document checklist */}
          <Card title="Documentos del contrato" subtitle="4 de 5 cargados · falta póliza de fianza" action={
            <Btn variant="secondary" size="sm"><IcPlus size={12}/> Cargar</Btn>
          } padding={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <DocItem name="Contrato firmado · LSE-2024-018.pdf" cat="Contrato" sens="sensible" size="2.4 MB" date="01 jun 2024" ok />
              <DocItem name="Identificación inquilina · INE.pdf" cat="ID" sens="sensible" size="180 KB" date="01 jun 2024" ok />
              <DocItem name="Comprobante de ingresos · jul 2024" cat="Comprobante" sens="sensible" size="320 KB" date="01 jun 2024" ok />
              <DocItem name="Pagaré · LSE-2024-018-PAG.pdf" cat="Pagaré" sens="sensible" size="180 KB" date="01 jun 2024" ok />
              <DocItem name="Póliza de fianza" cat="Fianza" sens="sensible" missing />
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <aside style={{
          width: 360, borderLeft: '1px solid var(--ink-100)', background: 'var(--bg-muted)',
          padding: 18, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto',
        }}>
          <RailBlock title="Propiedad">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="pp-img-ph" style={{ width: 52, height: 52, borderRadius: 8, fontSize: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ font: '600 14px var(--font-sans)' }}>Casa Polanco 412</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>Polanco V · 218 m² · 1 unidad</div>
              </div>
              <Btn variant="icon"><IcArrowUR size={12}/></Btn>
            </div>
          </RailBlock>

          <RailBlock title="Datos del contrato">
            <Row2 k="Tipo" v="Habitacional" />
            <Row2 k="Vigencia" v="01 jun 2024 → 31 may 2026" mono />
            <Row2 k="Duración" v="24 meses" mono />
            <Row2 k="Día de pago" v="día 1" mono />
            <Row2 k="Depósito en garantía" v="$76,000 MXN" mono />
            <Row2 k="Incremento anual" v="INPC + 1.0pp" />
            <Row2 k="Cláusula de renovación" v="60 días previo" />
          </RailBlock>

          <RailBlock title="Cobranza automática" badge={<Badge tone="violet">Activa</Badge>}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-600)', lineHeight: 1.5 }}>
              SPEI a la cuenta del propietario · referencia <span className="mono" style={{ color: 'var(--ink-900)' }}>POL412-001</span>. Recordatorio enviado el día 28 del mes anterior.
            </p>
            <Btn variant="ghost" size="sm">Configurar recordatorios</Btn>
          </RailBlock>

          <RailBlock title="Personas">
            <PersonRow name="Sofía Mendoza" role="Inquilina · titular" tone="violet" />
            <PersonRow name="Pablo García" role="Admin · GFC" tone="ok" />
            <PersonRow name="Beatriz Mendoza" role="Aval" tone="info" />
          </RailBlock>

          <RailBlock title="Renovación">
            <div style={{ padding: 12, background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: '#F59E0B', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>!</span>
                <span style={{ font: '600 12px var(--font-sans)', color: '#92400E' }}>Vence en 17 días</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#92400E', lineHeight: 1.45 }}>
                Sofía ya manifestó intención de renovar. Genera propuesta con incremento sugerido (INPC + 1.0pp = <span className="mono" style={{ fontWeight: 600 }}>$39,520</span>).
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <Btn size="sm" style={{ flex: 1, justifyContent: 'center' }}>Generar propuesta</Btn>
                <Btn variant="secondary" size="sm">No renovar</Btn>
              </div>
            </div>
          </RailBlock>
        </aside>
      </div>
    </AppShell>
  );
};

const KpiCell = ({ label, value, sub, tone, border, progress }) => (
  <div style={{
    padding: 16, borderLeft: border ? '1px solid var(--ink-100)' : 'none',
    display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', overflow: 'hidden',
  }}>
    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>{label}</span>
    <span className="mono num" style={{ font: '600 22px var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{value}</span>
    <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{sub}</span>
    {progress !== undefined && (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'var(--ink-100)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#10B981' }} />
      </div>
    )}
  </div>
);

const PaymentTimeline = () => {
  // 24 meses
  const months = [
    'jun24','jul24','ago24','sep24','oct24','nov24','dic24','ene25','feb25','mar25','abr25','may25',
    'jun25','jul25','ago25','sep25','oct25','nov25','dic25','ene26','feb26','mar26','abr26','may26',
  ];
  // status per month
  const statuses = [
    'paid','paid','paid','paid','paid','paid','paid','paid','paid-late','paid','paid','paid',
    'paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','paid','paid',
  ];
  // futuro
  const fut = ['jun26','jul26','ago26'];
  const futStatuses = ['pending', 'pending', 'pending'];

  return (
    <div style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Histórico · 24 meses
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-700)' }}>
          <span style={{ color: '#10B981', fontWeight: 600 }}>23</span> pagados · <span style={{ color: '#F59E0B', fontWeight: 600 }}>1</span> tarde · <span style={{ color: 'var(--ink-500)' }}>0</span> faltantes
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 4, marginBottom: 8 }}>
        {statuses.map((s, i) => <PayBar key={i} status={s} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 4, marginBottom: 18 }}>
        {months.map((m, i) => (
          <div key={m} className="mono" style={{ fontSize: 9, textAlign: 'center', color: i % 6 === 0 ? 'var(--ink-700)' : 'var(--ink-400)' }}>
            {i % 3 === 0 ? m : ''}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--pp-700)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Próximos · si renueva
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--pp-100)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['01 jun 2026', '$39,520', 'Propuesto · renovación', 'violet'],
          ['01 jul 2026', '$39,520', 'Proyectado', 'neutral'],
          ['01 ago 2026', '$39,520', 'Proyectado', 'neutral'],
        ].map((p, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', alignItems: 'center', gap: 12,
            padding: '10px 12px', border: '1px dashed var(--pp-200)', borderRadius: 8, background: 'var(--pp-50)',
          }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--pp-700)', fontWeight: 600 }}>{p[0]}</span>
            <span className="mono num" style={{ fontSize: 13, color: 'var(--ink-900)', fontWeight: 600 }}>{p[1]}</span>
            <span style={{ fontSize: 12, color: 'var(--ink-600)' }}>{p[2]}</span>
            <Badge tone={p[3]}>{p[3] === 'violet' ? 'Propuesto' : 'Proyectado'}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

const PayBar = ({ status }) => {
  const colors = {
    paid: '#10B981',
    'paid-late': '#F59E0B',
    pending: 'var(--pp-300)',
    overdue: '#EF4444',
  };
  return (
    <div style={{
      height: 48, borderRadius: 4, background: colors[status],
      position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 4,
    }}>
      <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>{status === 'paid' ? '✓' : status === 'paid-late' ? '↻' : '·'}</span>
    </div>
  );
};

const DocItem = ({ name, cat, sens, size, date, missing, ok }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
    border: missing ? '1px dashed var(--ink-300)' : '1px solid var(--ink-100)',
    borderRadius: 8, background: missing ? 'var(--bg-subtle)' : '#fff',
    opacity: missing ? 0.7 : 1,
  }}>
    <span style={{
      width: 32, height: 32, borderRadius: 7,
      background: missing ? 'var(--ink-100)' : 'var(--pp-50)',
      color: missing ? 'var(--ink-500)' : 'var(--pp-600)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}><IcDoc size={16}/></span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ font: '500 13px var(--font-sans)', color: missing ? 'var(--ink-500)' : 'var(--ink-900)' }}>{name}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2, display: 'flex', gap: 8 }}>
        <span>{cat}</span>
        {!missing && <><span>·</span><span>{size}</span><span>·</span><span>{date}</span></>}
        {missing && <span style={{ color: 'var(--bad)' }}>· requerido</span>}
      </div>
    </div>
    {!missing && <SensitivityPill level={sens} />}
    {ok && <Badge tone="ok"><IcCheck size={10}/></Badge>}
    {missing ? <Btn variant="secondary" size="sm"><IcPlus size={11}/> Cargar</Btn> : <Btn variant="icon"><IcMore size={14}/></Btn>}
  </div>
);

const RailBlock = ({ title, badge, children }) => (
  <div style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--ink-100)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>{title}</span>
      <span style={{ flex: 1 }} />
      {badge}
    </div>
    {children}
  </div>
);

const Row2 = ({ k, v, mono }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
    <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{k}</span>
    <span className={mono ? 'mono num' : ''} style={{ fontSize: 12, color: 'var(--ink-900)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
  </div>
);

const PersonRow = ({ name, role, tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Avatar name={name} size={28} tone={tone} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ font: '500 13px var(--font-sans)' }}>{name}</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{role}</div>
    </div>
  </div>
);

Object.assign(window, { RentasDetalle, KpiCell, PaymentTimeline, PayBar, DocItem, RailBlock, Row2, PersonRow });
