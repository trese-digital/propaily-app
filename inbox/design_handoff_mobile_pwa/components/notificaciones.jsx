// Notificaciones — centro de notificaciones con filtros y agrupación por día.

const NOTIFS = [
  {
    group: 'Hoy',
    items: [
      { id: 1, type: 'overdue', title: 'Renta vencida — Carlos y Mariana', body: 'Loft Condesa · $19,500 MXN · 14 días vencido', actor: 'Sistema', time: 'hace 8 min', read: false, action: 'Ir al contrato' },
      { id: 2, type: 'doc-exp', title: 'Avalúo BBVA por expirar', body: 'Casa Polanco 412 · expira en 17 días (29 may 2026)', actor: 'Sistema', time: 'hace 32 min', read: false, action: 'Renovar avalúo' },
      { id: 3, type: 'mention', title: 'Marcela te mencionó en una tarea', body: '"Pablo, revisa por favor la propuesta de renovación de Sofía Mendoza"', actor: 'Marcela Ortiz', actorTone: 'violet', time: 'hace 1h', read: false, action: 'Ver tarea' },
      { id: 4, type: 'maintenance', title: 'Solicitud asignada — Hidroplom MX', body: 'M-214 · Goteo en techo Casa Coyoacán 88 · ETA 15 may', actor: 'Sistema', time: 'hace 2h', read: true },
    ],
  },
  {
    group: 'Ayer',
    items: [
      { id: 5, type: 'payment', title: '5 pagos confirmados', body: 'Café Quinto · Sofía Mendoza · Linda Torres · Carolina Vargas · Daniel Reyes', actor: 'Sistema', time: 'ayer 18:00', read: true, action: 'Ver pagos' },
      { id: 6, type: 'invite', title: 'Andrea aceptó tu invitación', body: 'Andrea Cruz se unió a GFC como Operador', actor: 'Andrea Cruz', actorTone: 'ok', time: 'ayer 14:32', read: true },
      { id: 7, type: 'valuation', title: 'Valuación actualizada — Edificio Roma 88', body: 'Catastro León publicó valor fiscal 2026: $48,200,000 (+3.1%)', actor: 'Catastro · sistema', time: 'ayer 09:14', read: true },
    ],
  },
  {
    group: 'Esta semana',
    items: [
      { id: 8, type: 'approval', title: 'Documento aprobado — Contrato Sofía', body: 'Lic. Andrea Cruz aprobó el contrato LSE-2024-018', actor: 'Andrea Cruz', actorTone: 'info', time: '10 may', read: true },
      { id: 9, type: 'task', title: 'Tarea completada — vinculación Loft Condesa', body: 'Pablo García vinculó el lote al catastro de León', actor: 'Pablo García', actorTone: 'violet', time: '08 may', read: true },
    ],
  },
];

const TYPE_ICON = {
  overdue:     { I: IcBell, c: '#EF4444', bg: '#FEF2F2' },
  'doc-exp':   { I: IcDoc, c: '#F59E0B', bg: '#FFFBEB' },
  mention:     { I: IcUsers, c: 'var(--pp-600)', bg: 'var(--pp-50)' },
  maintenance: { I: IcSettings, c: '#3B82F6', bg: '#EFF6FF' },
  payment:     { I: IcCheck, c: '#10B981', bg: '#ECFDF5' },
  invite:      { I: IcUsers, c: 'var(--pp-600)', bg: 'var(--pp-50)' },
  valuation:   { I: IcChart, c: '#3B82F6', bg: '#EFF6FF' },
  approval:    { I: IcShield, c: '#10B981', bg: '#ECFDF5' },
  task:        { I: IcCheck, c: 'var(--pp-600)', bg: 'var(--pp-50)' },
};

