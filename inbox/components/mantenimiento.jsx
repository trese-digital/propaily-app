// Mantenimiento — Kanban + tabla de proveedores en aside

const MAINT_COLUMNS = [
  {
    id: 'nuevo', label: 'Nuevo', tone: 'neutral', count: 2,
    cards: [
      { id: 'M-218', title: 'Fuga bajo lavabo cocina', prop: 'Casa Polanco 412', cat: 'Plomería', priority: 'media', requested: 'hace 2h', requester: 'Sofía Mendoza', requesterTone: 'violet', photo: true },
      { id: 'M-217', title: 'Cambio de cerradura puerta principal', prop: 'Loft Condesa', cat: 'Cerrajería', priority: 'baja', requested: 'ayer', requester: 'Carlos y Mariana', requesterTone: 'bad' },
    ],
  },
  {
    id: 'revision', label: 'En revisión', tone: 'warn', count: 1,
    cards: [
      { id: 'M-216', title: 'Falla aire acondicionado A-302', prop: 'Edificio Roma 88', cat: 'Eléctrico', priority: 'alta', requested: 'hace 1d', requester: 'Daniel Reyes', requesterTone: 'info', photo: true, eta: '14 may', est: 8500 },
    ],
  },
  {
    id: 'asignado', label: 'Asignado', tone: 'violet', count: 2,
    cards: [
      { id: 'M-214', title: 'Goteo en techo · habitación principal', prop: 'Casa Coyoacán 88', cat: 'Plomería', priority: 'alta', requested: 'hace 3d', vendor: 'Hidroplom MX', vendorTone: 'ok', est: 12000, eta: '15 may' },
      { id: 'M-213', title: 'Pintura escalera y pasillo', prop: 'Edificio Roma 88', cat: 'Pintura', priority: 'baja', requested: 'hace 5d', vendor: 'Brocha Fina SA', vendorTone: 'violet', est: 18500, eta: '20 may' },
    ],
  },
  {
    id: 'progreso', label: 'En progreso', tone: 'info', count: 2,
    cards: [
      { id: 'M-211', title: 'Reparación impermeabilizante azotea', prop: 'Bodega Tlalpan', cat: 'Estructural', priority: 'urgente', requested: 'hace 1sem', vendor: 'CoverPro', vendorTone: 'bad', est: 48000, eta: 'hoy', photo: true, progress: 70 },
      { id: 'M-209', title: 'Limpieza profunda · cambio de inquilino', prop: 'Penthouse Cuauhtémoc', cat: 'Limpieza', priority: 'media', requested: 'hace 4d', vendor: 'CleanCo', vendorTone: 'ok', est: 6500, eta: '13 may', progress: 45 },
    ],
  },
  {
    id: 'completado', label: 'Completado', tone: 'ok', count: 1,
    cards: [
      { id: 'M-205', title: 'Reemplazo de boiler', prop: 'Casa Polanco 412', cat: 'Plomería', priority: 'urgente', requested: '24 abr', vendor: 'Hidroplom MX', vendorTone: 'ok', est: 14000, real: 13200, completed: '03 may' },
    ],
  },
];

