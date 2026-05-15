// UI Kit — buttons, inputs, badges, table, file row, inspector preview, switches, etc.
// All consume tokens defined in tokens.css.

const UIKit = () => {
  return (
    <div className="pp" style={{
      width: '100%', height: '100%', background: 'var(--bg)', padding: 48,
      display: 'flex', flexDirection: 'column', gap: 28, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
            02 · Sistema visual
          </span>
          <h1 style={{ margin: '8px 0 0', font: '600 36px/1.05 var(--font-sans)', letterSpacing: '-0.025em' }}>
            Componentes
          </h1>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', letterSpacing: '0.12em' }}>
          v0.1 · INTERNO
        </div>
      </div>

      {/* Row 1 — Buttons */}
      <Block title="Botones">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 18 }}>
          <ButtonGroup label="Primario">
            <Btn>Crear propiedad</Btn>
            <Btn size="md">Crear</Btn>
            <Btn size="sm">Crear</Btn>
            <Btn disabled>Crear</Btn>
          </ButtonGroup>
          <ButtonGroup label="Secundario">
            <Btn variant="secondary">Editar</Btn>
            <Btn variant="secondary" size="md">Editar</Btn>
            <Btn variant="secondary" size="sm">Editar</Btn>
          </ButtonGroup>
          <ButtonGroup label="Ghost / icono">
            <Btn variant="ghost"><IcEdit size={16}/> Editar</Btn>
            <Btn variant="ghost" size="md"><IcDownload size={14}/> Exportar</Btn>
            <Btn variant="icon"><IcMore size={16}/></Btn>
          </ButtonGroup>
          <ButtonGroup label="Destructivo / con icono">
            <Btn variant="danger">Eliminar</Btn>
            <Btn><IcPlus size={14}/> Nueva propiedad</Btn>
            <Btn variant="secondary"><IcDownload size={14}/> CSV</Btn>
          </ButtonGroup>
        </div>
      </Block>

      {/* Row 2 — Inputs + badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <Block title="Inputs">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Nombre de la propiedad">
              <Input placeholder="Casa Polanco 412" />
            </Field>
            <Field label="Ciudad">
              <Select value="Ciudad de México" />
            </Field>
            <Field label="Valor estimado · MXN" hint="Sugerido desde el lote vinculado.">
              <Input mono value="$8,420,000" />
            </Field>
            <Field label="Buscar" >
              <Input placeholder="Colonia, calle, folio…" leading={<IcSearch size={14}/>} trailing={<Kbd>⌘K</Kbd>} />
            </Field>
            <Field label="Notas" full>
              <Textarea placeholder="Observaciones internas — vista solo para administradores del portafolio." />
            </Field>
          </div>
        </Block>

        <Block title="Badges · estatus · chips">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Row>
              <Badge>Activa</Badge>
              <Badge tone="warn">En revisión</Badge>
              <Badge tone="bad">Vencido</Badge>
              <Badge tone="ok">Pagado</Badge>
              <Badge tone="violet">Premium</Badge>
              <Badge tone="neutral">Borrador</Badge>
            </Row>
            <Row>
              <Chip>Polanco</Chip>
              <Chip>Roma Nte</Chip>
              <Chip active>Del Valle</Chip>
              <Chip>Condesa</Chip>
              <Chip onRemove>Cuauhtémoc</Chip>
            </Row>
            <Row>
              <SensitivityPill level="normal" />
              <SensitivityPill level="sensible" />
            </Row>
          </div>
        </Block>
      </div>

      {/* Row 3 — Table + Inspector card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <Block title="Tabla · listado densa">
          <Table />
        </Block>

        <Block title="Inspector · panel lateral">
          <InspectorCard />
        </Block>
      </div>

      {/* Row 4 — Doc row + toggles + KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: 18 }}>
        <Block title="Documento · fila">
          <DocRow />
        </Block>
        <Block title="Toggles & control">
          <Toggles />
        </Block>
        <Block title="KPI · tarjeta de métrica">
          <KpiCard />
        </Block>
      </div>
    </div>
  );
};

/* ───────────── building blocks ───────────── */

const Block = ({ title, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--pp-500)' }} />
      <span style={{ font: '500 12px var(--font-sans)', color: 'var(--ink-700)' }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
    </div>
    <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, padding: 18, background: 'var(--bg)' }}>
      {children}
    </div>
  </div>
);

const ButtonGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>{children}</div>
  </div>
);

const Btn = ({ children, variant = 'primary', size = 'lg', disabled = false, style = {}, ...rest }) => {
  const sizeMap = {
    lg: { padding: '10px 16px', fontSize: 14, height: 40 },
    md: { padding: '8px 12px', fontSize: 13, height: 34 },
    sm: { padding: '6px 10px', fontSize: 12, height: 28 },
  };
  const variantMap = {
    primary:   { background: 'var(--pp-500)', color: '#fff', border: '1px solid transparent', boxShadow: '0 1px 2px rgba(27,8,83,0.2), 0 1px 0 rgba(255,255,255,0.15) inset' },
    secondary: { background: '#fff', color: 'var(--ink-700)', border: '1px solid var(--ink-200)', boxShadow: '0 1px 2px rgba(27,8,83,0.04)' },
    ghost:     { background: 'transparent', color: 'var(--ink-700)', border: '1px solid transparent' },
    icon:      { background: 'transparent', color: 'var(--ink-600)', border: '1px solid var(--ink-200)', width: 32, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
    danger:    { background: '#fff', color: 'var(--bad)', border: '1px solid var(--ink-200)' },
  };
  const s = { ...sizeMap[size], ...variantMap[variant] };
  return (
    <button disabled={disabled} style={{
      ...s, borderRadius: 8, font: `500 ${s.fontSize}px var(--font-sans)`, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1, display: 'inline-flex', alignItems: 'center', gap: 6, letterSpacing: '-0.005em',
      ...style,
    }} {...rest}>
      {children}
    </button>
  );
};

const Field = ({ label, hint, children, full }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : undefined }}>
    <label style={{ font: '500 12px var(--font-sans)', color: 'var(--ink-700)' }}>{label}</label>
    {children}
    {hint && <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{hint}</span>}
  </div>
);