const Notificaciones = () => {
  return (
    <AppShell active="notif" hideSidebar breadcrumb={['GFC · Pablo García', 'Notificaciones']}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Filters rail */}
        <aside style={{ width: 240, borderRight: '1px solid var(--ink-100)', padding: 18, display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--bg)' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', padding: '4px 8px 8px' }}>Bandejas</div>
          {[
            ['todas', 'Todas', 9, true],
            ['nolei', 'No leídas', 3, false],
            ['menc', 'Menciones', 1, false],
            ['solic', 'Solicitudes', 2, false],
          ].map(([id, l, c, on]) => (
            <button key={id} style={{
              padding: '8px 10px', borderRadius: 8, border: 'none', background: on ? 'var(--pp-50)' : 'transparent',
              color: on ? 'var(--pp-700)' : 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', font: `${on ? 600 : 500} 13px var(--font-sans)`,
            }}>
              <IcBell size={14} />
              <span style={{ flex: 1, textAlign: 'left' }}>{l}</span>
              <span className="mono num" style={{ fontSize: 11, color: on ? 'var(--pp-700)' : 'var(--ink-500)' }}>{c}</span>
            </button>
          ))}

          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', padding: '16px 8px 8px' }}>Categorías</div>
          {[
            ['Pagos', '#10B981'],
            ['Documentos', '#F59E0B'],
            ['Tareas y menciones', 'var(--pp-500)'],
            ['Valuaciones', '#3B82F6'],
            ['Mantenimiento', '#3B82F6'],
            ['Invitaciones', 'var(--pp-500)'],
          ].map(([n, c]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13, color: 'var(--ink-700)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c }} />
              {n}
            </div>
          ))}

          <div style={{ flex: 1 }} />

          <div style={{
            padding: 12, borderRadius: 10, border: '1px solid var(--ink-100)',
            background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IcSettings size={12} style={{ color: 'var(--ink-500)' }} />
              <span style={{ font: '500 12px var(--font-sans)', color: 'var(--ink-700)' }}>Preferencias</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-500)', lineHeight: 1.5 }}>
              Recibe en correo todo lo etiquetado como crítico o vencido.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '20px 28px 14px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--ink-100)' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
                Notificaciones
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>
                3 sin leer · 9 totales · ordenadas por más reciente
              </p>
            </div>
            <Btn variant="ghost" size="md"><IcCheck size={14}/> Marcar todas leídas</Btn>
            <Btn variant="secondary" size="md"><IcSettings size={14}/> Configurar</Btn>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflow: 'auto', padding: '6px 28px 28px' }}>
            {NOTIFS.map(g => (
              <div key={g.group} style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {g.group}
                  </span>
                  <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{g.items.length} eventos</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {g.items.map(n => <NotifRow key={n.id} n={n} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const NotifRow = ({ n }) => {
  const t = TYPE_ICON[n.type] || TYPE_ICON.task;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
      border: '1px solid var(--ink-100)', borderRadius: 10,
      background: n.read ? '#fff' : 'var(--pp-50)',
      borderColor: n.read ? 'var(--ink-100)' : 'var(--pp-200)',
      position: 'relative',
    }}>
      {!n.read && <span style={{ position: 'absolute', left: -4, top: 18, width: 8, height: 8, borderRadius: 999, background: 'var(--pp-500)' }} />}
      <span style={{
        width: 36, height: 36, borderRadius: 9, background: t.bg, color: t.c,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
      }}><t.I size={16} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ font: '600 14px var(--font-sans)', color: 'var(--ink-900)' }}>{n.title}</span>
          {!n.read && <Badge tone="violet">Nueva</Badge>}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>{n.body}</p>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          {n.actorTone && <Avatar name={n.actor} size={16} tone={n.actorTone} />}
          <span>{n.actor}</span>
          <span>·</span>
          <span>{n.time}</span>
        </div>
      </div>
      {n.action && <Btn variant="secondary" size="sm">{n.action} <IcArrowR size={11}/></Btn>}
      <Btn variant="icon"><IcMore size={14}/></Btn>
    </div>
  );
};

Object.assign(window, { Notificaciones, NotifRow });
