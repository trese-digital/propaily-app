// Mobile screens — propaily app for tenants / owners / on-the-go admins
// Each screen rendered inside an <IOSDevice> shell on the canvas.
// Mantra de README: mobile es "consultar + aprobar", no edición pesada.

// ─── Shared mobile bits ──────────────────────────────────────────────
const MStack = ({ children, gap = 0, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>
);

const MSection = ({ title, action, children, gap = 8, style = {} }) => (
  <div style={{ padding: '8px 18px 14px', ...style }}>
    {(title || action) && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {title && <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>{title}</span>}
        <span style={{ flex: 1 }} />
        {action}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
  </div>
);

const MCard = ({ children, style = {}, accent }) => (
  <div style={{
    background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)',
    boxShadow: '0 1px 2px rgba(27,8,83,0.04)', padding: 14,
    borderColor: accent ? 'var(--pp-200)' : 'var(--ink-100)',
    ...style,
  }}>{children}</div>
);

const MTabBar = ({ active = 0 }) => {
  const items = [
    { id: 'inicio', I: IcChart, l: 'Inicio' },
    { id: 'prop',   I: IcBuilding, l: 'Propiedades' },
    { id: 'rentas', I: IcKey, l: 'Rentas' },
    { id: 'notif',  I: IcBell, l: 'Avisos', dot: true },
    { id: 'yo',     I: IcUsers, l: 'Tú' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 24, paddingTop: 10, paddingInline: 8,
      borderTop: '1px solid var(--ink-100)', background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map((it, i) => {
        const on = i === active;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? 'var(--pp-600)' : 'var(--ink-500)',
            font: '500 10px var(--font-sans)', position: 'relative',
          }}>
            <it.I size={22} />
            {it.l}
            {it.dot && <span style={{ position: 'absolute', top: -2, right: 14, width: 7, height: 7, borderRadius: 999, background: 'var(--pp-500)', border: '2px solid #fff' }} />}
          </div>
        );
      })}
    </div>
  );
};

// ─── 1 · Login / sign-in ─────────────────────────────────────────────
const MobileLogin = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, var(--pp-500) 0%, var(--pp-800) 70%, var(--ink-900) 100%)',
    }}>
      {/* deco shapes */}
      <span style={{ position: 'absolute', top: -80, right: -60, width: 240, height: 240, borderRadius: 999, background: 'rgba(255,255,255,0.10)' }} />
      <span style={{ position: 'absolute', top: 80, left: -40, width: 140, height: 140, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }} />
      <span style={{ position: 'absolute', bottom: 60, right: 30, width: 90, height: 90, borderRadius: 22, background: 'rgba(255,255,255,0.07)', transform: 'rotate(15deg)' }} />

      <div style={{ position: 'absolute', inset: 0, padding: 28, display: 'flex', flexDirection: 'column', color: '#fff' }}>
        <div style={{ marginTop: 32 }}>
          <PropailyMark size={44} bg="#fff" fg="var(--pp-600)" radius={11} />
        </div>
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
          by GF Consultoría
        </span>
        <h1 style={{ margin: '6px 0 0', font: '600 32px/1.1 var(--font-sans)', letterSpacing: '-0.025em' }}>
          Tu portafolio<br/>en el bolsillo.
        </h1>
        <p style={{ margin: '14px 0 0', fontSize: 14, opacity: 0.85, lineHeight: 1.55 }}>
          Consulta propiedades, aprueba documentos y revisa rentas desde cualquier lugar.
        </p>
      </div>
    </div>

    <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button style={{
        height: 50, borderRadius: 12, border: 'none', background: 'var(--ink-900)', color: '#fff',
        font: '600 15px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>Continuar con Google</button>
      <button style={{
        height: 50, borderRadius: 12, border: '1px solid var(--ink-200)', background: '#fff', color: 'var(--ink-900)',
        font: '600 15px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>Continuar con Microsoft</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--ink-200)' }} />
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>O con correo</span>
        <span style={{ flex: 1, height: 1, background: 'var(--ink-200)' }} />
      </div>
      <Input placeholder="tu@empresa.mx" leading={<IcSearch size={14}/>} />
      <button style={{
        height: 50, borderRadius: 12, border: 'none', background: 'var(--pp-500)', color: '#fff',
        font: '600 15px var(--font-sans)', boxShadow: '0 6px 20px rgba(110,58,255,0.25)',
      }}>Enviar enlace mágico</button>
      <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ink-500)', textAlign: 'center', lineHeight: 1.5 }}>
        ¿Eres inquilino? <span style={{ color: 'var(--pp-600)', fontWeight: 600 }}>Pide invitación</span> a tu administrador para entrar.
      </p>
    </div>
  </div>
);

