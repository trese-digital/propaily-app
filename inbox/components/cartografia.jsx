// Cartografía — full-bleed map + right inspector + layer panel + ⌘K search bar.

const Cartografia = () => {
  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      <div style={{ padding: '18px 18px 12px' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
          Capas
        </span>
      </div>
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { name: 'Colonias',         on: true,  count: '184', desc: 'auto · zoom ≥ 13' },
          { name: 'Tramos / viales', on: true,  count: '2.4k', desc: 'coloreo log-scale' },
          { name: 'Lotes',           on: true,  count: '12.8k', desc: 'auto al seleccionar' },
          { name: 'Mis propiedades', on: true,  count: '12',  desc: 'portafolio interno' },
          { name: 'Servicios cercanos', on: false, count: '—',   desc: 'próximamente' },
        ].map((l, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 10px',
            borderRadius: 8, background: l.on ? 'var(--pp-50)' : 'transparent',
            border: l.on ? '1px solid var(--pp-100)' : '1px solid transparent',
          }}>
            <span style={{
              width: 28, height: 18, borderRadius: 999, background: l.on ? 'var(--pp-500)' : 'var(--ink-200)',
              position: 'relative', flex: '0 0 auto', marginTop: 2,
            }}>
              <span style={{
                position: 'absolute', top: 2, left: l.on ? 12 : 2, width: 14, height: 14, borderRadius: 999,
                background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: '500 13px var(--font-sans)', color: l.on ? 'var(--pp-700)' : 'var(--ink-700)' }}>
                  {l.name}
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{l.count}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{l.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 18px 8px' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
          Leyenda · valor fiscal MXN/m²
        </span>
      </div>
      <div style={{ padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, height: 24, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--ink-100)' }}>
          {['#F4F0FF','#E8DFFF','#D1BFFF','#B197FF','#8E66FF','#6E3AFF','#5A24E6','#4818B8','#2F0E80','#1B0853'].map(c => (
            <span key={c} style={{ background: c, flex: 1, height: '100%' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>$2k</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>$25k</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>$80k</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>$200k+</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        margin: 12, padding: 12, borderRadius: 10, background: 'var(--ink-900)',
        color: '#fff', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IcShield size={14} style={{ color: 'var(--pp-400)' }} />
          <span style={{ font: '600 12px var(--font-sans)' }}>Marca de agua activa</span>
        </div>
        <p className="mono" style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
          pablo@gfconsultoria.mx<br />
          2026-05-12 · 14:32
        </p>
      </div>
    </div>
  );

  return (
    <AppShell active="cartografia" sidebar={sidebar} breadcrumb={['Portafolio interno', 'Cartografía', 'Polanco V']}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Map */}
        <MapPlaceholder withColonyShading />

        {/* Polanco V highlighted polygon overlay + lot pins */}
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M150,110 L420,120 L440,360 L170,350 Z" fill="rgba(110,58,255,0.22)" stroke="#6E3AFF" strokeWidth="2.5"/>
          {/* lots */}
          {[[210,160],[270,160],[330,160],[210,210],[270,210],[330,210],[210,260],[270,260],[330,260]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="48" height="40" fill="rgba(110,58,255,0.5)" stroke="#fff" strokeWidth="1" rx="3"/>
          ))}
          {/* Selected lot */}
          <rect x="270" y="210" width="48" height="40" fill="#6E3AFF" stroke="#fff" strokeWidth="2.5" rx="3"/>
        </svg>

        {/* Top floating search */}
        <div style={{
          position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
          background: '#fff', borderRadius: 10, boxShadow: 'var(--shadow-lg)',
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
          width: 420, border: '1px solid var(--ink-100)',
        }}>
          <IcSearch size={16} style={{ color: 'var(--ink-500)' }} />
          <span style={{ flex: 1, fontSize: 14, color: 'var(--ink-700)' }}>
            Polanco V Sección
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.06em' }}>1 de 3</span>
          <Kbd>⌘K</Kbd>
        </div>

        {/* Bottom-left link mode banner */}
        <div style={{
          position: 'absolute', left: 16, bottom: 16, padding: '10px 14px',
          background: 'var(--ink-900)', color: '#fff', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-lg)',
          maxWidth: 480,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pp-400)' }} />
          <span style={{ font: '500 13px var(--font-sans)' }}>Modo vincular: selecciona un lote para Loft Condesa</span>
          <Btn variant="secondary" size="sm" style={{ marginLeft: 8 }}>Cancelar</Btn>
        </div>

        {/* Right inspector */}
        <div style={{
          position: 'absolute', top: 16, right: 16, bottom: 16,
          width: 360, background: '#fff', borderRadius: 12,
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--ink-100)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Inspector tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '8px 8px 0', borderBottom: '1px solid var(--ink-100)' }}>
            {[['Colonia', true],['Tramo', false],['Lote', false]].map(([t, on]) => (
              <button key={t} style={{
                padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer',
                font: '500 13px var(--font-sans)',
                color: on ? 'var(--ink-900)' : 'var(--ink-500)',
                borderBottom: on ? '2px solid var(--pp-500)' : '2px solid transparent',
                marginBottom: -1,
              }}>{t}</button>
            ))}
            <div style={{ flex: 1 }} />
            <button style={{ padding: '6px 8px', background: 'transparent', border: 'none', color: 'var(--ink-500)', cursor: 'pointer' }}>
              <IcX size={14}/>
            </button>
          </div>

          {/* Body — scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--pp-500)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Colonia · Miguel Hidalgo
            </span>
            <h2 style={{ margin: '6px 0 14px', font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
              Polanco V Sección
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              <Stat k="Valor fiscal" v="$78,420" u="/m²" />
              <Stat k="Valor comercial" v="$182,300" u="/m²" />
              <Stat k="Sector" v="04-12" mono />
              <Stat k="Uso de suelo" v="H30/20/Z" mono />
            </div>

            <Section title="Tu portafolio aquí">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Casa Polanco 412', '218 m²', '$8.4M'],
                  ['Edificio Roma 88 (P. anexo)', '92 m²', '$3.2M'],
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    border: '1px solid var(--ink-100)', borderRadius: 8,
                  }}>
                    <span className="pp-img-ph" style={{ width: 28, height: 28, borderRadius: 6, fontSize: 0 }} />
                    <span style={{ flex: 1, font: '500 13px var(--font-sans)' }}>{r[0]}</span>
                    <span className="mono num" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{r[1]}</span>
                    <span className="mono num" style={{ fontSize: 12, fontWeight: 500 }}>{r[2]}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Observaciones">
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.55 }}>
                Avenida Presidente Masaryk como frente comercial. Restricción de altura por zona patrimonial INAH.
              </p>
            </Section>

            <Section title="Lote seleccionado · 04-12-A">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Stat k="Área" v="218" u="m²" mono />
                <Stat k="Frente" v="12.4" u="m" mono />
                <Stat k="Fondo" v="17.5" u="m" mono />
                <Stat k="Perímetro" v="59.8" u="m" mono />
                <Stat k="Valor estimado" v="$8,420,000" mono full />
              </div>
            </Section>
          </div>

          {/* Footer actions */}
          <div style={{
            padding: 14, borderTop: '1px solid var(--ink-100)', background: 'var(--bg-subtle)',
            display: 'flex', gap: 8, flexDirection: 'column',
          }}>
            <Btn size="md" style={{ width: '100%', justifyContent: 'center' }}><IcPlus size={14}/> Crear propiedad desde lote</Btn>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="secondary" size="md" style={{ flex: 1, justifyContent: 'center' }}>Vincular existente</Btn>
              <Btn variant="secondary" size="md"><IcDownload size={14}/></Btn>
            </div>
          </div>
        </div>

        {/* Zoom controls */}
        <div style={{
          position: 'absolute', right: 392, top: 18,
          background: '#fff', borderRadius: 8, border: '1px solid var(--ink-100)',
          boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column',
        }}>
          <button style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-700)', borderBottom: '1px solid var(--ink-100)' }}>
            <IcPlus size={14}/>
          </button>
          <button style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-700)' }}>
            <span style={{ display: 'inline-block', width: 12, height: 1.6, background: 'currentColor' }} />
          </button>
        </div>

        {/* Zoom level badge */}
        <div style={{
          position: 'absolute', right: 392, top: 90,
          padding: '6px 10px', background: 'rgba(14,10,22,0.85)', borderRadius: 6,
          color: '#fff', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
        }}>
          <IcLayers size={12} />
          ZOOM 15 · 19.4326°N · 99.1932°W
        </div>
      </div>
    </AppShell>
  );
};

const Stat = ({ k, v, u, mono, full }) => (
  <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
    <div style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 3 }}>{k}</div>
    <div style={{
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 500, color: 'var(--ink-900)',
    }}>
      {v}<span style={{ color: 'var(--ink-500)', fontWeight: 400, fontSize: 12, marginLeft: 2 }}>{u}</span>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div className="mono" style={{
      fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)',
      textTransform: 'uppercase', marginBottom: 8,
    }}>{title}</div>
    {children}
  </div>
);

Object.assign(window, { Cartografia, Stat, Section });
