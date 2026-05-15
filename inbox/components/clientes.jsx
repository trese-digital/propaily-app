// Clientes y Portafolios — jerarquía visible + detalle de cliente

const Clientes = () => {
  return (
    <AppShell active="clientes" hideSidebar breadcrumb={['GFC · Empresa', 'Clientes']}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Master column — lista de clientes con jerarquía */}
        <div style={{ width: 380, borderRight: '1px solid var(--ink-100)', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, font: '600 18px var(--font-sans)', letterSpacing: '-0.015em', flex: 1 }}>Clientes</h2>
              <Btn size="sm"><IcPlus size={12}/> Nuevo</Btn>
            </div>
            <Input placeholder="Buscar cliente, RFC, portafolio…" leading={<IcSearch size={14}/>} />
            <div style={{ display: 'flex', gap: 6 }}>
              <Chip active>Todos · 14</Chip>
              <Chip>Individuos · 8</Chip>
              <Chip>Empresas · 4</Chip>
              <Chip>Fideicomiso · 2</Chip>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 16px' }}>
            <ClientNode active name="Familia Mendoza" type="Familia" props={4} portfolios={2} rev="$58K/mes" tone="violet" expanded>
              <PortfolioNode name="Residencial CDMX" props={3} value="$54.2M" />
              <PortfolioNode name="Inversión León" props={1} value="$8.5M" />
            </ClientNode>
            <ClientNode name="Inversiones Polanco SA" type="Empresa" props={6} portfolios={3} rev="$184K/mes" tone="info" />
            <ClientNode name="Carlos Aguirre" type="Individual" props={2} portfolios={1} rev="$34K/mes" tone="ok" />
            <ClientNode name="Fideicomiso 4218 · BBVA" type="Fideicomiso" props={3} portfolios={1} rev="$96K/mes" tone="warn" />
            <ClientNode name="Linda Torres" type="Individual" props={1} portfolios={1} rev="$52K/mes" tone="bad" />
            <ClientNode name="Grupo Inmobiliario León" type="Empresa" props={12} portfolios={4} rev="$420K/mes" tone="violet" />
            <ClientNode name="Despacho Mireles SC" type="Empresa" props={2} portfolios={1} rev="$28K/mes" tone="info" />
            <ClientNode name="Beatriz Mendoza" type="Individual" props={1} portfolios={1} rev="$24K/mes" tone="ok" />
          </div>
        </div>

        {/* Detail */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-muted)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
            <Avatar name="Familia Mendoza" size={56} tone="violet" />
            <div style={{ flex: 1 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cliente · Familia · CLI-0008
              </span>
              <h1 style={{ margin: '4px 0 0', font: '600 24px var(--font-sans)', letterSpacing: '-0.015em' }}>
                Familia Mendoza
              </h1>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>
                Activo desde mar 2022 · representante: Pablo Mendoza · 5 miembros con acceso
              </div>
            </div>
            <Btn variant="secondary" size="md"><IcEdit size={14}/> Editar</Btn>
            <Btn size="md"><IcPlus size={14}/> Nuevo portafolio</Btn>
          </div>

          {/* KPI strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            background: '#fff', border: '1px solid var(--ink-100)', borderRadius: 12, marginBottom: 18,
          }}>
            <KpiCell label="Propiedades" value="4" sub="2 portafolios" tone="violet" />
            <KpiCell label="Valor total" value="$62.7M" sub="MXN · actualizado may" border />
            <KpiCell label="Renta mensual" value="$58,000" sub="89% ocupado" border />
            <KpiCell label="Documentos" value="32" sub="2 por expirar" border />
            <KpiCell label="Salud financiera" value="A−" sub="1 pago tarde · 90 días" border progress={86} />
          </div>

          {/* 2-col content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Portfolios */}
              <Card title="Portafolios" subtitle="2 portafolios · 4 propiedades" action={<Btn variant="ghost" size="sm"><IcPlus size={12}/> Crear</Btn>} padding={0}>
                <PortfolioCard
                  name="Residencial CDMX"
                  desc="Propiedades habitacionales en zona Polanco y Roma"
                  props={3} value="$54.2M" rent="$34,000" status="Operando"
                />
                <PortfolioCard
                  name="Inversión León"
                  desc="Lote para desarrollo · vinculado al catastro de León"
                  props={1} value="$8.5M" rent="—" status="En construcción"
                />
              </Card>

              {/* Propiedades de este cliente */}
              <Card title="Propiedades" subtitle="4 propiedades agrupadas por portafolio" action={<Btn variant="ghost" size="sm">Ver todas <IcArrowUR size={11}/></Btn>}>
                <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    ['Casa Polanco 412', 'Polanco V', '$8.4M', 'Activa', 'ok'],
                    ['Loft Condesa', 'Condesa', '$3.2M', 'Borrador', 'neutral'],
                    ['Edificio Roma 88 · A-302', 'Roma Nte', '$48.0M', 'Activa', 'ok'],
                    ['Predio Lomas León', 'Lomas Catedral', '$8.5M', 'En obra', 'warn'],
                  ].map((p, i) => (
                    <div key={i} style={{
                      border: '1px solid var(--ink-100)', borderRadius: 10, overflow: 'hidden', display: 'flex',
                    }}>
                      <div className="pp-img-ph" style={{ width: 80, height: 80, fontSize: 0, borderRadius: 0, flex: '0 0 auto' }} />
                      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                        <span style={{ font: '500 13px var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p[0]}</span>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{p[1]}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span className="mono num" style={{ fontSize: 12, fontWeight: 600 }}>{p[2]}</span>
                          <Badge tone={p[4]}>{p[3]}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card title="Datos fiscales y legales" padding={16}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Row2 k="RFC" v="MENA850412QW3" mono />
                  <Row2 k="Tipo" v="Familia" />
                  <Row2 k="Régimen" v="Personas físicas con actividad" />
                  <Row2 k="Domicilio fiscal" v="Polanco V, CDMX 11550" />
                  <Row2 k="Contacto admin." v="Pablo Mendoza · 55 5234 1111" />
                  <Row2 k="Contacto legal" v="Lic. Andrea Cruz · GFC" />
                </div>
              </Card>

              <Card title="Titularidad" subtitle="Co-propiedad activa" padding={16}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    ['Pablo Mendoza', 40, 'violet'],
                    ['Sofía Mendoza', 35, 'ok'],
                    ['Beatriz Mendoza', 15, 'info'],
                    ['Otros (2)', 10, 'neutral'],
                  ].map(([n, p, t]) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={n} size={26} tone={t} />
                      <span style={{ flex: 1, font: '500 13px var(--font-sans)' }}>{n}</span>
                      <span className="mono num" style={{ fontSize: 12, color: 'var(--ink-700)', fontWeight: 600 }}>{p}%</span>
                    </div>
                  ))}
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--ink-100)', overflow: 'hidden', display: 'flex' }}>
                    <span style={{ width: '40%', background: 'var(--pp-500)' }} />
                    <span style={{ width: '35%', background: '#10B981' }} />
                    <span style={{ width: '15%', background: '#3B82F6' }} />
                    <span style={{ width: '10%', background: 'var(--ink-400)' }} />
                  </div>
                </div>
              </Card>

              <Card title="Notas internas" padding={16}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.55 }}>
                  Cliente clave desde 2022. Prefiere reportes en PDF firmado al cierre de mes. Pablo aprueba todo via correo, Sofía solo recibe copias.
                  <span style={{ display: 'block', marginTop: 8, fontSize: 11, color: 'var(--ink-500)' }}>
                    Editado por <strong>Pablo García</strong> · 03 may 2026
                  </span>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const ClientNode = ({ name, type, props, portfolios, rev, tone, active, expanded, children }) => (
  <div>
    <div style={{
      padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8,
      background: active ? 'var(--pp-50)' : 'transparent', cursor: 'pointer',
      border: active ? '1px solid var(--pp-100)' : '1px solid transparent',
    }}>
      <IcChevR size={12} style={{ color: 'var(--ink-500)', transform: expanded ? 'rotate(90deg)' : 'none', flex: '0 0 auto' }} />
      <Avatar name={name} size={28} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          font: '500 13px var(--font-sans)', color: active ? 'var(--pp-700)' : 'var(--ink-900)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', display: 'flex', gap: 6 }}>
          <span>{type}</span><span>·</span><span>{props}p</span><span>·</span><span>{portfolios}port</span>
        </div>
      </div>
      <span className="mono num" style={{ fontSize: 11, color: active ? 'var(--pp-700)' : 'var(--ink-600)', fontWeight: 500 }}>{rev}</span>
    </div>
    {expanded && children && (
      <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginBottom: 4 }}>
        {children}
      </div>
    )}
  </div>
);