const Input = ({ placeholder, value, mono, leading, trailing }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    height: 36, padding: '0 10px', borderRadius: 8,
    border: '1px solid var(--ink-200)', background: '#fff',
    boxShadow: '0 1px 2px rgba(27,8,83,0.04)',
  }}>
    {leading && <span style={{ color: 'var(--ink-500)', display: 'flex' }}>{leading}</span>}
    <span style={{
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: mono ? 13 : 14, color: value ? 'var(--ink-900)' : 'var(--ink-400)',
      flex: 1,
    }}>{value || placeholder}</span>
    {trailing}
  </div>
);

const Select = ({ value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    height: 36, padding: '0 10px', borderRadius: 8,
    border: '1px solid var(--ink-200)', background: '#fff',
  }}>
    <span style={{ fontSize: 14, color: 'var(--ink-900)', flex: 1 }}>{value}</span>
    <IcChevD size={14} style={{ color: 'var(--ink-500)' }} />
  </div>
);

const Textarea = ({ placeholder }) => (
  <div style={{
    minHeight: 64, padding: '10px 12px', borderRadius: 8,
    border: '1px solid var(--ink-200)', background: '#fff',
    fontSize: 14, color: 'var(--ink-400)', lineHeight: 1.5,
  }}>{placeholder}</div>
);

const Kbd = ({ children }) => (
  <span className="mono" style={{
    fontSize: 10, padding: '2px 5px', borderRadius: 4,
    background: 'var(--ink-50)', border: '1px solid var(--ink-200)', color: 'var(--ink-600)',
  }}>{children}</span>
);

const Row = ({ children }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>{children}</div>
);

const Badge = ({ children, tone = 'ok-soft' }) => {
  const tones = {
    'ok-soft': { bg: '#ECFDF5', fg: '#065F46', dot: '#10B981' },
    ok: { bg: '#ECFDF5', fg: '#065F46', dot: '#10B981' },
    warn: { bg: '#FFFBEB', fg: '#92400E', dot: '#F59E0B' },
    bad:  { bg: '#FEF2F2', fg: '#991B1B', dot: '#EF4444' },
    violet: { bg: 'var(--pp-50)', fg: 'var(--pp-700)', dot: 'var(--pp-500)' },
    neutral: { bg: 'var(--ink-50)', fg: 'var(--ink-600)', dot: 'var(--ink-400)' },
  };
  const t = tones[tone] || tones.ok;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', borderRadius: 999, background: t.bg, color: t.fg,
      font: '500 11px var(--font-sans)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />
      {children}
    </span>
  );
};