// ─── 2 · Home (owner view) ───────────────────────────────────────────
const MobileHome = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    {/* Top header */}
    <div style={{ padding: '54px 18px 18px', background: '#fff', borderBottom: '1px solid var(--ink-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Avatar name="Pablo Mendoza" size={36} tone="warn" />
        <div style={{ flex: 1 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Familia Mendoza
          </span>
          <div style={{ font: '600 16px var(--font-sans)', letterSpacing: '-0.01em' }}>Buenos días, Pablo</div>
        </div>
        <Btn variant="icon"><IcBell size={16}/></Btn>
      </div>

      {/* Quick KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--pp-50)', border: '1px solid var(--pp-100)' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--pp-700)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Patrimonio
          </div>
          <div className="mono num" style={{ font: '600 20px var(--font-sans)', color: 'var(--ink-900)', letterSpacing: '-0.015em', marginTop: 2 }}>
            $62.7M
          </div>
          <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, marginTop: 1 }}>↗ +4.2% trimestre</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: '#fff', border: '1px solid var(--ink-100)' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Renta del mes
          </div>
          <div className="mono num" style={{ font: '600 20px var(--font-sans)', color: 'var(--ink-900)', letterSpacing: '-0.015em', marginTop: 2 }}>
            $58K
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 1 }}>3 de 4 cobrados</div>
        </div>
      </div>
    </div>

    {/* Alert */}
    <MSection gap={10} style={{ padding: '14px 18px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: '#FFFBEB', borderRadius: 12, border: '1px solid #FDE68A' }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: '#F59E0B', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontWeight: 700 }}>!</span>
        <div style={{ flex: 1 }}>
          <div style={{ font: '600 13px var(--font-sans)', color: '#92400E' }}>2 cosas necesitan tu aprobación</div>
          <div style={{ fontSize: 12, color: '#92400E', opacity: 0.85, marginTop: 2 }}>Propuesta de renovación · avalúo BBVA</div>
        </div>
        <IcChevR size={16} style={{ color: '#92400E', alignSelf: 'center' }} />
      </div>
    </MSection>

    {/* Propiedades */}
    <MSection title="Tus propiedades · 4" action={<span style={{ fontSize: 12, color: 'var(--pp-600)', fontWeight: 600 }}>Ver todas</span>}>
      {[
        ['Casa Polanco 412', 'Polanco V · CDMX', '$8.4M', 'Rentada', 'ok'],
        ['Loft Condesa', 'Condesa · CDMX', '$3.2M', 'Borrador', 'neutral'],
        ['Edificio Roma 88 · A-302', 'Roma Nte · CDMX', '$48.0M', 'Rentada', 'ok'],
      ].map((p, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: 10, background: '#fff', borderRadius: 12,
          border: '1px solid var(--ink-100)', alignItems: 'center',
        }}>
          <div className="pp-img-ph" style={{ width: 56, height: 56, fontSize: 0, borderRadius: 8, flex: '0 0 auto' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '600 14px var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p[0]}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 1 }}>{p[1]}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span className="mono num" style={{ fontSize: 13, fontWeight: 600 }}>{p[2]}</span>
              <Badge tone={p[4]}>{p[3]}</Badge>
            </div>
          </div>
          <IcChevR size={14} style={{ color: 'var(--ink-400)' }} />
        </div>
      ))}
    </MSection>

    {/* Próximos pagos */}
    <MSection title="Próximos pagos · 30 días">
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)', overflow: 'hidden' }}>
        {[
          ['Sofía Mendoza', 'Casa Polanco 412', '$38,000', '01 jun', 'pendiente', 'violet'],
          ['Daniel Reyes', 'Roma 88 · A-302', '$24,500', '15 may', 'pagado', 'ok'],
          ['Carlos y Mariana', 'Loft Condesa', '$19,500', '01 may', 'vencido', 'bad'],
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
          }}>
            <Avatar name={r[0]} size={28} tone={r[5]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '500 13px var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[0]}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{r[1]}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono num" style={{ fontSize: 13, fontWeight: 600 }}>{r[2]}</div>
              <div className="mono" style={{ fontSize: 10, color: r[4] === 'vencido' ? 'var(--bad)' : 'var(--ink-500)' }}>{r[3]}</div>
            </div>
            <Badge tone={r[5]}>{r[4]}</Badge>
          </div>
        ))}
      </div>
    </MSection>

    <MTabBar active={0} />
  </div>
);

// ─── 3 · Detalle de propiedad ────────────────────────────────────────
const MobilePropDetalle = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    {/* Hero */}
    <div className="pp-img-ph" style={{ height: 280, borderRadius: 0, fontSize: 0, position: 'relative', paddingTop: 54 }}>
      <div style={{ position: 'absolute', top: 60, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Btn variant="icon" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}><IcArrowR size={14} style={{ transform: 'rotate(180deg)' }}/></Btn>
        <span style={{ flex: 1 }} />
        <Btn variant="icon" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}><IcMore size={14}/></Btn>
      </div>
      <div style={{ position: 'absolute', left: 14, bottom: 14, right: 14, color: '#fff' }}>
        <Badge tone="ok">Activa · rentada</Badge>
        <h1 style={{ margin: '8px 0 4px', font: '600 24px var(--font-sans)', letterSpacing: '-0.015em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          Casa Polanco 412
        </h1>
        <div className="mono" style={{ fontSize: 11, opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
          Polanco V Sección · CDMX
        </div>
      </div>
    </div>

    {/* Key metrics row */}
    <div style={{
      margin: '-20px 14px 14px', padding: '14px',
      background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)',
      boxShadow: '0 8px 20px rgba(27,8,83,0.08)',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
    }}>
      <MetricMini label="Valor" value="$8.4M" tone="violet" />
      <MetricMini label="Renta/mes" value="$38K" tone="ok" />
      <MetricMini label="Área" value="218m²" tone="neutral" />
    </div>

    {/* Tabs */}
    <div style={{ padding: '0 14px', display: 'flex', gap: 8, marginBottom: 14, overflow: 'auto' }}>
      <Chip active>Resumen</Chip>
      <Chip>Documentos · 12</Chip>
      <Chip>Avalúos · 7</Chip>
      <Chip>Inquilino</Chip>
      <Chip>Histórico</Chip>
    </div>

    {/* Catastro card */}
    <MSection title="Catastro · León">
      <MCard accent>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--pp-500)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcMap size={16}/>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 13px var(--font-sans)' }}>Lote vinculado</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>04-12-178-3 · Polanco V</div>
          </div>
          <Badge tone="ok"><IcCheck size={9}/></Badge>
        </div>
        <div style={{ height: 90, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
          <MapPlaceholder pins withColonyShading />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
          <MetricMini label="Fiscal" value="$5.18M" mono small />
          <MetricMini label="Comercial /m²" value="$182K" mono small />
        </div>
      </MCard>
    </MSection>

    {/* Inquilino */}
    <MSection title="Inquilino actual">
      <MCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="Sofía Mendoza" size={44} tone="violet" />
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 14px var(--font-sans)' }}>Sofía Mendoza</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Desde jun 2024 · $38,000/mes</div>
          </div>
          <Btn variant="icon"><IcArrowR size={14}/></Btn>
        </div>
        <div style={{ height: 1, background: 'var(--ink-100)', margin: '12px -2px' }} />
        <div style={{ padding: 10, background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 20, borderRadius: 999, background: '#F59E0B', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>!</span>
          <span style={{ flex: 1, fontSize: 12, color: '#92400E' }}>Contrato vence en <strong>17 días</strong></span>
          <span style={{ fontSize: 11, color: '#92400E', fontWeight: 600 }}>Renovar →</span>
        </div>
      </MCard>
    </MSection>

    <MTabBar active={1} />
  </div>
);

const MetricMini = ({ label, value, tone = 'violet', small, mono }) => {
  const colors = {
    violet: 'var(--pp-600)', ok: '#10B981', warn: '#F59E0B', neutral: 'var(--ink-700)',
  };
  return (
    <div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
      <div className={mono ? 'mono num' : 'num'} style={{
        font: `600 ${small ? 15 : 18}px var(--font-sans)`,
        color: colors[tone] || colors.violet,
        letterSpacing: '-0.015em', marginTop: 2,
      }}>{value}</div>
    </div>
  );
};

// ─── 4 · Solicitud de mantenimiento ──────────────────────────────────
const MobileMantenimiento = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 24 }}>
    {/* Header */}
    <div style={{ padding: '54px 14px 14px', background: '#fff', borderBottom: '1px solid var(--ink-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Btn variant="icon"><IcX size={14}/></Btn>
        <span style={{ flex: 1, font: '600 16px var(--font-sans)', textAlign: 'center' }}>Nueva solicitud</span>
        <Btn variant="ghost" size="sm" disabled>Enviar</Btn>
      </div>
    </div>

    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <MFormField label="Propiedad">
        <div style={{ padding: 12, background: '#fff', borderRadius: 10, border: '1px solid var(--ink-200)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="pp-img-ph" style={{ width: 32, height: 32, fontSize: 0, borderRadius: 6, flex: '0 0 auto' }} />
          <div style={{ flex: 1 }}>
            <div style={{ font: '500 13px var(--font-sans)' }}>Casa Polanco 412</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>seleccionada por tu unidad</div>
          </div>
          <IcChevD size={12} style={{ color: 'var(--ink-500)' }} />
        </div>
      </MFormField>

      <MFormField label="Categoría">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            ['Plomería', '🚿'],
            ['Eléctrico', '⚡'],
            ['Pintura', '🎨'],
            ['Cerrajería', '🔑'],
            ['Limpieza', '🧹'],
            ['Jardín', '🌿'],
            ['Estruct.', '🏗️'],
            ['Otro', '…'],
          ].map(([n, e], i) => (
            <div key={n} style={{
              padding: '10px 4px', borderRadius: 8, background: i === 0 ? 'var(--pp-50)' : '#fff',
              border: i === 0 ? '1px solid var(--pp-300)' : '1px solid var(--ink-200)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 18 }}>{e}</span>
              <span style={{ fontSize: 10, color: i === 0 ? 'var(--pp-700)' : 'var(--ink-700)', fontWeight: 500 }}>{n}</span>
            </div>
          ))}
        </div>
      </MFormField>

      <MFormField label="Prioridad">
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            ['Baja', 'neutral'],
            ['Media', 'info'],
            ['Alta', 'warn'],
            ['Urgente', 'bad'],
          ].map(([l, t], i) => (
            <div key={l} style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              background: i === 1 ? 'var(--pp-50)' : '#fff',
              border: i === 1 ? '1px solid var(--pp-300)' : '1px solid var(--ink-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              <Dot tone={t} size={7} />
              <span style={{ fontSize: 11, fontWeight: 500, color: i === 1 ? 'var(--pp-700)' : 'var(--ink-700)' }}>{l}</span>
            </div>
          ))}
        </div>
      </MFormField>

      <MFormField label="Descripción">
        <div style={{
          padding: 12, minHeight: 70, background: '#fff', borderRadius: 10,
          border: '1px solid var(--ink-200)', fontSize: 13, color: 'var(--ink-900)', lineHeight: 1.5,
        }}>
          Hay una fuga lenta debajo del lavabo de la cocina. El agua moja el cartón del piso del mueble. No es urgente pero sí está empeorando.
        </div>
      </MFormField>

      <MFormField label="Fotos · ayudan al diagnóstico">
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="pp-img-ph" style={{ width: 70, height: 70, fontSize: 0, borderRadius: 8 }} />
          <div className="pp-img-ph" style={{ width: 70, height: 70, fontSize: 0, borderRadius: 8 }} />
          <div style={{
            width: 70, height: 70, borderRadius: 8, border: '1.5px dashed var(--ink-300)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#fff', color: 'var(--ink-500)', gap: 3,
          }}>
            <IcPlus size={18}/>
            <span style={{ fontSize: 9 }}>Agregar</span>
          </div>
        </div>
      </MFormField>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
        <button style={{
          height: 50, borderRadius: 12, border: 'none', background: 'var(--pp-500)', color: '#fff',
          font: '600 15px var(--font-sans)', boxShadow: '0 6px 18px rgba(110,58,255,0.25)',
        }}>Enviar solicitud</button>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', textAlign: 'center' }}>
          Tu administrador la verá en cuanto llegue.
        </span>
      </div>
    </div>
  </div>
);

const MFormField = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-700)', textTransform: 'uppercase', fontWeight: 600 }}>
      {label}
    </span>
    {children}
  </div>
);

// ─── 5 · Próximo pago (tenant view) ──────────────────────────────────
const MobilePago = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    {/* Header */}
    <div style={{ padding: '54px 18px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <Btn variant="icon"><IcArrowR size={14} style={{ transform: 'rotate(180deg)' }}/></Btn>
      <span style={{ flex: 1, font: '600 16px var(--font-sans)', textAlign: 'center' }}>Tu pago</span>
      <Btn variant="icon"><IcMore size={14}/></Btn>
    </div>

    {/* Hero card with payment due */}
    <div style={{ padding: '14px 14px 0' }}>
      <div style={{
        padding: 22, borderRadius: 18, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--pp-500) 0%, var(--pp-700) 100%)', color: '#fff',
      }}>
        <span style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ position: 'absolute', bottom: -30, left: -20, width: 120, height: 120, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative' }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>
            Próximo pago
          </span>
          <div className="mono num" style={{ font: '600 44px/1 var(--font-sans)', letterSpacing: '-0.025em', marginTop: 4 }}>
            $38,000
          </div>
          <span style={{ fontSize: 13, opacity: 0.85 }}>MXN · Casa Polanco 412</span>

          <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: '#fff', color: 'var(--pp-700)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
            }}>
              <span className="mono" style={{ fontSize: 8, letterSpacing: '0.08em', fontWeight: 600 }}>JUN</span>
              <span className="mono" style={{ font: '700 18px var(--font-sans)', lineHeight: 1 }}>01</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 13px var(--font-sans)' }}>Vence en 17 días</div>
              <div className="mono" style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Lunes 1 de junio · día de pago</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* CTA stack */}
    <div style={{ padding: '14px 14px 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button style={{
        height: 52, borderRadius: 12, border: 'none', background: 'var(--ink-900)', color: '#fff',
        font: '600 15px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>Pagar ahora con SPEI</button>
      <button style={{
        height: 44, borderRadius: 12, border: '1px solid var(--ink-200)', background: '#fff', color: 'var(--ink-700)',
        font: '500 14px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}><IcDownload size={13}/> Subir comprobante</button>
    </div>

    {/* Datos SPEI */}
    <MSection title="Datos para SPEI">
      <MCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MSpeiRow label="Banco" value="BBVA México" />
          <MSpeiRow label="Cuenta CLABE" value="012 180 0123 4567 8901" mono />
          <MSpeiRow label="Beneficiario" value="Familia Mendoza" />
          <MSpeiRow label="Referencia" value="POL412-001" mono accent />
          <MSpeiRow label="Concepto" value="Renta junio 2026" />
        </div>
      </MCard>
    </MSection>

    {/* History */}
    <MSection title="Tus últimos pagos">
      <MCard style={{ padding: 0 }}>
        {[
          ['May 2026', '$38,000', '01 may', 'pagado'],
          ['Abr 2026', '$38,000', '02 abr', 'pagado-tarde'],
          ['Mar 2026', '$38,000', '01 mar', 'pagado'],
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 999,
              background: r[3] === 'pagado' ? '#ECFDF5' : '#FFFBEB',
              color: r[3] === 'pagado' ? '#10B981' : '#F59E0B',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><IcCheck size={14}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ font: '500 13px var(--font-sans)' }}>{r[0]}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{r[3] === 'pagado' ? 'Confirmado' : 'Pagado · 1 día tarde'} · {r[2]}</div>
            </div>
            <span className="mono num" style={{ fontSize: 13, fontWeight: 600 }}>{r[1]}</span>
          </div>
        ))}
      </MCard>
    </MSection>

    <MTabBar active={2} />
  </div>
);

const MSpeiRow = ({ label, value, mono, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{label}</span>
    <span className={mono ? 'mono num' : ''} style={{
      fontSize: 13, color: accent ? 'var(--pp-700)' : 'var(--ink-900)', fontWeight: accent ? 700 : 500,
      background: accent ? 'var(--pp-50)' : 'transparent',
      padding: accent ? '2px 8px' : 0, borderRadius: 4,
    }}>{value}</span>
  </div>
);

// ─── 6 · Notificaciones ──────────────────────────────────────────────
const MobileNotif = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    <div style={{ padding: '54px 18px 14px', background: '#fff', borderBottom: '1px solid var(--ink-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em', flex: 1 }}>Avisos</h1>
        <Btn variant="icon"><IcCheck size={14}/></Btn>
        <Btn variant="icon"><IcSettings size={14}/></Btn>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Chip active>Todos · 9</Chip>
        <Chip>No leídos · 3</Chip>
        <Chip>Pagos</Chip>
        <Chip>Tareas</Chip>
      </div>
    </div>

    <MSection title="Hoy">
      {[
        { type: 'overdue', t: 'Renta vencida', body: 'Carlos y Mariana · Loft Condesa · $19,500', time: 'hace 8min', read: false },
        { type: 'doc-exp', t: 'Avalúo BBVA por expirar', body: 'Casa Polanco 412 · en 17 días', time: 'hace 32min', read: false },
        { type: 'mention', t: 'Marcela te mencionó', body: '"Revisa por favor la propuesta de renovación de Sofía"', time: 'hace 1h', read: false },
      ].map((n, i) => <MNotif key={i} n={n} />)}
    </MSection>

    <MSection title="Ayer">
      {[
        { type: 'payment', t: '5 pagos confirmados', body: 'Sofía · Daniel · Carolina · Linda · Café Quinto', time: '18:00', read: true },
        { type: 'invite', t: 'Andrea aceptó tu invitación', body: 'Se unió a GFC como Operador', time: '14:32', read: true },
        { type: 'valuation', t: 'Catastro 2026 publicado', body: 'Edificio Roma 88 · +3.1% fiscal', time: '09:14', read: true },
      ].map((n, i) => <MNotif key={i} n={n} />)}
    </MSection>

    <MTabBar active={3} />
  </div>
);

const MNotif = ({ n }) => {
  const t = TYPE_ICON[n.type] || TYPE_ICON.task;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14,
      background: n.read ? '#fff' : 'var(--pp-50)',
      borderRadius: 12, border: n.read ? '1px solid var(--ink-100)' : '1px solid var(--pp-200)',
      position: 'relative',
    }}>
      {!n.read && <span style={{ position: 'absolute', left: 4, top: '50%', width: 6, height: 6, borderRadius: 999, background: 'var(--pp-500)', transform: 'translateY(-50%)' }} />}
      <span style={{
        width: 36, height: 36, borderRadius: 10, background: t.bg, color: t.c,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}><t.I size={16}/></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '600 13px var(--font-sans)', color: 'var(--ink-900)' }}>{n.t}</div>
        <p style={{ margin: '2px 0 6px', fontSize: 12, color: 'var(--ink-600)', lineHeight: 1.4 }}>{n.body}</p>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{n.time}</span>
      </div>
    </div>
  );
};

Object.assign(window, {
  MobileLogin, MobileHome, MobilePropDetalle, MobileMantenimiento, MobilePago, MobileNotif,
  MStack, MSection, MCard, MTabBar, MetricMini, MFormField, MSpeiRow, MNotif,
});
