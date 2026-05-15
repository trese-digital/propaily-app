// Direction A — Tech Minimal
// Clean white surfaces, vibrant violet, geometric sans, mono micro-labels.
// Inspiration: Linear, Vercel, Notion.

const BrandDirectionTech = () => {
  return (
    <div className="pp" style={{
      width: '100%', height: '100%', background: '#fff', position: 'relative',
      padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 36,
      borderRadius: 'inherit', overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
            Dirección · A
          </span>
          <h1 style={{ margin: 0, font: '600 32px/1.1 var(--font-sans)', letterSpacing: '-0.02em' }}>
            Tech minimal
          </h1>
          <p style={{ margin: 0, font: '400 14px/1.5 var(--font-sans)', color: 'var(--ink-500)', maxWidth: 460 }}>
            Superficies blancas limpias, morado vibrante reservado para acción y data crítica,
            mono para metadatos. Se siente como una herramienta, no como un folleto.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 11px/1 var(--font-mono)', color: 'var(--ink-400)', letterSpacing: '0.1em' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pp-500)' }} />
          RECOMENDADA
        </div>
      </div>

      {/* Logo hero card */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--ink-100)',
        borderRadius: 16,
        padding: '56px 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        minHeight: 220,
      }}>
        <PropailyLogo height={56} color="var(--pp-500)" endorsement />
        <span className="mono" style={{ position: 'absolute', top: 14, left: 16, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-400)', textTransform: 'uppercase' }}>
          01 · Logotipo primario
        </span>
      </div>

      {/* Palette strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionLabel n="02">Paleta</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
          {[
            ['50', '#F4F0FF'], ['100','#E8DFFF'], ['200','#D1BFFF'], ['300','#B197FF'],
            ['500','#6E3AFF'], ['700','#4818B8'], ['900','#1B0853'], ['ink','#0E0A16'],
          ].map(([n, hex]) => {
            const dark = ['500','700','900','ink'].includes(n);
            return (
              <div key={n} style={{
                background: hex, height: 96, borderRadius: 10, padding: 10,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: dark ? '#fff' : 'var(--ink-700)',
                border: dark ? 'none' : '1px solid var(--ink-100)',
              }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.75 }}>{n}</span>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '0.06em', opacity: 0.9 }}>{hex}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type + Applications grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1 }}>
        {/* Type column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel n="03">Tipografía</SectionLabel>
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, padding: 20,
            display: 'flex', flexDirection: 'column', gap: 14, background: '#fff',
          }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Geist · Display
              </div>
              <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                Portafolio
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--ink-100)' }} />
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Geist · UI
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-700)' }}>
                12 propiedades · 4 ciudades · MXN 184M valor estimado
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--ink-100)' }} />
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Geist Mono · Data
              </div>
              <div className="mono num" style={{ fontSize: 14, color: 'var(--ink-700)', display: 'flex', gap: 16 }}>
                <span>19.4326°N</span><span>99.1332°W</span><span>$4,820/m²</span>
              </div>
            </div>
          </div>

          <SectionLabel n="04">Do / Don't</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <RuleCard ok title="Morado para acción">
              <PropailyMark size={36} radius={8} />
              <span style={{ font: '500 13px var(--font-sans)' }}>Crear propiedad</span>
            </RuleCard>
            <RuleCard title="No saturar con morado">
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ width: 28, height: 28, background: 'var(--pp-500)', borderRadius: 6 }} />)}
              </div>
            </RuleCard>
            <RuleCard ok title="Mono solo en data">
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-700)' }}>FOLIO 04-12-A · 218 m²</span>
            </RuleCard>
            <RuleCard title="No degradados arcoíris">
              <div style={{ width: '100%', height: 28, borderRadius: 6, background: 'linear-gradient(90deg, #6E3AFF, #f59e0b, #10b981, #ef4444)' }} />
            </RuleCard>
          </div>
        </div>

        {/* Applications column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionLabel n="05">Aplicaciones</SectionLabel>

          {/* App icon */}
          <div style={{
            display: 'flex', gap: 12, padding: 16, border: '1px solid var(--ink-100)',
            borderRadius: 12, alignItems: 'center', background: '#fff',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: 'linear-gradient(135deg, #6E3AFF 0%, #4818B8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(110,58,255,0.35)',
              color: '#fff',
            }}>
              <PropailyMark size={48} bg="transparent" radius={0} fg="#fff" />
            </div>
            <div>
              <div style={{ font: '600 14px var(--font-sans)' }}>App icon</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>iOS · Android · Web favicon</div>
            </div>
          </div>

          {/* Business card */}
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, padding: 16, background: '#fff',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{
              background: 'var(--ink-900)', borderRadius: 8, padding: '20px 18px',
              color: '#fff', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 130,
            }}>
              <PropailyLogo height={22} color="#fff" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ font: '600 14px var(--font-sans)' }}>Pablo García</div>
                  <div className="mono" style={{ fontSize: 11, opacity: 0.7 }}>Founder · GF Consultoría</div>
                </div>
                <PropailyMark size={28} bg="var(--pp-500)" radius={6} />
              </div>
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.1em' }}>TARJETA · 85 × 55 MM</div>
          </div>

          {/* UI snippet */}
          <div style={{
            border: '1px solid var(--ink-100)', borderRadius: 12, padding: 16, background: '#fff',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Componente · botón primario
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button style={{
                background: 'var(--pp-500)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '10px 16px', font: '500 14px var(--font-sans)',
                cursor: 'pointer', boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 1px 2px rgba(27,8,83,0.2)',
              }}>
                Crear propiedad
              </button>
              <button style={{
                background: '#fff', color: 'var(--ink-700)', border: '1px solid var(--ink-200)',
                borderRadius: 8, padding: '10px 16px', font: '500 14px var(--font-sans)', cursor: 'pointer',
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ n, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.14em' }}>{n}</span>
    <span style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-700)', letterSpacing: '-0.005em' }}>
      {children}
    </span>
    <span style={{ flex: 1, height: 1, background: 'var(--ink-100)' }} />
  </div>
);

const RuleCard = ({ ok, title, children }) => (
  <div style={{
    border: '1px solid var(--ink-100)', borderRadius: 10, padding: 12, background: '#fff',
    display: 'flex', flexDirection: 'column', gap: 8, minHeight: 92,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        background: ok ? 'var(--ok)' : 'var(--bad)',
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
      }}>{ok ? '✓' : '×'}</span>
      <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {ok ? 'Hacer' : 'Evitar'}
      </span>
      <span style={{ font: '500 12px var(--font-sans)', color: 'var(--ink-700)', marginLeft: 'auto' }}>{title}</span>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 6, padding: '4px 2px' }}>
      {children}
    </div>
  </div>
);

Object.assign(window, { BrandDirectionTech, SectionLabel, RuleCard });
