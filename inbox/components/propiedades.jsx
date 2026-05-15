// Propiedades — grid listing with filters

const Propiedades = () => {
  return (
    <AppShell active="propiedades" breadcrumb={['Portafolio interno', 'Propiedades']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Filters bar */}
        <div style={{
          padding: '18px 28px 14px', borderBottom: '1px solid var(--ink-100)',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginRight: 12 }}>
            <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Propiedades
            </h1>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-500)' }}>12 resultados</span>
          </div>

          <span style={{ height: 24, width: 1, background: 'var(--ink-200)', margin: '0 4px' }} />

          <FilterChip label="Ciudad" value="CDMX" />
          <FilterChip label="Colonia" value="Todas" />
          <FilterChip label="Tipo" value="Todos" />
          <FilterChip label="Estatus" value="Activa · Borrador" highlighted />
          <FilterChip label="Más filtros" icon={<IcFilter size={12}/>} />

          <div style={{ flex: 1 }} />

          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Ordenar por</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
            border: '1px solid var(--ink-200)', borderRadius: 8, background: '#fff', cursor: 'pointer',
            fontSize: 13, color: 'var(--ink-700)',
          }}>
            Valor estimado <IcChevD size={12} style={{ color: 'var(--ink-500)' }} />
          </div>

          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--ink-100)' }}>
            <SegBtn active><IcGrid size={14}/></SegBtn>
            <SegBtn><IcList size={14}/></SegBtn>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg-muted)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PROPERTIES.map((p, i) => <PropertyCard key={i} {...p} highlighted={i === 0} />)}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const PROPERTIES = [
  { name: 'Casa Polanco 412', col: 'Polanco V Sección', city: 'CDMX', area: '218 m²', value: '$8.4M', tone: 'ok', status: 'Activa', units: 1, type: 'Residencial' },
  { name: 'Edificio Roma 88', col: 'Roma Nte', city: 'CDMX', area: '1,420 m²', value: '$48.0M', tone: 'ok', status: 'Activa', units: 12, type: 'Multifamiliar' },
  { name: 'Loft Condesa', col: 'Condesa', city: 'CDMX', area: '92 m²', value: '$3.2M', tone: 'neutral', status: 'Borrador', units: 1, type: 'Residencial' },
  { name: 'Local Del Valle 12', col: 'Del Valle', city: 'CDMX', area: '180 m²', value: '$6.1M', tone: 'warn', status: 'En revisión', units: 2, type: 'Comercial' },
  { name: 'Bodega Tlalpan', col: 'Coapa', city: 'CDMX', area: '2,800 m²', value: '$22.5M', tone: 'ok', status: 'Activa', units: 1, type: 'Industrial' },
  { name: 'Casa Coyoacán 88', col: 'Del Carmen', city: 'CDMX', area: '340 m²', value: '$12.8M', tone: 'ok', status: 'Activa', units: 1, type: 'Residencial' },
  { name: 'Penthouse Cuauhtémoc', col: 'Cuauhtémoc', city: 'CDMX', area: '380 m²', value: '$28.6M', tone: 'ok', status: 'Activa', units: 1, type: 'Residencial' },
  { name: 'Plaza Insurgentes Sur', col: 'Nápoles', city: 'CDMX', area: '4,200 m²', value: '$72.0M', tone: 'ok', status: 'Activa', units: 18, type: 'Comercial' },
];

const PropertyCard = ({ name, col, city, area, value, tone, status, units, type, highlighted }) => (
  <div style={{
    background: '#fff', border: highlighted ? '1px solid var(--pp-300)' : '1px solid var(--ink-100)',
    borderRadius: 12, overflow: 'hidden', position: 'relative',
    boxShadow: highlighted ? '0 0 0 4px rgba(110,58,255,0.10)' : 'var(--shadow-xs)',
  }}>
    <div className="pp-img-ph" style={{ height: 140, borderRadius: 0, position: 'relative' }}>
      {name}
      <span style={{
        position: 'absolute', top: 10, left: 10, padding: '3px 8px',
        background: 'rgba(14,10,22,0.6)', color: '#fff', backdropFilter: 'blur(4px)',
        borderRadius: 999, font: '500 11px var(--font-sans)', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <IcPhoto size={10}/> {units * 3}
      </span>
      <Badge tone={tone} ><span style={{ marginRight: 0 }}>{status}</span></Badge>
      <div style={{
        position: 'absolute', top: 10, right: 10,
      }}>
        <Badge tone={tone}>{status}</Badge>
      </div>
    </div>
    <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={{ font: '600 14px var(--font-sans)', letterSpacing: '-0.005em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <span className="mono num" style={{ font: '500 14px var(--font-mono)', whiteSpace: 'nowrap' }}>{value}</span>
      </div>
      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-500)' }}>
        <span>{col} · {city}</span>
        <span>{area}</span>
      </div>
      <div style={{ height: 1, background: 'var(--ink-100)', margin: '6px 0 2px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-600)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--pp-500)' }}/>
          {type}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <IcKey size={11} style={{ color: 'var(--ink-500)' }} /> {units} {units > 1 ? 'unidades' : 'unidad'}
        </span>
      </div>
    </div>
  </div>
);

const FilterChip = ({ label, value, icon, highlighted }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 10px', borderRadius: 8,
    border: highlighted ? '1px solid var(--pp-300)' : '1px solid var(--ink-200)',
    background: highlighted ? 'var(--pp-50)' : '#fff',
    fontSize: 13, color: highlighted ? 'var(--pp-700)' : 'var(--ink-700)', cursor: 'pointer',
  }}>
    {icon}
    <span className="mono" style={{ fontSize: 11, color: highlighted ? 'var(--pp-600)' : 'var(--ink-500)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
    {value && <>
      <span style={{ font: '500 13px var(--font-sans)' }}>{value}</span>
      <IcChevD size={11} style={{ color: 'var(--ink-500)' }} />
    </>}
  </div>
);

Object.assign(window, { Propiedades, PropertyCard, FilterChip });
