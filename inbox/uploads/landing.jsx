// Landing — propaily.com home

const Landing = () => {
  return (
    <div className="pp" style={{ width: '100%', minHeight: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <LandingNav />
      <LandingHero />
      <LandingTrust />
      <LandingPreview />
      <LandingFeatures />
      <LandingMap />
      <LandingPricing />
      <LandingFooter />
    </div>
  );
};

const LandingNav = () => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--ink-100)',
    padding: '14px 56px', display: 'flex', alignItems: 'center', gap: 32,
  }}>
    <PropailyLogo height={22} color="var(--ink-900)" />
    <div style={{ display: 'flex', gap: 24, marginLeft: 12 }}>
      {['Producto', 'Cartografía', 'Para portafolios', 'Seguridad', 'Precios'].map(l => (
        <a key={l} style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-700)', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
      ))}
    </div>
    <div style={{ flex: 1 }} />
    <a style={{ font: '500 13px var(--font-sans)', color: 'var(--ink-700)', textDecoration: 'none', cursor: 'pointer' }}>Iniciar sesión</a>
    <Btn size="md">Solicitar acceso <IcArrowR size={12}/></Btn>
  </nav>
);

const LandingHero = () => (
  <section style={{
    padding: '88px 56px 64px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* radial accent */}
    <div style={{
      position: 'absolute', top: -180, right: -120, width: 700, height: 700, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(110,58,255,0.18), transparent 60%)', pointerEvents: 'none',
    }} />
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <span style={{
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8,
        padding: '5px 10px 5px 6px', borderRadius: 999,
        background: 'var(--pp-50)', border: '1px solid var(--pp-100)', color: 'var(--pp-700)',
        font: '500 12px var(--font-sans)',
      }}>
        <span style={{ background: 'var(--pp-500)', color: '#fff', padding: '2px 6px', borderRadius: 999, fontSize: 10, letterSpacing: '0.06em' }}>NUEVO</span>
        Vinculación lote ↔ propiedad
      </span>
      <h1 style={{
        margin: 0, font: '700 64px/1.02 var(--font-sans)', letterSpacing: '-0.035em', color: 'var(--ink-900)',
      }}>
        La cartografía<br />
        <span style={{ color: 'var(--pp-500)' }}>de tu patrimonio</span><br />
        inmobiliario.
      </h1>
      <p style={{ margin: 0, font: '400 17px/1.55 var(--font-sans)', color: 'var(--ink-500)', maxWidth: 540 }}>
        Propaily concentra catastro, lotes, propiedades, contratos y valuaciones de
        tu portafolio en un solo mapa. Hecho para family offices y agentes que
        manejan más de cinco activos.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Btn size="lg">Solicitar acceso <IcArrowR size={14}/></Btn>
        <Btn variant="secondary" size="lg">Ver demo en vivo</Btn>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <PropailyMark size={20} radius={5} />
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
          By GF Consultoría · CDMX
        </span>
      </div>
    </div>

    {/* Map glimpse */}
    <div style={{
      position: 'relative', height: 480, borderRadius: 20, overflow: 'hidden',
      border: '1px solid var(--ink-100)', boxShadow: '0 30px 80px rgba(27,8,83,0.18)',
    }}>
      <MapPlaceholder withColonyShading />
      <svg viewBox="0 0 600 480" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <path d="M80,80 L320,90 L340,260 L100,250 Z" fill="rgba(110,58,255,0.25)" stroke="#6E3AFF" strokeWidth="2"/>
        {[[140,140],[200,140],[260,140],[140,180],[200,180],[260,180]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="48" height="32" fill={i===2?'#6E3AFF':'rgba(110,58,255,0.5)'} stroke="#fff" strokeWidth="1.5" rx="3"/>
        ))}
      </svg>
      {/* floating inspector card */}
      <div style={{
        position: 'absolute', right: 16, top: 16, bottom: 16,
        width: 230, background: '#fff', borderRadius: 12, padding: 16,
        boxShadow: 'var(--shadow-md)', border: '1px solid var(--ink-100)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--pp-500)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Colonia</span>
        <div style={{ font: '600 16px var(--font-sans)', letterSpacing: '-0.01em' }}>Polanco V</div>
        <div style={{ height: 1, background: 'var(--ink-100)' }} />
        <Line k="Valor fiscal" v="$78,420/m²" />
        <Line k="Valor comercial" v="$182,300/m²" />
        <Line k="Sector" v="04-12" />
        <div style={{ flex: 1 }} />
        <Btn size="sm" style={{ width: '100%', justifyContent: 'center' }}>Crear propiedad</Btn>
      </div>
      {/* watermark */}
      <span className="mono" style={{
        position: 'absolute', left: 14, bottom: 12, fontSize: 10,
        color: 'rgba(14,10,22,0.6)', letterSpacing: '0.06em',
      }}>pablo@gfconsultoria.mx · 2026-05-12</span>
    </div>
  </section>
);

const LandingTrust = () => (
  <section style={{ padding: '40px 56px', borderTop: '1px solid var(--ink-100)', borderBottom: '1px solid var(--ink-100)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 48, justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        Operado por family offices en
      </span>
      {['Polanco', 'Roma · Condesa', 'Del Valle', 'Lomas', 'Coyoacán'].map(c => (
        <span key={c} style={{ font: '600 18px var(--font-sans)', color: 'var(--ink-300)', letterSpacing: '-0.015em' }}>
          {c}
        </span>
      ))}
    </div>
  </section>
);

const LandingPreview = () => (
  <section style={{ padding: '96px 56px 64px', background: 'var(--bg-subtle)' }}>
    <div style={{ maxWidth: 760, margin: '0 auto 48px', textAlign: 'center' }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--pp-500)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        Plataforma
      </span>
      <h2 style={{ margin: '12px 0 12px', font: '600 44px/1.05 var(--font-sans)', letterSpacing: '-0.025em' }}>
        Todo el portafolio,<br />en una sola superficie.
      </h2>
      <p style={{ margin: 0, font: '400 16px/1.6 var(--font-sans)', color: 'var(--ink-500)' }}>
        Catastro, contratos, documentos, valuaciones y rentas vinculados a su geometría real
        sobre el mapa. Sin hojas de cálculo paralelas.
      </p>
    </div>
    {/* Mock app frame */}
    <div style={{
      maxWidth: 1240, margin: '0 auto', borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--ink-200)', boxShadow: '0 40px 100px rgba(27,8,83,0.15)',
      background: '#fff',
    }}>
      <div style={{
        height: 40, background: 'var(--ink-900)', display: 'flex', alignItems: 'center',
        gap: 10, padding: '0 16px',
      }}>
        <span style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FF6464' }}/>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#FFC864' }}/>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#64FF96' }}/>
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
          propaily.app/portafolio/general/cartografia
        </span>
      </div>
      <div style={{ height: 520, position: 'relative' }}>
        <MapPlaceholder withColonyShading pins />
        {/* tiny rail */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 48,
          background: 'var(--ink-900)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 0',
        }}>
          <PropailyMark size={26} radius={6} />
          <div style={{ height: 12 }}/>
          {[IcMap, IcBuilding, IcChart, IcCalc].map((I, i) => (
            <span key={i} style={{ width: 32, height: 32, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)', background: i === 0 ? 'rgba(110,58,255,0.2)' : 'transparent' }}>
              <I size={16}/>
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const LandingFeatures = () => {
  const feats = [
    {
      I: IcMap, title: 'Cartografía con catastro real',
      desc: 'Capas de colonias, vialidades y lotes coloreadas por valor fiscal. Click en cualquier lote para ver área, frente, valor estimado y crear una propiedad vinculada.',
      mono: 'COLONIAS · TRAMOS · LOTES',
    },
    {
      I: IcBuilding, title: 'Propiedades vinculadas',
      desc: 'Cada propiedad se vincula con su lote real. Área, perímetro y valor sugerido bajan del catastro automáticamente; tú decides qué prevalece.',
      mono: 'CATASTRO → PROPIEDAD',
    },
    {
      I: IcDoc, title: 'Documentos sensibles',
      desc: 'Escrituras, predial y avalúos con sensibilidad granular, signed URLs de 60s y bitácora completa de quién descargó qué.',
      mono: '15 CATEGORÍAS · SOFT-DELETE',
    },
    {
      I: IcShield, title: 'Watermark dinámica',
      desc: 'Toda exportación lleva email del usuario y timestamp embebidos. Para portafolios fiduciarios donde el rastro importa.',
      mono: 'EMAIL · TIMESTAMP · IP',
    },
    {
      I: IcUsers, title: 'Permisos por portafolio',
      desc: 'Multi-cliente, multi-portafolio. Invita agentes con acceso solo a las propiedades de su cliente. Roles: admin, agent, viewer.',
      mono: 'COMPANY · CLIENT · PORTFOLIO',
    },
    {
      I: IcChart, title: 'Valuaciones e historial',
      desc: 'Cada avalúo se queda en línea. Compara catastro, comercial y avalúos bancarios en el tiempo, exporta a PDF o CSV.',
      mono: 'AVALÚOS · KPI · EXPORT',
    },
  ];
  return (
    <section style={{ padding: '96px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {feats.map((f, i) => (
          <div key={i} style={{
            border: '1px solid var(--ink-100)', borderRadius: 14, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 10, background: '#fff', minHeight: 240,
          }}>
            <span style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--pp-50)', color: 'var(--pp-600)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
            }}><f.I size={20}/></span>
            <h3 style={{ margin: 0, font: '600 18px var(--font-sans)', letterSpacing: '-0.01em' }}>{f.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55 }}>{f.desc}</p>
            <div style={{ flex: 1 }}/>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', letterSpacing: '0.12em', marginTop: 6 }}>
              {f.mono}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const LandingMap = () => (
  <section style={{ padding: '0 56px 96px' }}>
    <div style={{
      borderRadius: 24, overflow: 'hidden', position: 'relative',
      background: 'var(--ink-900)', padding: '64px 56px', color: '#fff',
      backgroundImage: `
        radial-gradient(800px 400px at 0% 0%, rgba(110,58,255,0.3), transparent 70%),
        radial-gradient(600px 400px at 100% 100%, rgba(110,58,255,0.18), transparent 70%)
      `,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--pp-300)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            La diferencia
          </span>
          <h2 style={{ margin: '12px 0 16px', font: '600 42px/1.05 var(--font-sans)', letterSpacing: '-0.025em' }}>
            Hoja de cálculo<br/>vs <span style={{ color: 'var(--pp-300)' }}>Propaily</span>
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.6, maxWidth: 460 }}>
            Tus propiedades como filas en Excel son una abstracción. Tus propiedades sobre el catastro
            real son una decisión.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['Hoja de cálculo', 'Propiedad como fila aislada', 'Valor manual y desactualizado', 'Documentos en Drive sin trazabilidad'],
            ['Propaily',         'Propiedad sobre el catastro real', 'Valor catastral + comercial actualizado', 'Documentos con bitácora y watermark'],
          ].map((row, i) => (
            <div key={i} style={{
              padding: '16px 18px', borderRadius: 12,
              background: i === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(110,58,255,0.18)',
              border: i === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(142,102,255,0.4)',
            }}>
              <div style={{ font: '600 13px var(--font-sans)', color: i===0?'rgba(255,255,255,0.6)':'var(--pp-200)', marginBottom: 8, letterSpacing: '-0.005em' }}>
                {row[0]}
              </div>
              {row.slice(1).map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0' }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 999, marginTop: 2, flex: '0 0 auto',
                    background: i === 0 ? 'rgba(255,255,255,0.15)' : 'var(--pp-400)',
                    color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700,
                  }}>{i === 0 ? '·' : '✓'}</span>
                  <span style={{ fontSize: 13, color: i === 0 ? 'rgba(255,255,255,0.55)' : '#fff' }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const LandingPricing = () => (
  <section style={{ padding: '96px 56px', background: 'var(--bg-subtle)' }}>
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--pp-500)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        Acceso
      </span>
      <h2 style={{ margin: '12px 0 8px', font: '600 40px/1.05 var(--font-sans)', letterSpacing: '-0.025em' }}>
        Por invitación.
      </h2>
      <p style={{ margin: 0, color: 'var(--ink-500)', fontSize: 16 }}>
        Cada portafolio se configura a mano con el equipo de GF Consultoría.
      </p>
    </div>
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
      {[
        { name: 'Family office', subtitle: 'Hasta 25 propiedades', price: 'Desde $24,000', period: 'MXN /mes', features: ['1 portafolio · 1 cliente', 'Hasta 3 agentes', 'Cartografía + documentos', 'Soporte por email'] },
        { name: 'Multi-portafolio', subtitle: '25 – 250 propiedades', price: 'Desde $58,000', period: 'MXN /mes', features: ['Portafolios ilimitados', 'Agentes ilimitados', 'Valuaciones + reportes Q', 'Onboarding asistido'], highlighted: true },
        { name: 'Custodia', subtitle: '250+ propiedades', price: 'A medida', period: '', features: ['Multi-tenant', 'SSO + audit log avanzado', 'Integración a ERP / contabilidad', 'Custodia jurídica'] },
      ].map((p, i) => (
        <div key={i} style={{
          border: p.highlighted ? '1px solid var(--pp-300)' : '1px solid var(--ink-100)',
          borderRadius: 16, padding: 28, background: '#fff',
          display: 'flex', flexDirection: 'column', gap: 14,
          boxShadow: p.highlighted ? '0 20px 60px rgba(110,58,255,0.18)' : 'var(--shadow-xs)',
          position: 'relative',
        }}>
          {p.highlighted && <span style={{
            position: 'absolute', top: -12, right: 20, padding: '4px 10px', borderRadius: 999,
            background: 'var(--pp-500)', color: '#fff', font: '500 11px var(--font-sans)', letterSpacing: '0.04em',
          }}>Más solicitado</span>}
          <div>
            <h3 style={{ margin: 0, font: '600 20px var(--font-sans)', letterSpacing: '-0.01em' }}>{p.name}</h3>
            <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 4 }}>{p.subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="num" style={{ font: '600 32px var(--font-sans)', letterSpacing: '-0.02em' }}>{p.price}</span>
            <span style={{ color: 'var(--ink-500)', fontSize: 13 }}>{p.period}</span>
          </div>
          <div style={{ height: 1, background: 'var(--ink-100)' }} />
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {p.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--ink-700)' }}>
                <IcCheck size={14} style={{ color: 'var(--pp-500)', marginTop: 2 }} />
                {f}
              </li>
            ))}
          </ul>
          <div style={{ flex: 1 }} />
          <Btn variant={p.highlighted ? 'primary' : 'secondary'} size="md" style={{ justifyContent: 'center', width: '100%' }}>
            {p.highlighted ? 'Solicitar acceso' : 'Contactar'}
          </Btn>
        </div>
      ))}
    </div>
  </section>
);

const LandingFooter = () => (
  <footer style={{ padding: '64px 56px 32px', background: 'var(--ink-900)', color: '#fff' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48 }}>
      <div>
        <PropailyLogo height={26} color="#fff" endorsement />
        <p style={{ margin: '14px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 320 }}>
          La cartografía del patrimonio inmobiliario.
          Hecho en CDMX por GF Consultoría.
        </p>
      </div>
      {[
        ['Producto', ['Cartografía', 'Propiedades', 'Documentos', 'Valuaciones', 'Roadmap']],
        ['Empresa', ['GF Consultoría', 'Blog', 'Casos', 'Contacto']],
        ['Legal', ['Términos', 'Privacidad', 'Seguridad', 'Audit log']],
      ].map(([title, items]) => (
        <div key={title}>
          <div className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(i => <a key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', cursor: 'pointer' }}>{i}</a>)}
          </div>
        </div>
      ))}
    </div>
    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '40px 0 18px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
        © 2026 PROPAILY · GF CONSULTORÍA · CDMX
      </span>
      <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
        v0.6.2 · Status ● operacional
      </span>
    </div>
  </footer>
);

Object.assign(window, { Landing });