const Mantenimiento = () => {
  return (
    <AppShell active="mantenimiento" breadcrumb={['Portafolio interno', 'Mantenimiento']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Tabs items={[
          ['solicitudes', 'Solicitudes', 8],
          ['proveedores', 'Proveedores', 14],
          ['recurrentes', 'Mantenimientos recurrentes', 6],
          ['historial', 'Historial'],
        ]} active="solicitudes" />

        {/* Header */}
        <div style={{ padding: '18px 28px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Solicitudes de mantenimiento
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>
              <span className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 600 }}>8</span> abiertas · <span style={{ color: '#EF4444', fontWeight: 600 }}>1 urgente</span> · costo estimado del mes <span className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 600 }}>$93,000</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: 3, borderRadius: 8, border: '1px solid var(--ink-200)', background: '#fff' }}>
            <SegBtn active><IcGrid size={14}/> Kanban</SegBtn>
            <SegBtn><IcList size={14}/> Tabla</SegBtn>
          </div>
          <Btn variant="secondary" size="md"><IcDownload size={14}/> Reporte</Btn>
          <Btn size="md"><IcPlus size={14}/> Nueva solicitud</Btn>
        </div>

        {/* Filters */}
        <div style={{ padding: '0 28px 14px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterChip label="Propiedad" value="Todas" />
          <FilterChip label="Categoría" value="Todas" />
          <FilterChip label="Prioridad" value="Urgente · Alta" highlighted />
          <FilterChip label="Proveedor" value="Cualquiera" />
          <FilterChip label="Asignado a" value="Yo" />
          <div style={{ flex: 1 }} />
          <Input placeholder="Buscar #M-…" leading={<IcSearch size={12}/>} />
        </div>

        {/* Kanban */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, height: '100%', minHeight: 600 }}>
            {MAINT_COLUMNS.map(col => <MaintColumn key={col.id} col={col} />)}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const MaintColumn = ({ col }) => {
  const toneColors = {
    neutral: 'var(--ink-400)', warn: '#F59E0B', violet: 'var(--pp-500)', info: '#3B82F6', ok: '#10B981',
  };
  return (
    <div style={{
      background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--ink-100)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0,
    }}>
      <div style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid var(--ink-100)', background: '#fff',
      }}>
        <Dot tone={col.tone} ring />
        <span style={{ font: '600 13px var(--font-sans)', color: 'var(--ink-900)' }}>{col.label}</span>
        <span className="mono num" style={{
          padding: '1px 6px', borderRadius: 999, fontSize: 11,
          background: 'var(--bg-subtle)', color: 'var(--ink-600)', border: '1px solid var(--ink-100)', fontWeight: 500,
        }}>{col.count}</span>
        <span style={{ flex: 1 }} />
        <Btn variant="icon" style={{ width: 24, height: 24 }}><IcPlus size={12}/></Btn>
      </div>
      <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto', minHeight: 0 }}>
        {col.cards.map(c => <MaintCard key={c.id} c={c} />)}
        {col.cards.length === 0 && (
          <div style={{
            padding: 16, border: '1px dashed var(--ink-200)', borderRadius: 8, color: 'var(--ink-500)',
            fontSize: 12, textAlign: 'center',
          }}>Sin solicitudes</div>
        )}
      </div>
    </div>
  );
};

const MaintCard = ({ c }) => {
  const priTone = c.priority === 'urgente' ? 'bad' : c.priority === 'alta' ? 'warn' : c.priority === 'media' ? 'info' : 'neutral';
  const priColor = c.priority === 'urgente' ? '#EF4444' : c.priority === 'alta' ? '#F59E0B' : c.priority === 'media' ? '#3B82F6' : 'var(--ink-400)';
  return (
    <div style={{
      background: '#fff', borderRadius: 10, border: '1px solid var(--ink-100)',
      padding: 12, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative',
      boxShadow: c.priority === 'urgente' ? '0 0 0 2px rgba(239,68,68,0.15)' : 'var(--shadow-xs)',
    }}>
      {c.priority === 'urgente' && (
        <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#EF4444', borderRadius: '10px 10px 0 0' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.08em' }}>{c.id}</span>
        <span style={{ flex: 1 }} />
        <Badge tone={priTone}>{c.priority}</Badge>
      </div>
      <div style={{ font: '600 13px var(--font-sans)', color: 'var(--ink-900)', lineHeight: 1.35 }}>{c.title}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <IcBuilding size={11} /> {c.prop}
      </div>

      {c.photo && (
        <div className="pp-img-ph" style={{ height: 60, borderRadius: 6, fontSize: 0, marginTop: 2 }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Chip>{c.cat}</Chip>
        {c.est && <span className="mono num" style={{ fontSize: 11, color: 'var(--ink-700)', fontWeight: 500 }}>{fmtMxn(c.est)}</span>}
      </div>

      {c.progress && (
        <Progress value={c.progress} tone="info" height={4} right={`${c.progress}%`} />
      )}

      <div style={{ height: 1, background: 'var(--ink-100)', margin: '2px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {c.vendor ? (
          <>
            <Avatar name={c.vendor} size={20} tone={c.vendorTone} />
            <span style={{ fontSize: 11, color: 'var(--ink-600)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.vendor}</span>
          </>
        ) : c.requester ? (
          <>
            <Avatar name={c.requester} size={20} tone={c.requesterTone} />
            <span style={{ fontSize: 11, color: 'var(--ink-600)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.requester}</span>
          </>
        ) : null}
        <span className="mono" style={{ fontSize: 10, color: c.eta === 'hoy' ? 'var(--bad)' : 'var(--ink-500)', fontWeight: c.eta === 'hoy' ? 600 : 400 }}>
          {c.completed ? `✓ ${c.completed}` : c.eta ? `→ ${c.eta}` : c.requested}
        </span>
      </div>
    </div>
  );
};

Object.assign(window, { Mantenimiento, MaintColumn, MaintCard });
