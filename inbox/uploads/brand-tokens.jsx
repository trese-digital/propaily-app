// Tokens artboard — color scale, type scale, spacing, radii, shadows, iconography.
// Sits between brand directions and platform screens.

const BrandTokens = () => {
  return (
    <div className="pp" style={{
      width: '100%', height: '100%', background: 'var(--bg)', padding: 48,
      display: 'flex', flexDirection: 'column', gap: 32, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
            01 · Sistema visual
          </span>
          <h1 style={{ margin: '8px 0 0', font: '600 36px/1.05 var(--font-sans)', letterSpacing: '-0.025em' }}>
            Tokens
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--ink-500)', fontSize: 14, maxWidth: 560 }}>
            Variables CSS expuestas como <span className="mono" style={{ color: 'var(--pp-500)' }}>--pp-*</span> y <span className="mono" style={{ color: 'var(--pp-500)' }}>--ink-*</span>.
            Cualquier nuevo componente debe consumir solo estas. Sin colores libres.
          </p>
        </div>
        <PropailyLogo height={24} color="var(--pp-500)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, flex: 1, minHeight: 0 }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Purple ramp */}
          <div>
            <TokSection>Morado — escala primaria</TokSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
              {[
                ['50','#F4F0FF'],['100','#E8DFFF'],['200','#D1BFFF'],['300','#B197FF'],['400','#8E66FF'],
                ['500','#6E3AFF'],['600','#5A24E6'],['700','#4818B8'],['800','#2F0E80'],['900','#1B0853'],['950','#0E0430'],
              ].map(([n, hex]) => {
                const dark = Number(n) >= 500;
                return (
                  <div key={n} style={{
                    background: hex, height: 88, borderRadius: 8, padding: 8,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    color: dark ? '#fff' : 'var(--ink-700)',
                    border: dark ? 'none' : '1px solid var(--ink-100)',
                    position: 'relative',
                  }}>
                    <span className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{n}</span>
                    <span className="mono" style={{ fontSize: 9, opacity: 0.85, letterSpacing: '0.04em' }}>{hex}</span>
                    {n === '500' && (
                      <span style={{
                        position: 'absolute', top: -7, right: 6, background: 'var(--ink-900)', color: '#fff',
                        fontSize: 9, padding: '2px 5px', borderRadius: 4, fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                      }}>PRIMARY</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ink ramp */}
          <div>
            <TokSection>Ink — neutros con tinte morado</TokSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
              {[
                ['0','#FFFFFF'],['25','#FBFAFE'],['50','#F6F4FB'],['100','#EEEAF6'],['200','#E1DCEE'],
                ['300','#C6BFD7'],['400','#9890AC'],['500','#6B6480'],['600','#494258'],['700','#2D2738'],['900','#0E0A16'],
              ].map(([n, hex]) => {
                const dark = Number(n) >= 500;
                return (
                  <div key={n} style={{
                    background: hex, height: 64, borderRadius: 8, padding: 8,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    color: dark ? '#fff' : 'var(--ink-700)',
                    border: Number(n) <= 200 ? '1px solid var(--ink-100)' : 'none',
                  }}>
                    <span className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{n}</span>
                    <span className="mono" style={{ fontSize: 9, opacity: 0.85 }}>{hex}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Semantic */}
          <div>
            <TokSection>Semánticos</TokSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['Success','#10B981','--ok'],
                ['Warning','#F59E0B','--warn'],
                ['Danger','#EF4444','--bad'],
                ['Info','#3B82F6','--info'],
              ].map(([name, hex, tok]) => (
                <div key={tok} style={{
                  background: hex, borderRadius: 10, padding: 12, height: 72,
                  color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <span className="mono" style={{ fontSize: 10, opacity: 0.85, letterSpacing: '0.08em' }}>{tok}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ font: '500 13px var(--font-sans)' }}>{name}</span>
                    <span className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <TokSection>Espaciado · escala de 4</TokSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, padding: '8px 0' }}>
              {[
                ['1','4'],['2','8'],['3','12'],['4','16'],['5','20'],['6','24'],['8','32'],['10','40'],['12','48'],['16','64'],
              ].map(([n, px]) => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 18, height: Number(px), background: 'var(--pp-200)', borderRadius: 3 }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{n}</span>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--ink-400)' }}>{px}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0 }}>
          {/* Type scale */}
          <div>
            <TokSection>Tipografía · Geist</TokSection>
            <div style={{
              background: 'var(--bg-subtle)', border: '1px solid var(--ink-100)', borderRadius: 12,
              padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {[
                ['Display', 48, 600, '-0.025em', 'Portafolio'],
                ['H1', 32, 600, '-0.02em', 'Cartografía'],
                ['H2', 22, 600, '-0.015em', 'Inspector de colonia'],
                ['Body L', 16, 400, '-0.005em', 'Texto largo y cómodo'],
                ['Body', 14, 400, '0', 'Texto base — descripciones'],
                ['Caption', 12, 500, '0', 'Etiqueta'],
                ['Mono · data', 13, 500, '0', '$4,820/m² · 19.4326°N · FOLIO 04-12-A'],
              ].map(([name, size, weight, ls, sample]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', minWidth: 90, letterSpacing: '0.06em' }}>
                    {name} · {size}/{weight}
                  </span>
                  <span style={{
                    fontSize: size, fontWeight: weight, letterSpacing: ls, lineHeight: 1.1,
                    fontFamily: name.startsWith('Mono') ? 'var(--font-mono)' : 'var(--font-sans)',
                    color: 'var(--ink-900)', flex: 1,
                  }}>{sample}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radii */}
          <div>
            <TokSection>Radii</TokSection>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['xs',4],['sm',6],['md',10],['lg',14],['xl',20]].map(([n, r]) => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 64, height: 64, background: 'var(--pp-100)', borderRadius: r, border: '1px solid var(--pp-200)' }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{n}</span>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--ink-400)' }}>{r}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div>
            <TokSection>Elevación</TokSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: 8 }}>
              {['xs','sm','md','lg'].map(s => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: '100%', height: 56, background: '#fff', borderRadius: 10,
                    boxShadow: `var(--shadow-${s})`, border: '1px solid var(--ink-100)',
                  }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>shadow-{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Iconography */}
          <div>
            <TokSection>Iconografía · stroke 1.6</TokSection>
            <div style={{
              border: '1px solid var(--ink-100)', borderRadius: 12, padding: 16,
              display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12,
              color: 'var(--ink-700)', background: 'var(--bg-subtle)',
            }}>
              {[IcMap, IcBuilding, IcChart, IcCalc, IcDoc, IcUsers, IcSearch, IcSettings,
                IcBell, IcPlus, IcFilter, IcGrid, IcLayers, IcCmd, IcPin, IcSpark].map((I, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
                  <I size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokSection = ({ children }) => (
  <div style={{
    font: '500 12px var(--font-sans)', color: 'var(--ink-700)', letterSpacing: '-0.005em',
    marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--pp-500)' }} />
    {children}
  </div>
);

Object.assign(window, { BrandTokens, TokSection });
