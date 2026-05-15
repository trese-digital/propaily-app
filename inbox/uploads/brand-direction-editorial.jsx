// Direction B — Editorial / Fiduciario
// Warm off-white, deeper plum primary, serif accent for institutional moments.
// Inspiration: Cadre, Compass, private banking.

const BrandDirectionEditorial = () => {
  const cream = '#F7F4ED';
  const ink   = '#1A1320';
  const plum  = '#3F1A6B';
  return (
    <div style={{
      width: '100%', height: '100%', background: cream, position: 'relative',
      padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 36,
      borderRadius: 'inherit', overflow: 'hidden',
      fontFamily: 'Geist, system-ui, sans-serif', color: ink,
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,19,32,0.55)' }}>
            Dirección · B
          </span>
          <h1 style={{
            margin: 0, fontFamily: '"Instrument Serif", "Source Serif Pro", Georgia, serif',
            fontWeight: 400, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.01em',
          }}>
            Editorial <em style={{ fontStyle: 'italic', color: plum }}>fiduciario</em>
          </h1>
          <p style={{ margin: 0, font: '400 14px/1.5 Geist, system-ui, sans-serif', color: 'rgba(26,19,32,0.65)', maxWidth: 460 }}>
            Crema cálida, ciruela profunda, serif itálica para títulos. Comunica oficio, custodia y
            tradición patrimonial — pensado para family offices y portafolios institucionales.
          </p>
        </div>
        <div style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: '0.1em',
          color: 'rgba(26,19,32,0.45)', textAlign: 'right', maxWidth: 180,
        }}>
          ALTERNATIVA<br />SI BUSCAMOS<br />SEÑAL PATRIMONIAL
        </div>
      </div>

      {/* Logo plate */}
      <div style={{
        background: '#fff', borderRadius: 4,
        padding: '64px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', minHeight: 220,
        boxShadow: '0 1px 0 rgba(26,19,32,0.06)',
        border: '1px solid rgba(26,19,32,0.06)',
      }}>
        <PropailyLogo height={48} color={plum} endorsement />
        <div style={{ height: 80, width: 1, background: 'rgba(26,19,32,0.1)' }} />
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic', fontSize: 22, color: ink, lineHeight: 1.3, maxWidth: 260 }}>
          “La cartografía del patrimonio inmobiliario.”
        </div>
        <span style={{ position: 'absolute', top: 16, left: 18, fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(26,19,32,0.4)', textTransform: 'uppercase' }}>
          01 · Lockup principal
        </span>
      </div>

      {/* Palette */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <EdSection n="02">Paleta</EdSection>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 6, height: 100 }}>
          {[
            ['Ciruela', plum, '#3F1A6B', '#fff', true],
            ['Crema', cream, '#F7F4ED', ink],
            ['Tinta', ink, '#1A1320', '#fff'],
            ['Hueso', '#EAE3D6', '#EAE3D6', ink],
            ['Cobre', '#B8623A', '#B8623A', '#fff'],
            ['Salvia', '#7A8A6F', '#7A8A6F', '#fff'],
          ].map(([name, bg, hex, color, primary]) => (
            <div key={name} style={{
              background: bg, padding: 14, borderRadius: 4,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              color, border: bg === cream ? '1px solid rgba(26,19,32,0.08)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 16 }}>{name}</span>
                {primary && <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, letterSpacing: '0.1em', opacity: 0.8 }}>PRIMARIO</span>}
              </div>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.04em', opacity: 0.85 }}>{hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, flex: 1 }}>
        {/* Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <EdSection n="03">Tipografía</EdSection>
          <div style={{ background: '#fff', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', gap: 18, border: '1px solid rgba(26,19,32,0.06)' }}>
            <div>
              <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: 'rgba(26,19,32,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Instrument Serif · Display
              </div>
              <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 56, lineHeight: 1.0, letterSpacing: '-0.01em' }}>
                <em>Custodia</em> patrimonial
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(26,19,32,0.08)' }} />
            <div>
              <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: 'rgba(26,19,32,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Geist · Texto
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(26,19,32,0.8)' }}>
                Portafolio de 12 propiedades en cuatro ciudades.<br />
                Valor estimado MXN 184M · operado por GF Consultoría.
              </div>
            </div>
          </div>

          <EdSection n="04">Aplicación · folleto</EdSection>
          <div style={{ background: '#fff', borderRadius: 4, padding: 28, border: '1px solid rgba(26,19,32,0.06)', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
            <PropailyLogo height={20} color={plum} />
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, lineHeight: 1.1, fontStyle: 'italic' }}>
              Reporte trimestral<br />
              <span style={{ color: plum }}>Q2 · 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(26,19,32,0.5)' }}>
                CONFIDENCIAL · GFC
              </span>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(26,19,32,0.5)' }}>
                P. 01 / 24
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <EdSection n="05">Sello / monograma</EdSection>
          <div style={{ background: '#fff', borderRadius: 4, padding: 24, border: '1px solid rgba(26,19,32,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {[
              { size: 80, ring: true },
              { size: 56, ring: false },
              { size: 36, ring: false },
            ].map((s, i) => (
              <div key={i} style={{
                width: s.size + 16, height: s.size + 16, borderRadius: 999,
                border: s.ring ? `1px solid ${plum}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: s.size, height: s.size, borderRadius: 999, background: plum,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}>
                  <PropailyMark size={s.size * 0.55} bg="transparent" radius={0} fg="#fff" />
                </div>
              </div>
            ))}
          </div>

          <EdSection n="06">Aplicación · sobre</EdSection>
          <div style={{
            background: cream, borderRadius: 4, padding: 26, border: '1px solid rgba(26,19,32,0.1)',
            display: 'flex', flexDirection: 'column', gap: 18, minHeight: 180,
            backgroundImage: 'linear-gradient(135deg, transparent 0 65%, rgba(63,26,107,0.06) 65% 100%)',
          }}>
            <PropailyLogo height={18} color={plum} />
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(26,19,32,0.75)' }}>
              Sra. Marcela Fernández<br />
              Polanco V Sección<br />
              Ciudad de México, 11560
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(26,19,32,0.5)' }}>
                DD-2026-0418
              </span>
              <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: plum }}>
                Custodia
              </span>
            </div>
          </div>

          <EdSection n="07">Botón / acento</EdSection>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              background: plum, color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 2,
              fontFamily: 'Geist', fontWeight: 500, fontSize: 14, letterSpacing: '0.02em', cursor: 'pointer',
            }}>Solicitar acceso</button>
            <button style={{
              background: 'transparent', color: ink, border: `1px solid ${ink}`, padding: '12px 22px', borderRadius: 2,
              fontFamily: 'Geist', fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>Conocer más</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EdSection = ({ n, children }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
    <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: 'rgba(26,19,32,0.45)', letterSpacing: '0.14em' }}>{n}</span>
    <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 18, color: '#1A1320' }}>
      {children}
    </span>
    <span style={{ flex: 1, height: 1, background: 'rgba(26,19,32,0.1)' }} />
  </div>
);

Object.assign(window, { BrandDirectionEditorial });
