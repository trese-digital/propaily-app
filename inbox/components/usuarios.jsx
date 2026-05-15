// Usuarios y Permisos — lista de usuarios + matriz de permisos por rol

const USERS = [
  { name: 'Pablo García', email: 'pablo@gfconsultoria.mx', role: 'company_admin', roleLabel: 'Administrador', last: 'hace 4 min', status: 'activo', tone: 'violet', mfa: true, props: 12 },
  { name: 'Marcela Ortiz', email: 'marcela@gfc.mx', role: 'company_operator', roleLabel: 'Operador', last: 'hace 1h', status: 'activo', tone: 'ok', mfa: true, props: 8 },
  { name: 'Andrea Cruz', email: 'a.cruz@gfc.mx', role: 'company_operator', roleLabel: 'Operador', last: 'hace 3h', status: 'activo', tone: 'info', mfa: false, props: 5 },
  { name: 'Pablo Mendoza', email: 'pablo@familiamendoza.mx', role: 'owner', roleLabel: 'Propietario', last: 'ayer', status: 'activo', tone: 'warn', mfa: true, props: 4 },
  { name: 'Sofía Mendoza', email: 'sofia@correo.mx', role: 'tenant', roleLabel: 'Inquilino', last: '08 may', status: 'activo', tone: 'violet', mfa: false, props: 1 },
  { name: 'Hidroplom MX', email: 'soporte@hidroplom.mx', role: 'vendor', roleLabel: 'Proveedor', last: '07 may', status: 'activo', tone: 'ok', mfa: false, props: 0 },
  { name: 'Lic. Roberto Cano', email: 'r.cano@externo.mx', role: 'guest', roleLabel: 'Invitado', last: '02 may', status: 'pendiente', tone: 'neutral', mfa: false, props: 1 },
];

const PERMS = [
  { group: 'Propiedades', items: [
    ['Ver propiedades', [1,1,1,'p',1,0,'p']],
    ['Crear / editar', [1,1,1,0,0,0,0]],
    ['Borrar', [1,0,0,0,0,0,0]],
    ['Vincular a catastro', [1,1,'p',0,0,0,0]],
  ]},
  { group: 'Rentas y pagos', items: [
    ['Ver contratos', [1,1,1,1,'p',0,0]],
    ['Registrar pago', [1,1,1,0,'p',0,0]],
    ['Editar contrato', [1,1,0,0,0,0,0]],
  ]},
  { group: 'Documentos', items: [
    ['Ver normales', [1,1,1,1,'p','p',1]],
    ['Ver sensibles', [1,1,0,'p',0,0,0]],
    ['Aprobar', [1,1,0,0,0,0,0]],
  ]},
  { group: 'Mantenimiento', items: [
    ['Crear solicitud', [1,1,1,1,1,0,0]],
    ['Asignar proveedor', [1,1,0,0,0,0,0]],
    ['Marcar resuelto', [1,1,0,0,0,'p',0]],
  ]},
  { group: 'Administración', items: [
    ['Gestionar usuarios', [1,'p',0,0,0,0,0]],
    ['Editar permisos', [1,0,0,0,0,0,0]],
    ['Ver auditoría', [1,1,0,0,0,0,0]],
    ['Suscripción y billing', [1,0,0,0,0,0,0]],
  ]},
];

const ROLE_COLS = [
  ['admin', 'Admin', 'violet'],
  ['operator', 'Operador', 'ok'],
  ['operator-limit', 'Op. limitado', 'info'],
  ['owner', 'Propietario', 'warn'],
  ['tenant', 'Inquilino', 'violet'],
  ['vendor', 'Proveedor', 'ok'],
  ['guest', 'Invitado', 'neutral'],
];