const Chip = ({ children, active, onRemove }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 10px', borderRadius: 999,
    background: active ? 'var(--pp-500)' : 'var(--ink-50)',
    color: active ? '#fff' : 'var(--ink-700)',
    border: active ? 'none' : '1px solid var(--ink-200)',
    font: '500 12px var(--font-sans)',
  }}>
    {children}
    {onRemove && <IcX size={12} />}
  </span>
);

const SensitivityPill = ({ level }) => {
  const isSens = level === 'sensible';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 6,
      background: isSens ? 'var(--pp-50)' : 'var(--ink-50)',
      color: isSens ? 'var(--pp-700)' : 'var(--ink-600)',
      border: `1px solid ${isSens ? 'var(--pp-200)' : 'var(--ink-200)'}`,
      font: '500 11px var(--font-sans)',
    }}>
      <IcShield size={12} />
      Sensibilidad · {level}
    </span>
  );
};

const Table = () => {
  const rows = [
    ['Casa Polanco 412', 'Polanco V', 'Residencial', 'Activa', '218 m²', '$8.4M'],
    ['Edificio Roma 88', 'Roma Nte', 'Multifamiliar', 'Activa', '1,420 m²', '$48.0M'],
    ['Loft Condesa', 'Condesa', 'Residencial', 'Borrador', '92 m²', '$3.2M'],
    ['Local Del Valle 12', 'Del Valle', 'Comercial', 'En revisión', '180 m²', '$6.1M'],
  ];
  return (
    <div style={{ border: '1px solid var(--ink-100)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr',
        padding: '10px 14px', background: 'var(--bg-subtle)', color: 'var(--ink-500)',
        font: '500 11px var(--font-sans)', letterSpacing: '0.04em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--ink-100)',
      }}>
        <span>Propiedad</span><span>Colonia</span><span>Tipo</span><span>Estatus</span><span>Área</span><span style={{ textAlign: 'right' }}>Valor est.</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr',
          padding: '12px 14px', alignItems: 'center', fontSize: 13, color: 'var(--ink-900)',
          borderBottom: i < rows.length - 1 ? '1px solid var(--ink-100)' : 'none',
          background: i % 2 === 1 ? 'var(--bg-muted)' : '#fff',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pp-img-ph" style={{ width: 28, height: 28, borderRadius: 6, fontSize: 0 }} />
            <span style={{ fontWeight: 500 }}>{r[0]}</span>
          </span>
          <span style={{ color: 'var(--ink-600)' }}>{r[1]}</span>
          <span style={{ color: 'var(--ink-600)' }}>{r[2]}</span>
          <span><Badge tone={r[3]==='Activa'?'ok':r[3]==='Borrador'?'neutral':'warn'}>{r[3]}</Badge></span>
          <span className="mono num" style={{ color: 'var(--ink-700)' }}>{r[4]}</span>
          <span className="mono num" style={{ textAlign: 'right', fontWeight: 500 }}>{r[5]}</span>
        </div>
      ))}
    </div>
  );
};

