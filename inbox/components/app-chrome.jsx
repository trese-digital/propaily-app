// Shared app chrome — vertical rail, sidebar, top header.
// Used by Dashboard, Cartografía, Propiedades, Detalle.

const AppShell = ({ active = 'dashboard', children, hideSidebar = false, sidebar = null, breadcrumb = [], searchLabel = 'Buscar colonia, propiedad, folio…' }) => {
  return (
    <div className="pp" style={{
      width: '100%', height: '100%', display: 'grid',
      gridTemplateColumns: hideSidebar ? '56px 1fr' : `56px ${sidebar ? '260px' : '260px'} 1fr`,
      background: 'var(--bg-muted)', overflow: 'hidden',
    }}>
      <Rail active={active} />
      {!hideSidebar && <Sidebar custom={sidebar} active={active} />}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}>
        <TopBar breadcrumb={breadcrumb} searchLabel={searchLabel} />
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, background: 'var(--bg)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Rail = ({ active }) => {
  const items = [
    { id: 'cartografia',   icon: IcMap, label: 'Cartografía' },
    { id: 'propiedades',   icon: IcBuilding, label: 'Propiedades' },
    { id: 'rentas',        icon: IcKey, label: 'Rentas' },
    { id: 'clientes',      icon: IcUsers, label: 'Clientes' },
    { id: 'valuaciones',   icon: IcChart, label: 'Valuaciones' },
    { id: 'mantenimiento', icon: IcSpark, label: 'Mantenimiento' },
    { id: 'insights',      icon: IcLayers, label: 'Insights', disabled: true },
    { id: 'calculadoras',  icon: IcCalc, label: 'Calc.', disabled: true },
  ];
  return (
    <div style={{
      background: 'var(--ink-900)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '14px 0', gap: 4, color: '#fff',
    }}>
      <div style={{ marginBottom: 14 }}>
        <PropailyMark size={32} bg="var(--pp-500)" radius={8} fg="#fff" />
      </div>
      {items.map(it => {
        const isActive = active === it.id || (active === 'dashboard' && it.id === 'propiedades');
        return (
          <button key={it.id} title={it.label} style={{
            width: 40, height: 40, borderRadius: 8, border: 'none', cursor: it.disabled ? 'not-allowed' : 'pointer',
            background: isActive ? 'rgba(110,58,255,0.18)' : 'transparent',
            color: isActive ? '#fff' : it.disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            {isActive && <span style={{ position: 'absolute', left: -10, top: 10, bottom: 10, width: 2, background: 'var(--pp-400)', borderRadius: 999 }} />}
            <it.icon size={18} />
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <button title="Notificaciones" style={{ width: 40, height: 40, borderRadius: 8, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
        <IcBell size={18} />
        <span style={{ position: 'absolute', top: 8, right: 10, width: 7, height: 7, borderRadius: 999, background: 'var(--pp-400)', border: '1.5px solid var(--ink-900)' }} />
      </button>
      <button style={{ width: 40, height: 40, borderRadius: 8, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <IcSettings size={18} />
      </button>
      <div style={{
        width: 32, height: 32, borderRadius: 999, background: 'linear-gradient(135deg, var(--pp-400), var(--pp-700))',
        color: '#fff', font: '600 12px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 6,
      }}>PG</div>
    </div>
  );
};

const Sidebar = ({ custom, active }) => {
  if (custom) return <aside style={{
    background: 'var(--bg)', borderRight: '1px solid var(--ink-100)',
    overflowY: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0,
  }}>{custom}</aside>;

  // default — portfolio list
  return (
    <aside style={{
      background: 'var(--bg)', borderRight: '1px solid var(--ink-100)',
      display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{ padding: '18px 18px 12px' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
          Cliente
        </span>
        <div style={{
          marginTop: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--ink-100)',
          background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--ink-900)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '600 11px var(--font-sans)',
          }}>GFC</span>
          <span style={{ font: '500 13px var(--font-sans)', flex: 1 }}>Portafolio interno</span>
          <IcChevD size={14} style={{ color: 'var(--ink-500)' }} />
        </div>
      </div>

      <div style={{ padding: '0 12px' }}>
        <SideHeading>Portafolios</SideHeading>
        {[
          ['General', true, 12],
          ['Polanco', false, 4],
          ['Roma · Condesa', false, 5],
          ['Comercial CDMX', false, 3],
        ].map(([n, on, c]) => (
          <div key={n} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6,
            background: on ? 'var(--pp-50)' : 'transparent', color: on ? 'var(--pp-700)' : 'var(--ink-700)',
            cursor: 'pointer',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: on ? 'var(--pp-500)' : 'var(--ink-300)' }}/>
            <span style={{ font: `${on ? 500 : 400} 13px var(--font-sans)`, flex: 1 }}>{n}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{c}</span>
          </div>
        ))}

        <SideHeading>Vistas</SideHeading>
        {[
          { name: 'Cartografía', id: 'cartografia', I: IcMap },
          { name: 'Propiedades', id: 'propiedades', I: IcBuilding },
          { name: 'Documentos', id: 'docs', I: IcDoc },
          { name: 'Equipo', id: 'team', I: IcUsers },
        ].map(it => (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 6,
            color: active === it.id ? 'var(--pp-700)' : 'var(--ink-700)',
            background: active === it.id ? 'var(--pp-50)' : 'transparent',
            cursor: 'pointer',
          }}>
            <it.I size={15} />
            <span style={{ font: '500 13px var(--font-sans)' }}>{it.name}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        margin: 12, padding: 14, borderRadius: 10, border: '1px solid var(--pp-200)',
        background: 'var(--pp-50)', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IcSpark size={14} style={{ color: 'var(--pp-600)' }} />
          <span style={{ font: '600 12px var(--font-sans)', color: 'var(--pp-700)' }}>Insights · próximamente</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--pp-700)', opacity: 0.8, lineHeight: 1.5 }}>
          Comparativos de rendimiento por colonia y servicios cercanos.
        </p>
      </div>
    </aside>
  );
};

const SideHeading = ({ children }) => (
  <div className="mono" style={{
    fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-400)',
    textTransform: 'uppercase', padding: '14px 10px 6px',
  }}>{children}</div>
);

const TopBar = ({ breadcrumb = [], searchLabel }) => (
  <div style={{
    height: 56, borderBottom: '1px solid var(--ink-100)', background: 'var(--bg)',
    display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', flex: '0 0 56px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-500)', fontSize: 13 }}>
      {breadcrumb.map((b, i) => (
        <React.Fragment key={i}>
          {i > 0 && <IcChevR size={12} />}
          <span style={{
            color: i === breadcrumb.length - 1 ? 'var(--ink-900)' : 'var(--ink-500)',
            font: `${i === breadcrumb.length - 1 ? 500 : 400} 13px var(--font-sans)`,
          }}>{b}</span>
        </React.Fragment>
      ))}
    </div>
    <div style={{ flex: 1 }} />
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
      height: 34, borderRadius: 8, border: '1px solid var(--ink-200)',
      background: 'var(--bg-subtle)', minWidth: 360, color: 'var(--ink-500)',
    }}>
      <IcSearch size={14} />
      <span style={{ fontSize: 13, flex: 1 }}>{searchLabel}</span>
      <Kbd>⌘K</Kbd>
    </div>
    <Btn variant="secondary" size="md"><IcDownload size={14}/> Exportar</Btn>
    <Btn size="md"><IcPlus size={14}/> Nueva propiedad</Btn>
  </div>
);

Object.assign(window, { AppShell, Rail, Sidebar, SideHeading, TopBar });