const Usuarios = () => {
  return (
    <AppShell active="usuarios" hideSidebar breadcrumb={['GFC · Empresa', 'Equipo y permisos']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Tabs items={[
          ['usuarios', 'Usuarios', 7],
          ['roles', 'Roles y permisos'],
          ['plantillas', 'Plantillas', 4],
          ['invitaciones', 'Invitaciones', 1],
        ]} active="usuarios" />

        {/* Header */}
        <div style={{ padding: '18px 28px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Equipo y permisos
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>
              7 personas con acceso · 1 invitación pendiente · 3 con MFA
            </p>
          </div>
          <Btn variant="secondary" size="md"><IcShield size={14}/> Plantillas</Btn>
          <Btn size="md"><IcPlus size={14}/> Invitar persona</Btn>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 28px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
          {/* Users list */}
          <div>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Usuarios · 7
              </span>
              <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
              <Input placeholder="Buscar…" leading={<IcSearch size={12}/>} />
            </div>
            <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
              {USERS.map((u, i) => (
                <div key={u.email} style={{
                  display: 'grid', gridTemplateColumns: '40px 1.6fr 1fr auto',
                  padding: '12px 14px', alignItems: 'center', gap: 10,
                  borderBottom: i < USERS.length - 1 ? '1px solid var(--ink-100)' : 'none',
                  background: i % 2 === 1 ? 'var(--bg-muted)' : '#fff',
                }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar name={u.name} size={36} tone={u.tone} />
                    {u.mfa && <span title="MFA" style={{
                      position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderRadius: 999,
                      background: '#10B981', color: '#fff', fontSize: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #fff', fontWeight: 700,
                    }}>🔒</span>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-900)' }}>{u.name}</span>
                      {u.status === 'pendiente' && <Badge tone="warn">Invitación pendiente</Badge>}
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{u.email}</div>
                  </div>
                  <div>
                    <Badge tone={u.role === 'company_admin' ? 'violet' : u.role === 'tenant' ? 'info' : u.role === 'vendor' ? 'ok' : u.role === 'guest' ? 'neutral' : u.role === 'owner' ? 'warn' : 'ok'}>{u.roleLabel}</Badge>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 3 }}>
                      últ. {u.last} · {u.props} prop
                    </div>
                  </div>
                  <Btn variant="icon"><IcMore size={14}/></Btn>
                </div>
              ))}
            </div>
          </div>

          {/* Permission matrix */}
          <div>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Matriz de permisos · por rol
              </span>
              <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
              <Btn variant="ghost" size="sm">Exportar CSV <IcDownload size={11}/></Btn>
            </div>
            <div style={{ border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '160px repeat(7, 1fr)', padding: '10px 12px', gap: 4,
                background: 'var(--bg-subtle)', borderBottom: '1px solid var(--ink-100)',
                position: 'sticky', top: 0,
              }}>
                <span></span>
                {ROLE_COLS.map(([id, l, t]) => (
                  <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Dot tone={t} size={6} />
                    <span className="mono" style={{ fontSize: 9, color: 'var(--ink-700)', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center', fontWeight: 600 }}>{l}</span>
                  </div>
                ))}
              </div>
              {PERMS.map((g, gi) => (
                <React.Fragment key={g.group}>
                  <div style={{ padding: '8px 12px', background: 'var(--pp-50)', borderTop: gi > 0 ? '1px solid var(--ink-100)' : 'none' }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--pp-700)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {g.group}
                    </span>
                  </div>
                  {g.items.map(([label, vals], i) => (
                    <div key={label} style={{
                      display: 'grid', gridTemplateColumns: '160px repeat(7, 1fr)', padding: '8px 12px', alignItems: 'center', gap: 4,
                      borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-700)' }}>{label}</span>
                      {vals.map((v, j) => <PermCell key={j} val={v} />)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            {/* Legend */}
            <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 11, color: 'var(--ink-600)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><PermCell val={1} small /> Permitido</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><PermCell val={'p'} small /> Parcial / por scope</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><PermCell val={0} small /> Negado</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const PermCell = ({ val, small }) => {
  const s = small ? 14 : 20;
  if (val === 1) return (
    <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
      <span style={{ width: s, height: s, borderRadius: 4, background: '#10B981', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <IcCheck size={s * 0.62} />
      </span>
    </span>
  );
  if (val === 'p') return (
    <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
      <span style={{ width: s, height: s, borderRadius: 4, background: 'var(--pp-100)', color: 'var(--pp-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: small ? 9 : 11, fontWeight: 700 }}>
        ◐
      </span>
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
      <span style={{ width: s, height: s, borderRadius: 4, background: 'var(--ink-50)', color: 'var(--ink-400)', border: '1px solid var(--ink-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: small ? 10 : 12, fontWeight: 700 }}>
        —
      </span>
    </span>
  );
};

Object.assign(window, { Usuarios, PermCell });