const InspectorCard = () => (
  <div style={{ border: '1px solid var(--ink-100)', borderRadius: 10, overflow: 'hidden' }}>
    <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--ink-100)' }}>
      <div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--pp-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Colonia</div>
        <div style={{ font: '600 18px var(--font-sans)', marginTop: 2, letterSpacing: '-0.01em' }}>Polanco V Sección</div>
      </div>
      <Btn variant="icon"><IcX size={14}/></Btn>
    </div>
    <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
      {[
        ['Valor fiscal', '$78,420/m²'],
        ['Valor comercial', '$182,300/m²'],
        ['Sector', '04-12'],
        ['Uso suelo', 'H30/20/Z'],
      ].map(([k, v]) => (
        <div key={k}>
          <div style={{ color: 'var(--ink-500)' }}>{k}</div>
          <div className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 500, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ padding: '0 16px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 6 }}>Observaciones</div>
      <div style={{ fontSize: 12, color: 'var(--ink-700)', lineHeight: 1.5 }}>
        Avenida principal con frente comercial. Restricción de altura por zona patrimonial.
      </div>
    </div>
    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--ink-100)', background: 'var(--bg-subtle)', display: 'flex', gap: 8 }}>
      <Btn size="md" style={{ flex: 1, justifyContent: 'center' }}><IcPlus size={14}/> Crear propiedad</Btn>
      <Btn variant="secondary" size="md"><IcDownload size={14}/></Btn>
    </div>
  </div>
);

const DocRow = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {[
      { name: 'Escritura · matriz 4218', cat: 'Escritura', sens: 'sensible', size: '2.4 MB', date: '12 may 2026' },
      { name: 'Predial 2026 Q1', cat: 'Predial', sens: 'normal', size: '180 KB', date: '04 abr 2026' },
      { name: 'Avalúo BBVA mar-2026', cat: 'Avalúo', sens: 'sensible', size: '5.1 MB', date: '22 mar 2026' },
    ].map((d, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
        border: '1px solid var(--ink-100)', borderRadius: 8, background: '#fff',
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 7, background: 'var(--pp-50)', color: 'var(--pp-600)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><IcDoc size={16}/></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-900)' }}>{d.name}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2, display: 'flex', gap: 10 }}>
            <span>{d.cat}</span>
            <span>·</span>
            <span>{d.size}</span>
            <span>·</span>
            <span>{d.date}</span>
          </div>
        </div>
        <SensitivityPill level={d.sens} />
        <Btn variant="icon"><IcDownload size={14}/></Btn>
        <Btn variant="icon"><IcMore size={14}/></Btn>
      </div>
    ))}
  </div>
);

const Toggles = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    {[
      ['Tramos / vialidades', true],
      ['Capa de lotes', true],
      ['Servicios cercanos', false],
    ].map(([name, on]) => (
      <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-700)' }}>{name}</span>
        <span style={{
          width: 32, height: 18, borderRadius: 999, background: on ? 'var(--pp-500)' : 'var(--ink-200)',
          position: 'relative', transition: '.2s',
        }}>
          <span style={{
            position: 'absolute', top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: 999,
            background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }} />
        </span>
      </div>
    ))}
    <div style={{ height: 1, background: 'var(--ink-100)' }} />
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--ink-100)' }}>
      <SegBtn active><IcGrid size={14}/> Grid</SegBtn>
      <SegBtn><IcList size={14}/> Lista</SegBtn>
    </div>
  </div>
);

const SegBtn = ({ children, active }) => (
  <button style={{
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
    background: active ? '#fff' : 'transparent',
    color: active ? 'var(--ink-900)' : 'var(--ink-500)',
    font: '500 12px var(--font-sans)',
    boxShadow: active ? '0 1px 2px rgba(27,8,83,0.06)' : 'none',
  }}>{children}</button>
);

const KpiCard = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      Valor portafolio · MXN
    </span>
    <div style={{ font: '600 32px/1 var(--font-sans)', letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>
      $184,420,000
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge tone="ok"><IcArrowUp size={10}/> +4.2%</Badge>
      <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>vs trimestre anterior</span>
    </div>
    <svg viewBox="0 0 200 48" style={{ width: '100%', height: 48, marginTop: 4 }}>
      <defs>
        <linearGradient id="kpi-spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--pp-500)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--pp-500)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,38 L20,34 L40,36 L60,28 L80,30 L100,22 L120,26 L140,16 L160,18 L180,10 L200,6 L200,48 L0,48 Z" fill="url(#kpi-spark)"/>
      <path d="M0,38 L20,34 L40,36 L60,28 L80,30 L100,22 L120,26 L140,16 L160,18 L180,10 L200,6" stroke="var(--pp-500)" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
);

Object.assign(window, {
  UIKit, Btn, Field, Input, Select, Textarea, Kbd, Badge, Chip, SensitivityPill,
  SegBtn, Block, Row,
});
