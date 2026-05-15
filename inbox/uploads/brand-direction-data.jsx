// Direction C — Data Dark
// Near-black surface with violet glow, mono-forward, terminal aesthetic.
// For users who live in the platform 8h/day: dense, signal-heavy.

const BrandDirectionData = () => {
  const bg = '#0B0820';
  const surface = '#13102E';
  const violet = '#8E66FF';
  const violet2 = '#6E3AFF';
  const cyan = '#6FE6FF';

  return (
    <div style={{
      width: '100%', height: '100%', background: bg, position: 'relative',
      padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 36,
      borderRadius: 'inherit', overflow: 'hidden',
      fontFamily: 'Geist, system-ui, sans-serif', color: '#E9E5FF',
      boxSizing: 'border-box',
      backgroundImage: `
        radial-gradient(900px 400px at 0% 0%, rgba(110,58,255,0.18), transparent 60%),
        radial-gradient(700px 400px at 100% 100%, rgba(111,230,255,0.08), transparent 60%)
      `,
    }}>
      {/* subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 36, height: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(233,229,255,0.55)' }}>
              Dirección · C
            </span>
            <h1 style={{ margin: 0, font: '600 32px/1.1 Geist', letterSpacing: '-0.02em', color: '#fff' }}>
              Data dark
            </h1>
            <p style={{ margin: 0, font: '400 14px/1.5 Geist', color: 'rgba(233,229,255,0.7)', maxWidth: 460 }}>
              Para el power-user. Negro violáceo con glow del primario, mono pesa más que sans,
              tablas y mapas como ciudadanos de primera. Modo "consola del portafolio".
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Geist Mono", monospace', fontSize: 11, color: cyan, letterSpacing: '0.1em' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: cyan, boxShadow: `0 0 8px ${cyan}` }} />
            POWER-USER VARIANT
          </div>
        </div>

        {/* Logo hero */}
        <div style={{
          background: surface, borderRadius: 16, padding: '60px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', minHeight: 220,
          border: '1px solid rgba(142,102,255,0.2)',
          boxShadow: '0 0 60px rgba(110,58,255,0.15) inset',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
            background: 'radial-gradient(400px 200px at 50% 50%, rgba(142,102,255,0.25), transparent 70%)',
          }} />
          <PropailyLogo height={56} color={violet} endorsement style={{ filter: `drop-shadow(0 0 12px rgba(142,102,255,0.4))` }} />
          <span style={{ position: 'absolute', top: 14, left: 16, fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(233,229,255,0.4)', textTransform: 'uppercase' }}>
            01 · Logotipo · variante oscura
          </span>
          <span style={{ position: 'absolute', top: 14, right: 16, fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: cyan }}>
            ● ONLINE
          </span>
        </div>

        {/* Palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DkSection n="02">Paleta</DkSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {[
              ['Violeta', violet, '#8E66FF'],
              ['Profundo', violet2, '#6E3AFF'],
              ['Cian acento', cyan, '#6FE6FF'],
              ['Surface', surface, '#13102E'],
              ['Fondo', bg, '#0B0820'],
              ['Texto', '#E9E5FF', '#E9E5FF'],
            ].map(([name, color, hex]) => (
              <div key={name} style={{
                background: color, height: 96, borderRadius: 8, padding: 12,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: ['#13102E','#0B0820','#6E3AFF','#8E66FF'].includes(hex) ? '#fff' : '#0B0820',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.1em', opacity: 0.8 }}>{name}</span>
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.06em', opacity: 0.9 }}>{hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: console + chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, flex: 1 }}>
          {/* Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <DkSection n="03">Aplicación · consola</DkSection>
            <div style={{
              background: '#08061A', borderRadius: 10, padding: 18, minHeight: 280,
              fontFamily: '"Geist Mono", monospace', fontSize: 12, lineHeight: 1.8,
              border: '1px solid rgba(142,102,255,0.18)',
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FF6464' }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FFC864' }} />
                <span style={{ width: 10, height: 10, borderRadius: 999, background: '#64FF96' }} />
                <span style={{ marginLeft: 12, color: 'rgba(233,229,255,0.4)', fontSize: 11 }}>propaily · ~/portfolio</span>
              </div>
              <div><span style={{ color: cyan }}>$</span> propaily portfolio.value --range Q2</div>
              <div style={{ color: 'rgba(233,229,255,0.5)' }}>Calculando 12 propiedades · 4 ciudades…</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ color: violet }}>MXN</span>{' '}
                <span style={{ color: '#fff', fontSize: 18 }}>184,420,000</span>{' '}
                <span style={{ color: '#64FF96' }}>+4.2%</span>
              </div>
              <div style={{ color: 'rgba(233,229,255,0.5)', marginTop: 6 }}>
                ↳ Polanco · 4.8M/m² · 12.4% YTD<br />
                ↳ Roma Nte · 3.2M/m² · 6.1% YTD<br />
                ↳ Del Valle · 2.9M/m² · −0.8% YTD
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ color: cyan }}>$</span> <span style={{ background: violet, color: '#fff', padding: '0 4px' }}>_</span>
              </div>
            </div>
          </div>

          {/* Chart + button + watermark */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <DkSection n="04">Componente · KPI</DkSection>
            <div style={{
              background: surface, borderRadius: 10, padding: 18,
              border: '1px solid rgba(142,102,255,0.2)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(233,229,255,0.5)', textTransform: 'uppercase' }}>
                  Valor estimado · MXN
                </span>
                <span style={{ fontSize: 11, color: cyan, fontFamily: '"Geist Mono", monospace' }}>● LIVE</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                $184,420,000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#64FF96', fontSize: 13, fontFamily: '"Geist Mono", monospace' }}>↑ +4.2%</span>
                <span style={{ color: 'rgba(233,229,255,0.5)', fontSize: 13 }}>vs Q1</span>
              </div>
              {/* sparkline */}
              <svg viewBox="0 0 200 50" style={{ width: '100%', height: 50, marginTop: 6 }}>
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={violet} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={violet} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,40 L20,35 L40,38 L60,28 L80,30 L100,22 L120,25 L140,18 L160,20 L180,12 L200,8 L200,50 L0,50 Z" fill="url(#spark)" />
                <path d="M0,40 L20,35 L40,38 L60,28 L80,30 L100,22 L120,25 L140,18 L160,20 L180,12 L200,8" stroke={violet} strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            <DkSection n="05">Aplicación · watermark</DkSection>
            <div style={{
              background: surface, borderRadius: 10, padding: 18, minHeight: 120,
              border: '1px solid rgba(142,102,255,0.2)',
              backgroundImage: `
                repeating-linear-gradient(-30deg,
                  transparent 0 80px,
                  rgba(142,102,255,0.06) 80px 81px)
              `,
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(233,229,255,0.5)', textTransform: 'uppercase' }}>
                Mapa exportado · marca de agua
              </span>
              <div style={{
                fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.08em',
                color: 'rgba(233,229,255,0.35)', lineHeight: 1.6, transform: 'rotate(-10deg) translateY(8px)',
              }}>
                pablo@gfconsultoria.mx · 2026-05-12 14:32 · propaily.app<br />
                pablo@gfconsultoria.mx · 2026-05-12 14:32 · propaily.app
              </div>
              <button style={{
                alignSelf: 'flex-start', background: violet2, color: '#fff', border: 'none',
                padding: '8px 14px', borderRadius: 6, fontFamily: 'Geist', fontWeight: 500, fontSize: 13,
                cursor: 'pointer', boxShadow: `0 0 24px rgba(110,58,255,0.5)`,
              }}>
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DkSection = ({ n, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: 'rgba(233,229,255,0.45)', letterSpacing: '0.14em' }}>{n}</span>
    <span style={{ font: '500 13px Geist', color: '#fff', letterSpacing: '-0.005em' }}>
      {children}
    </span>
    <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

Object.assign(window, { BrandDirectionData });