const PortfolioNode = ({ name, props, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>
    <span style={{ width: 14, borderLeft: '1px solid var(--ink-200)', borderBottom: '1px solid var(--ink-200)', height: 10, marginRight: 2, alignSelf: 'flex-start', marginTop: 2 }} />
    <Dot tone="violet" size={6} />
    <span style={{ flex: 1, font: '500 12px var(--font-sans)', color: 'var(--ink-700)' }}>{name}</span>
    <span className="mono num" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{props}p · {value}</span>
  </div>
);

const PortfolioCard = ({ name, desc, props, value, rent, status, last }) => (
  <div style={{
    padding: 14, borderTop: '1px solid var(--ink-100)',
    display: 'flex', gap: 14, alignItems: 'center',
  }}>
    <span style={{
      width: 40, height: 40, borderRadius: 8, background: 'var(--pp-50)', color: 'var(--pp-600)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
    }}><IcLayers size={18}/></span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ font: '600 14px var(--font-sans)' }}>{name}</span>
        <Badge tone={status === 'Operando' ? 'ok' : 'warn'}>{status}</Badge>
      </div>
      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-500)' }}>{desc}</p>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div className="mono num" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>{value}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{props} prop · {rent}/mes</div>
    </div>
    <Btn variant="icon"><IcArrowR size={14}/></Btn>
  </div>
);

Object.assign(window, { Clientes, ClientNode, PortfolioNode, PortfolioCard });
