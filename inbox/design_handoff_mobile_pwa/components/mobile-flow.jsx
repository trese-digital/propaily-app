// Mobile Flow — pantallas nuevas para completar el storyboard.
// Reúsa el lenguaje de mobile.jsx (MStack, MSection, MCard, MTabBar, MetricMini, MNotif, etc).
// Mantra: consultar + aprobar. Nada de edición pesada en móvil.

// ─── Helpers compartidos ────────────────────────────────────────────
const MFlowTopBar = ({ title, back = true, right }) => (
  <div style={{
    padding: '54px 14px 12px', background: '#fff',
    borderBottom: '1px solid var(--ink-100)',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    {back ? <Btn variant="icon"><IcArrowR size={14} style={{ transform: 'rotate(180deg)' }}/></Btn> : <span style={{ width: 32 }} />}
    <span style={{ flex: 1, font: '600 16px var(--font-sans)', textAlign: 'center', letterSpacing: '-0.005em' }}>{title}</span>
    {right || <span style={{ width: 32 }} />}
  </div>
);

const PageDots = ({ count = 3, active = 0, color = '#fff' }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{
        width: i === active ? 22 : 6, height: 6, borderRadius: 999,
        background: i === active ? color : `${color}55`, transition: 'width .2s',
      }} />
    ))}
  </div>
);

// ─── 01 · Splash (PWA cold start) ───────────────────────────────────
const MFlowSplash = () => (
  <div style={{
    height: '100%', width: '100%',
    background: 'linear-gradient(160deg, var(--pp-500) 0%, var(--pp-800) 70%, var(--ink-900) 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: '#fff', position: 'relative', overflow: 'hidden',
  }}>
    <span style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: 999, background: 'rgba(255,255,255,0.08)' }} />
    <span style={{ position: 'absolute', bottom: -120, left: -60, width: 240, height: 240, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }} />

    <PropailyMark size={84} bg="#fff" fg="var(--pp-600)" radius={20} />
    <div style={{ marginTop: 22, font: '600 28px var(--font-sans)', letterSpacing: '-0.025em' }}>propaily</div>
    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginTop: 4 }}>
      by GF Consultoría
    </div>

    {/* Loader */}
    <div style={{ position: 'absolute', bottom: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
      <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.65, textTransform: 'uppercase' }}>Sincronizando portafolio</span>
    </div>

    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

// ─── 02 · Onboarding · slide 1 (consulta) ───────────────────────────
const MFlowOnboard1 = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', paddingTop: 54 }}>
    <div style={{ padding: '8px 18px', display: 'flex', justifyContent: 'flex-end' }}>
      <span style={{ font: '500 14px var(--font-sans)', color: 'var(--ink-500)' }}>Omitir</span>
    </div>
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(140deg, var(--pp-50) 0%, var(--ink-25) 70%)',
      margin: '8px 22px', borderRadius: 22, padding: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* faux phone with property card preview */}
      <div style={{ width: 220, transform: 'rotate(-3deg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 14, background: '#fff', borderRadius: 14, border: '1px solid var(--pp-100)', boxShadow: '0 10px 28px rgba(110,58,255,0.18)' }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--pp-700)', textTransform: 'uppercase', fontWeight: 600 }}>Patrimonio</div>
          <div className="mono num" style={{ font: '600 28px var(--font-sans)', letterSpacing: '-0.02em', marginTop: 2 }}>$62.7M</div>
          <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, marginTop: 1 }}>↗ +4.2% trimestre</div>
        </div>
        <div style={{ padding: 10, background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)', display: 'flex', gap: 8, alignItems: 'center', boxShadow: 'var(--shadow-xs)' }}>
          <div className="pp-img-ph" style={{ width: 38, height: 38, fontSize: 0, borderRadius: 7 }} />
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 11px var(--font-sans)' }}>Casa Polanco 412</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)' }}>$8.4M · rentada</div>
          </div>
        </div>
      </div>
      <span style={{ position: 'absolute', top: 24, left: 24, width: 60, height: 60, borderRadius: 14, background: 'var(--pp-500)', opacity: 0.08, transform: 'rotate(15deg)' }} />
      <span style={{ position: 'absolute', bottom: 32, right: 30, width: 90, height: 90, borderRadius: 999, background: 'var(--pp-500)', opacity: 0.06 }} />
    </div>
    <div style={{ padding: '24px 28px 18px', textAlign: 'center' }}>
      <h1 style={{ margin: 0, font: '600 26px/1.15 var(--font-sans)', letterSpacing: '-0.025em', color: 'var(--ink-900)' }}>
        Tu portafolio,<br/>donde estés
      </h1>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55 }}>
        Consulta el valor, las rentas y los avalúos de tus propiedades sin abrir la laptop.
      </p>
    </div>
    <div style={{ padding: '0 24px 32px' }}>
      <PageDots count={3} active={0} color="var(--pp-500)" />
      <button style={{
        marginTop: 18, height: 50, width: '100%', borderRadius: 12, border: 'none',
        background: 'var(--pp-500)', color: '#fff', font: '600 15px var(--font-sans)',
        boxShadow: '0 6px 20px rgba(110,58,255,0.25)',
      }}>Continuar</button>
    </div>
  </div>
);

// ─── 03 · Onboarding · slide 2 (aprueba) ────────────────────────────
const MFlowOnboard2 = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', paddingTop: 54 }}>
    <div style={{ padding: '8px 18px', display: 'flex', justifyContent: 'flex-end' }}>
      <span style={{ font: '500 14px var(--font-sans)', color: 'var(--ink-500)' }}>Omitir</span>
    </div>
    <div style={{
      flex: 1, margin: '8px 22px', borderRadius: 22,
      background: 'linear-gradient(140deg, #FFFBEB 0%, var(--ink-25) 70%)',
      padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ width: 232, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 14, background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)', boxShadow: '0 10px 28px rgba(0,0,0,0.10)', transform: 'rotate(-2deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: '#F59E0B', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>!</span>
            <span style={{ font: '600 12px var(--font-sans)' }}>Renovación pendiente</span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>Casa Polanco · Sofía M.</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <span style={{ flex: 1, padding: '6px 0', textAlign: 'center', borderRadius: 6, border: '1px solid var(--ink-200)', fontSize: 11 }}>Rechazar</span>
            <span style={{ flex: 1, padding: '6px 0', textAlign: 'center', borderRadius: 6, background: 'var(--pp-500)', color: '#fff', fontSize: 11, fontWeight: 600 }}>Aprobar</span>
          </div>
        </div>
        <div style={{ padding: 12, background: '#ECFDF5', borderRadius: 12, border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 8, transform: 'rotate(1.5deg)', marginLeft: 18 }}>
          <span style={{ width: 26, height: 26, borderRadius: 999, background: '#10B981', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={13}/></span>
          <span style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>Aprobado · listo</span>
        </div>
      </div>
    </div>
    <div style={{ padding: '24px 28px 18px', textAlign: 'center' }}>
      <h1 style={{ margin: 0, font: '600 26px/1.15 var(--font-sans)', letterSpacing: '-0.025em', color: 'var(--ink-900)' }}>
        Aprueba con<br/>un toque
      </h1>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55 }}>
        Renovaciones, avalúos y propuestas — todo lo que necesita tu visto bueno te llega aquí.
      </p>
    </div>
    <div style={{ padding: '0 24px 32px' }}>
      <PageDots count={3} active={1} color="var(--pp-500)" />
      <button style={{
        marginTop: 18, height: 50, width: '100%', borderRadius: 12, border: 'none',
        background: 'var(--pp-500)', color: '#fff', font: '600 15px var(--font-sans)',
        boxShadow: '0 6px 20px rgba(110,58,255,0.25)',
      }}>Continuar</button>
    </div>
  </div>
);

// ─── 04 · Install · Añadir a pantalla de inicio (PWA) ───────────────
const MFlowInstall = () => (
  <div style={{ height: '100%', position: 'relative', background: 'rgba(20, 14, 48, 0.55)', backdropFilter: 'blur(2px)', overflow: 'hidden' }}>
    {/* Faux Safari chrome (Mexico) — to anchor the sheet */}
    <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '4px 14px 10px', borderBottom: '1px solid #ddd', opacity: 0.85 }}>
        <div className="mono" style={{ fontSize: 11, color: '#777', textAlign: 'center', padding: '6px 10px', borderRadius: 10, background: '#eee' }}>
          🔒 app.propaily.com
        </div>
      </div>
      <div style={{ flex: 1, background: 'linear-gradient(160deg, var(--pp-50) 0%, var(--ink-25) 100%)', opacity: 0.6 }} />
    </div>

    {/* Bottom sheet — iOS-style Add to Home */}
    <div style={{
      position: 'absolute', left: 8, right: 8, bottom: 30,
      background: '#F2F2F7', borderRadius: 14, padding: '20px 18px 14px',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
      fontFamily: '-apple-system, system-ui',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
        <PropailyMark size={56} bg="#fff" fg="var(--pp-600)" radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '600 17px -apple-system, system-ui', letterSpacing: '-0.4px' }}>Propaily</div>
          <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 2 }}>app.propaily.com</div>
        </div>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#3C3C43', lineHeight: 1.45 }}>
        Añade Propaily a tu pantalla de inicio para acceder rápido, recibir avisos y trabajar sin conexión.
      </p>

      {/* Steps preview */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['1', 'Toca', <svg width="14" height="18" viewBox="0 0 14 18" fill="none" key="s"><rect x="1" y="6" width="12" height="11" rx="2" stroke="#007AFF" strokeWidth="1.4"/><path d="M7 11V1m0 0L4 4m3-3 3 3" stroke="#007AFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>, 'Compartir'],
          ['2', 'Elige', <span key="s" style={{ width: 16, height: 16, borderRadius: 4, background: '#fff', border: '1.5px solid #007AFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#007AFF', fontWeight: 700, fontSize: 12 }}>+</span>, 'Añadir a inicio'],
        ].map(([n, prefix, icon, label]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#000' }}>
            <span style={{ width: 18, height: 18, borderRadius: 999, background: '#007AFF', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{n}</span>
            <span>{prefix}</span>
            {icon}
            <span style={{ fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: 14, width: '100%', height: 44, borderRadius: 10, border: 'none',
        background: '#007AFF', color: '#fff', font: '600 15px -apple-system, system-ui',
      }}>Entendido</button>
      <div style={{ height: 4 }} />
      <div style={{ textAlign: 'center', fontSize: 12, color: '#8E8E93' }}>Recordarme después</div>
    </div>
  </div>
);

// ─── 05 · Role selector ─────────────────────────────────────────────
const MFlowRole = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', paddingTop: 54 }}>
    <div style={{ padding: '20px 24px 0' }}>
      <PropailyMark size={36} bg="var(--pp-500)" fg="#fff" radius={9} />
      <h1 style={{ margin: '22px 0 6px', font: '600 26px/1.15 var(--font-sans)', letterSpacing: '-0.025em' }}>
        ¿Cómo usarás Propaily?
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55 }}>
        Detectamos tu cuenta. Elige el rol con el que quieres empezar — puedes cambiarlo después desde tu perfil.
      </p>
    </div>

    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { I: IcChart,    n: 'Propietario',    d: 'Ve tu patrimonio y aprueba decisiones', tone: 'violet', active: true },
        { I: IcKey,      n: 'Inquilino',      d: 'Paga, reporta problemas, consulta tu contrato', tone: 'ok' },
        { I: IcBuilding, n: 'Operador GFC',   d: 'Cobranza, mantenimiento y administración', tone: 'warn' },
      ].map((r, i) => (
        <div key={i} style={{
          padding: 16, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14,
          background: r.active ? 'var(--pp-50)' : '#fff',
          border: r.active ? '1.5px solid var(--pp-400)' : '1px solid var(--ink-200)',
          boxShadow: r.active ? '0 6px 20px rgba(110,58,255,0.12)' : 'var(--shadow-xs)',
        }}>
          <span style={{
            width: 44, height: 44, borderRadius: 11,
            background: r.active ? 'var(--pp-500)' : 'var(--ink-50)',
            color: r.active ? '#fff' : 'var(--ink-600)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
          }}>
            <r.I size={20}/>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 15px var(--font-sans)', color: 'var(--ink-900)' }}>{r.n}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2, lineHeight: 1.4 }}>{r.d}</div>
          </div>
          <span style={{
            width: 22, height: 22, borderRadius: 999,
            border: r.active ? 'none' : '1.5px solid var(--ink-300)',
            background: r.active ? 'var(--pp-500)' : '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {r.active && <IcCheck size={12} style={{ color: '#fff' }}/>}
          </span>
        </div>
      ))}
    </div>

    <div style={{ padding: '0 24px 32px' }}>
      <button style={{
        height: 52, width: '100%', borderRadius: 12, border: 'none',
        background: 'var(--pp-500)', color: '#fff', font: '600 15px var(--font-sans)',
        boxShadow: '0 6px 20px rgba(110,58,255,0.25)',
      }}>Continuar como Propietario</button>
    </div>
  </div>
);

// ─── 06 · Magic link enviado ────────────────────────────────────────
const MFlowMagicSent = () => (
  <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', paddingTop: 54 }}>
    <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center' }}>
      <Btn variant="icon"><IcArrowR size={14} style={{ transform: 'rotate(180deg)' }}/></Btn>
    </div>

    <div style={{ flex: 1, padding: '40px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        width: 92, height: 92, borderRadius: 22,
        background: 'linear-gradient(135deg, var(--pp-100) 0%, var(--pp-300) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        boxShadow: '0 14px 32px rgba(110,58,255,0.20)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--pp-700)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9 6 9-6"/>
          <rect x="3" y="5" width="18" height="14" rx="2"/>
        </svg>
      </div>

      <h1 style={{ margin: 0, font: '600 24px/1.2 var(--font-sans)', letterSpacing: '-0.02em' }}>
        Revisa tu correo
      </h1>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.55, maxWidth: 290 }}>
        Enviamos un enlace mágico a
      </p>
      <span className="mono" style={{
        marginTop: 6, padding: '6px 12px', borderRadius: 8,
        background: 'var(--pp-50)', color: 'var(--pp-700)', fontSize: 13, fontWeight: 600,
      }}>pablo@gfc.mx</span>
      <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5, maxWidth: 290 }}>
        Toca el enlace en cualquier dispositivo para iniciar sesión. Caduca en 15 minutos.
      </p>

      <div style={{ marginTop: 28, width: '100%' }}>
        <button style={{
          width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'var(--ink-900)', color: '#fff',
          font: '600 14px var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>Abrir Gmail</button>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button style={{ flex: 1, height: 44, borderRadius: 10, border: '1px solid var(--ink-200)', background: '#fff', font: '500 13px var(--font-sans)', color: 'var(--ink-700)' }}>Outlook</button>
          <button style={{ flex: 1, height: 44, borderRadius: 10, border: '1px solid var(--ink-200)', background: '#fff', font: '500 13px var(--font-sans)', color: 'var(--ink-700)' }}>Otra app</button>
        </div>
      </div>
    </div>

    <div style={{ padding: '0 28px 32px', textAlign: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>¿No te llegó? </span>
      <span style={{ fontSize: 12, color: 'var(--pp-600)', fontWeight: 600 }}>Reenviar en 0:48</span>
    </div>
  </div>
);

// ─── 07 · Owner · pendientes de aprobación ──────────────────────────
const MFlowOwnerPending = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    <MFlowTopBar title="Te toca aprobar" right={<Btn variant="icon"><IcFilter size={14}/></Btn>} />

    <div style={{ padding: '14px 18px 6px' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
        Esperan tu decisión · 3
      </div>
    </div>

    <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Featured — renovación */}
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid var(--pp-200)',
        boxShadow: '0 4px 16px rgba(110,58,255,0.08)', overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 14px', background: 'var(--pp-50)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone="violet">Renovación</Badge>
          <span style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 10, color: 'var(--pp-700)', fontWeight: 600 }}>VENCE EN 17 DÍAS</span>
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <Avatar name="Sofía Mendoza" size={42} tone="violet" />
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 14px var(--font-sans)' }}>Sofía Mendoza</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Casa Polanco 412 · inquilina desde jun 2024</div>
            </div>
          </div>
          <div style={{ padding: 12, background: 'var(--ink-25)', borderRadius: 10, border: '1px solid var(--ink-100)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>Renta actual</div>
              <div className="mono num" style={{ font: '500 15px var(--font-sans)', marginTop: 2 }}>$38,000</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--pp-700)', textTransform: 'uppercase', fontWeight: 600 }}>Propuesta</div>
              <div className="mono num" style={{ font: '600 15px var(--font-sans)', color: 'var(--pp-700)', marginTop: 2 }}>$40,500 <span style={{ color: '#10B981', fontSize: 11 }}>+6.6%</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, height: 40, borderRadius: 10, border: '1px solid var(--ink-200)', background: '#fff', color: 'var(--ink-700)', font: '500 13px var(--font-sans)' }}>Ver detalles</button>
            <button style={{ flex: 1.4, height: 40, borderRadius: 10, border: 'none', background: 'var(--pp-500)', color: '#fff', font: '600 13px var(--font-sans)', boxShadow: '0 4px 14px rgba(110,58,255,0.25)' }}>Aprobar</button>
          </div>
        </div>
      </div>

      {/* Compact items */}
      {[
        { tone: 'warn', tag: 'Avalúo', t: 'Avalúo BBVA · Casa Polanco 412', d: 'Vence en 17 días · costo $4,800', actor: 'BBVA Avalúos' },
        { tone: 'info', tag: 'Mantenimiento', t: 'Cotización Hidroplom MX', d: 'Loft Condesa · fuga de tubería · $6,200', actor: 'Carlos Reyes' },
      ].map((it, i) => (
        <div key={i} style={{
          padding: 14, background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            width: 40, height: 40, borderRadius: 10,
            background: it.tone === 'warn' ? '#FFFBEB' : '#EFF6FF',
            color: it.tone === 'warn' ? '#F59E0B' : '#3B82F6',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
          }}>{it.tone === 'warn' ? <IcDoc size={18}/> : <IcSettings size={18}/>}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Badge tone={it.tone === 'warn' ? 'warn' : 'neutral'}>{it.tag}</Badge>
            </div>
            <div style={{ font: '600 13px var(--font-sans)' }}>{it.t}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 2 }}>{it.d}</div>
          </div>
          <IcChevR size={14} style={{ color: 'var(--ink-400)' }} />
        </div>
      ))}

      <div style={{ padding: '20px 0', textAlign: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Sin pendientes anteriores
        </span>
      </div>
    </div>

    <MTabBar active={3} />
  </div>
);

// ─── 08 · Owner · aprobar renovación detalle ────────────────────────
const MFlowApproveDetail = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 130 }}>
    <MFlowTopBar title="Renovación · Sofía M." right={<Btn variant="icon"><IcDownload size={14}/></Btn>} />

    {/* Headline */}
    <div style={{ padding: '18px 18px 6px' }}>
      <Badge tone="warn">Vence en 17 días</Badge>
      <h1 style={{ margin: '10px 0 4px', font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>
        Propuesta de renovación
      </h1>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
        Casa Polanco 412 · 12 meses · jun 2026 → may 2027
      </div>
    </div>

    {/* Comparison */}
    <div style={{ padding: '14px 18px' }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--ink-100)' }}>
          <div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>Renta actual</div>
            <div className="mono num" style={{ font: '500 22px var(--font-sans)', color: 'var(--ink-700)', letterSpacing: '-0.015em', marginTop: 4 }}>$38,000</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 2 }}>desde jun 2024</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ink-100)', paddingLeft: 14 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--pp-700)', textTransform: 'uppercase', fontWeight: 600 }}>Propuesta</div>
            <div className="mono num" style={{ font: '600 22px var(--font-sans)', color: 'var(--pp-700)', letterSpacing: '-0.015em', marginTop: 4 }}>$40,500</div>
            <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, marginTop: 2 }}>+6.6% · INPC + 1.2pp</div>
          </div>
        </div>
        <div style={{ padding: '12px 14px', background: 'var(--ink-25)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Depósito en garantía', '$40,500', 'Igual a renta'],
            ['Plazo', '12 meses', 'jun 26 → may 27'],
            ['Incremento mid-term', 'INPC anual', 'Cláusula 7'],
            ['Penalidad pago tardío', '5% / mes', 'Sin cambio'],
          ].map(([k, v, h], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-600)', flex: 1 }}>{k}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-900)', fontWeight: 500 }}>{v}</span>
              <span style={{ fontSize: 10, color: 'var(--ink-500)', minWidth: 80, textAlign: 'right' }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Tenant note */}
    <MSection title="Nota del inquilino">
      <MCard>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Avatar name="Sofía Mendoza" size={32} tone="violet" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-900)', lineHeight: 1.55 }}>
              "Pablo, gracias por estos dos años. Me encantaría quedarme. Solo te pediría considerar mantener la renta — he sido puntual y mantengo la casa impecable."
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 6 }}>
              recibido vía Propaily · hace 2 días
            </div>
          </div>
        </div>
      </MCard>
    </MSection>

    {/* Docs */}
    <MSection title="Documentos adjuntos · 3">
      <MCard style={{ padding: 0 }}>
        {[
          ['Contrato renovación 2026 (borrador)', '4 pp · PDF'],
          ['Histórico de pagos', '24/24 puntuales · CSV'],
          ['Inspección visual mar-2026', '8 fotos'],
        ].map((d, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
          }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--pp-50)', color: 'var(--pp-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IcDoc size={15}/></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '500 13px var(--font-sans)' }}>{d[0]}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 1 }}>{d[1]}</div>
            </div>
            <IcChevR size={13} style={{ color: 'var(--ink-400)' }} />
          </div>
        ))}
      </MCard>
    </MSection>

    {/* Sticky action bar */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: '#fff', borderTop: '1px solid var(--ink-100)',
      padding: '12px 18px 28px', display: 'flex', gap: 8,
      boxShadow: '0 -8px 24px rgba(27,8,83,0.06)',
    }}>
      <button style={{ flex: 1, height: 48, borderRadius: 12, border: '1px solid var(--ink-200)', background: '#fff', font: '500 14px var(--font-sans)', color: 'var(--ink-700)' }}>
        Negociar
      </button>
      <button style={{ flex: 1.4, height: 48, borderRadius: 12, border: 'none', background: 'var(--pp-500)', color: '#fff', font: '600 14px var(--font-sans)', boxShadow: '0 6px 18px rgba(110,58,255,0.28)' }}>
        Aprobar propuesta
      </button>
    </div>
  </div>
);

// ─── 09 · Inquilino · subir comprobante ─────────────────────────────
const MFlowComprobUpload = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 120 }}>
    <MFlowTopBar title="Comprobante de pago" />

    <div style={{ padding: '16px 18px' }}>
      <div style={{
        padding: 14, background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)',
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--pp-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <IcCheck size={20} style={{ color: '#fff' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: '600 13px var(--font-sans)' }}>Transferencia hecha</div>
          <div className="mono num" style={{ fontSize: 11, color: 'var(--ink-500)' }}>$38,000 · 14 may · 11:42</div>
        </div>
      </div>

      <MFormField label="Sube el comprobante que te dio tu banco">
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, height: 130, borderRadius: 12, border: '1.5px dashed var(--pp-300)',
            background: 'var(--pp-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: 'var(--pp-700)',
          }}>
            <IcPhoto size={26}/>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Tomar foto</span>
            <span className="mono" style={{ fontSize: 9, opacity: 0.7 }}>Cámara del teléfono</span>
          </div>
          <div style={{
            flex: 1, height: 130, borderRadius: 12, border: '1.5px dashed var(--ink-300)',
            background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: 'var(--ink-600)',
          }}>
            <IcDownload size={26} style={{ transform: 'rotate(180deg)' }}/>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Subir imagen</span>
            <span className="mono" style={{ fontSize: 9, opacity: 0.7 }}>PDF o JPG</span>
          </div>
        </div>
      </MFormField>

      <div style={{ marginTop: 18 }}>
        <MFormField label="Vista previa">
          <div style={{
            height: 220, borderRadius: 12, border: '1px solid var(--ink-200)', background: '#fff', overflow: 'hidden', position: 'relative',
          }}>
            <div className="pp-img-ph" style={{ position: 'absolute', inset: 0, borderRadius: 0, fontSize: 11 }}>
              Comprobante BBVA · 38,000.00 MXN
            </div>
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
              <span style={{ padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 600 }}>Reemplazar</span>
              <span style={{ padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 600, color: 'var(--bad)' }}>Quitar</span>
            </div>
          </div>
        </MFormField>
      </div>

      <div style={{ marginTop: 14, padding: 12, background: '#ECFDF5', borderRadius: 10, border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: '#10B981', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={12}/></span>
        <div style={{ flex: 1, fontSize: 12, color: '#065F46', lineHeight: 1.4 }}>
          Detectamos <strong>$38,000</strong> y <strong>POL412-001</strong>. Coincide con tu pago.
        </div>
      </div>
    </div>

    {/* Sticky CTA */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: '#fff', borderTop: '1px solid var(--ink-100)',
      padding: '12px 18px 28px',
    }}>
      <button style={{
        width: '100%', height: 50, borderRadius: 12, border: 'none', background: 'var(--pp-500)', color: '#fff',
        font: '600 15px var(--font-sans)', boxShadow: '0 6px 18px rgba(110,58,255,0.25)',
      }}>Enviar comprobante</button>
    </div>
  </div>
);

// ─── 10 · Inquilino · confirmación de pago ──────────────────────────
const MFlowComprobOk = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', display: 'flex', flexDirection: 'column' }}>
    {/* Hero success */}
    <div style={{
      paddingTop: 80, paddingBottom: 32,
      background: 'linear-gradient(180deg, #ECFDF5 0%, var(--bg-muted) 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 22,
        background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 14px 32px rgba(16,185,129,0.32)',
      }}>
        <IcCheck size={42} style={{ color: '#fff' }}/>
      </div>
      <h1 style={{ margin: '20px 0 6px', font: '600 24px var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
        ¡Listo! Pago enviado
      </h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)', textAlign: 'center', maxWidth: 290, lineHeight: 1.5 }}>
        Tu administrador recibirá la confirmación y te avisaremos cuando la concilien.
      </p>
    </div>

    {/* Receipt card */}
    <div style={{ padding: '0 18px', marginTop: -12 }}>
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)',
        boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ink-100)' }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>Folio · PP-2026-014823</span>
          <Badge tone="ok">En revisión</Badge>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MSpeiRow label="Monto" value="$38,000.00 MXN" mono />
          <MSpeiRow label="Concepto" value="Renta mayo 2026" />
          <MSpeiRow label="Referencia" value="POL412-001" mono accent />
          <MSpeiRow label="Pagado el" value="14 may 2026 · 11:42" />
          <MSpeiRow label="Confirmación" value="ETA 24 hrs" />
        </div>
      </div>
    </div>

    {/* Next steps */}
    <div style={{ padding: '18px 18px 0' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
        Qué sigue
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Te avisaremos cuando concilien', 'Push + correo'],
          ['Tu siguiente pago: 1 jun 2026', '$38,000 · en 18 días'],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: 12, background: '#fff', borderRadius: 10, border: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--pp-500)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ flex: 1 }} />

    <div style={{ padding: '14px 18px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button style={{
        height: 50, borderRadius: 12, border: 'none', background: 'var(--ink-900)', color: '#fff',
        font: '600 14px var(--font-sans)',
      }}>Descargar comprobante</button>
      <button style={{
        height: 44, borderRadius: 12, border: '1px solid var(--ink-200)', background: '#fff', color: 'var(--ink-700)',
        font: '500 14px var(--font-sans)',
      }}>Volver al inicio</button>
    </div>
  </div>
);

// ─── 11 · Inquilino · cámara (mantenimiento) ────────────────────────
const MFlowCamera = () => (
  <div style={{ height: '100%', background: '#000', position: 'relative', overflow: 'hidden', color: '#fff' }}>
    {/* Viewfinder */}
    <div className="pp-img-ph" style={{ position: 'absolute', inset: 0, borderRadius: 0, background: 'linear-gradient(135deg, #2a2530 0%, #100c1c 100%)', fontSize: 0 }}>
      {/* Faux scene */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(110,58,255,0.10) 0%, transparent 60%)' }} />
      <div style={{
        position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%,-50%)',
        width: 180, height: 180, borderRadius: 12, background: 'linear-gradient(135deg, #4a3a30 0%, #2a1f18 100%)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }} />
    </div>

    {/* Top bar */}
    <div style={{ position: 'absolute', top: 54, left: 0, right: 0, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <IcX size={18}/>
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', fontSize: 12, fontWeight: 600 }}>
        Flash · auto
      </span>
    </div>

    {/* Center indicator */}
    <div style={{ position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center' }}>
      <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'rgba(110,58,255,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '-0.005em' }}>
        Fuga en cocina · foto 2 de 3
      </div>
    </div>

    {/* Focus brackets */}
    <div style={{
      position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%,-50%)',
      width: 80, height: 80, pointerEvents: 'none',
    }}>
      {['TL', 'TR', 'BL', 'BR'].map((c, i) => (
        <span key={c} style={{
          position: 'absolute', width: 14, height: 14,
          ...(c.includes('T') ? { top: 0 } : { bottom: 0 }),
          ...(c.includes('L') ? { left: 0 } : { right: 0 }),
          borderTop: c.includes('T') ? '2px solid #fff' : 'none',
          borderBottom: c.includes('B') ? '2px solid #fff' : 'none',
          borderLeft: c.includes('L') ? '2px solid #fff' : 'none',
          borderRight: c.includes('R') ? '2px solid #fff' : 'none',
        }} />
      ))}
    </div>

    {/* Captured thumbnails */}
    <div style={{ position: 'absolute', top: 180, right: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2].map((n) => (
        <div key={n} className="pp-img-ph" style={{ width: 48, height: 60, fontSize: 0, borderRadius: 8, border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
      ))}
    </div>

    {/* Bottom controls */}
    <div style={{
      position: 'absolute', bottom: 50, left: 0, right: 0, padding: '0 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div className="pp-img-ph" style={{ width: 48, height: 48, fontSize: 0, borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)' }} />
      <button style={{
        width: 74, height: 74, borderRadius: 999, border: '4px solid #fff', background: 'transparent',
        position: 'relative', cursor: 'pointer',
      }}>
        <span style={{
          position: 'absolute', inset: 6, borderRadius: 999, background: '#fff',
        }} />
      </button>
      <span style={{
        width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 16V8a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
          <path d="m16 8 4 4-4 4"/>
        </svg>
      </span>
    </div>
  </div>
);

// ─── 12 · Admin · home (hoy en campo) ───────────────────────────────
const MFlowAdminHome = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    {/* Header */}
    <div style={{ padding: '54px 18px 18px', background: '#fff', borderBottom: '1px solid var(--ink-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Avatar name="Marcela Ortiz" size={36} tone="warn" />
        <div style={{ flex: 1 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            GFC · Operador
          </span>
          <div style={{ font: '600 16px var(--font-sans)', letterSpacing: '-0.01em' }}>Hola, Marcela</div>
        </div>
        <Btn variant="icon"><IcBell size={16}/></Btn>
      </div>

      {/* Today summary */}
      <div style={{ padding: 12, background: 'var(--ink-900)', borderRadius: 12, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 999, background: 'rgba(110,58,255,0.25)' }} />
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.65, fontWeight: 600 }}>
          Hoy · jueves 14 may
        </div>
        <div style={{ font: '600 22px var(--font-sans)', marginTop: 4, letterSpacing: '-0.015em', position: 'relative' }}>
          12 tareas · 4 visitas
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 600 }}>3 cobros</span>
          <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 600 }}>5 manten.</span>
          <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(245,158,11,0.30)', color: '#FCD34D', fontSize: 11, fontWeight: 600 }}>2 urgentes</span>
        </div>
      </div>
    </div>

    {/* Mapa quick */}
    <MSection title="Tu ruta · 4 paradas">
      <MCard style={{ padding: 0 }}>
        <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
          <MapPlaceholder pins withColonyShading />
          <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 600 }}>
            32 km · 2h 14min
          </div>
        </div>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--pp-500)', color: '#fff', font: '600 11px var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
          <div style={{ flex: 1 }}>
            <div style={{ font: '500 13px var(--font-sans)' }}>Casa Polanco 412 · 10:30</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>Cobro · Sofía M. · $38,000</div>
          </div>
          <Btn variant="icon"><IcArrowR size={13}/></Btn>
        </div>
      </MCard>
    </MSection>

    {/* Urgentes */}
    <MSection title="Necesitan acción · 2">
      {[
        { tone: 'bad', I: IcBell, t: 'Renta vencida · Loft Condesa', d: 'Carlos · 14 días · $19,500', cta: 'Llamar' },
        { tone: 'warn', I: IcSettings, t: 'Fuga reportada · Roma 88', d: 'M-214 · sin asignar · 3h', cta: 'Asignar' },
      ].map((it, i) => (
        <div key={i} style={{ padding: 12, background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 38, height: 38, borderRadius: 9,
            background: it.tone === 'bad' ? '#FEF2F2' : '#FFFBEB',
            color: it.tone === 'bad' ? '#EF4444' : '#F59E0B',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
          }}><it.I size={17}/></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '600 13px var(--font-sans)' }}>{it.t}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{it.d}</div>
          </div>
          <button style={{
            padding: '6px 12px', borderRadius: 8, border: 'none',
            background: it.tone === 'bad' ? '#EF4444' : 'var(--pp-500)', color: '#fff',
            font: '600 12px var(--font-sans)',
          }}>{it.cta}</button>
        </div>
      ))}
    </MSection>

    {/* Quick actions */}
    <MSection title="Acceso rápido">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          [IcBuilding, 'Propiedades'],
          [IcUsers, 'Clientes'],
          [IcKey, 'Rentas'],
          [IcSettings, 'Manten.'],
        ].map(([I, l], i) => (
          <div key={i} style={{
            padding: '14px 4px 10px', background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--pp-50)', color: 'var(--pp-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I size={18}/></span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-700)' }}>{l}</span>
          </div>
        ))}
      </div>
    </MSection>

    <MTabBar active={0} />
  </div>
);

// ─── 13 · Admin · cobranza ──────────────────────────────────────────
const MFlowAdminCobranza = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    <div style={{ padding: '54px 18px 12px', background: '#fff', borderBottom: '1px solid var(--ink-100)' }}>
      <h1 style={{ margin: 0, font: '600 22px var(--font-sans)', letterSpacing: '-0.015em' }}>Cobranza</h1>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
        May 2026 · 24 rentas · $584,500
      </div>

      {/* Progress */}
      <div style={{ marginTop: 14 }}>
        <Progress value={78} tone="ok" label="Cobrado este mes" right="$455,500 · 78%" height={8} />
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <Chip active>Vencidos · 3</Chip>
          <Chip>Esta sem.</Chip>
          <Chip>Pagados · 19</Chip>
        </div>
      </div>
    </div>

    <div style={{ padding: '14px 18px 6px' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-500)', textTransform: 'uppercase', fontWeight: 600 }}>
        Vencidos · prioridad
      </div>
    </div>

    <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { name: 'Carlos y Mariana', prop: 'Loft Condesa', amt: '$19,500', days: 14, tone: 'bad', tel: '55 2188 4421' },
        { name: 'Roberto Vega', prop: 'Local Del Valle 12', amt: '$32,000', days: 7, tone: 'warn', tel: '55 4119 2030' },
        { name: 'Mariana López', prop: 'Casa Coyoacán 88', amt: '$26,000', days: 3, tone: 'warn', tel: '55 8920 1140' },
      ].map((c, i) => (
        <div key={i} style={{ padding: 14, background: '#fff', borderRadius: 12, border: '1px solid var(--ink-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <Avatar name={c.name} size={40} tone={c.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 14px var(--font-sans)' }}>{c.name}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{c.prop} · {c.tel}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono num" style={{ font: '600 15px var(--font-sans)' }}>{c.amt}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--bad)', fontWeight: 600 }}>{c.days} d vencido</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--ink-200)', background: '#fff', font: '500 12px var(--font-sans)', color: 'var(--ink-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              Llamar
            </button>
            <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--ink-200)', background: '#fff', font: '500 12px var(--font-sans)', color: 'var(--ink-700)' }}>
              WhatsApp
            </button>
            <button style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: 'var(--pp-500)', color: '#fff', font: '600 12px var(--font-sans)' }}>
              Marcar pago
            </button>
          </div>
        </div>
      ))}
    </div>

    <MTabBar active={2} />
  </div>
);

// ─── 14 · Avisos · detalle de aviso ─────────────────────────────────
const MFlowAvisoDetalle = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 110 }}>
    <MFlowTopBar title="Aviso" right={<Btn variant="icon"><IcMore size={14}/></Btn>} />

    <div style={{ padding: '18px 18px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 11, background: '#FEF2F2', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <IcBell size={20}/>
        </span>
        <div style={{ flex: 1 }}>
          <Badge tone="bad">Renta vencida</Badge>
          <div style={{ font: '600 17px var(--font-sans)', marginTop: 6, letterSpacing: '-0.015em' }}>Loft Condesa · Carlos y Mariana</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 2 }}>hace 8 min · sistema</div>
        </div>
      </div>
    </div>

    <div style={{ padding: '8px 18px' }}>
      <MCard accent>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Monto</div>
            <div className="mono num" style={{ font: '600 20px var(--font-sans)', marginTop: 4, color: 'var(--bad)' }}>$19,500</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Vencido</div>
            <div className="mono num" style={{ font: '600 20px var(--font-sans)', marginTop: 4, color: 'var(--bad)' }}>14 días</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Fecha original</div>
            <div className="mono num" style={{ font: '500 14px var(--font-sans)', marginTop: 4 }}>01 may 2026</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Multa acumulada</div>
            <div className="mono num" style={{ font: '500 14px var(--font-sans)', marginTop: 4 }}>$975</div>
          </div>
        </div>
      </MCard>
    </div>

    <MSection title="Histórico del inquilino">
      <MCard style={{ padding: 0 }}>
        {[
          ['May 2026', 'Vencido · sin pagar', 'bad'],
          ['Abr 2026', 'Pagado · 5 días tarde', 'warn'],
          ['Mar 2026', 'Pagado puntual', 'ok'],
          ['Feb 2026', 'Pagado puntual', 'ok'],
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none' }}>
            <Dot tone={r[2]} size={8} />
            <div style={{ flex: 1 }}>
              <div style={{ font: '500 13px var(--font-sans)' }}>{r[0]}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{r[1]}</div>
            </div>
            <span className="mono num" style={{ fontSize: 12, fontWeight: 500 }}>$19,500</span>
          </div>
        ))}
      </MCard>
    </MSection>

    <MSection title="Acciones tomadas">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Recordatorio enviado', 'WhatsApp · 03 may', 'ok'],
          ['Recordatorio enviado', 'Correo · 08 may', 'ok'],
          ['Llamada intentada', '12 may · sin respuesta', 'warn'],
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#fff', borderRadius: 10, border: '1px solid var(--ink-100)' }}>
            <Dot tone={a[2]} size={7} />
            <div style={{ flex: 1, fontSize: 12 }}>
              <span style={{ fontWeight: 500 }}>{a[0]}</span>
              <span className="mono" style={{ marginLeft: 6, fontSize: 10, color: 'var(--ink-500)' }}>{a[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </MSection>

    {/* Sticky actions */}
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: '#fff', borderTop: '1px solid var(--ink-100)',
      padding: '12px 18px 28px', display: 'flex', gap: 8,
    }}>
      <button style={{ flex: 1, height: 46, borderRadius: 10, border: '1px solid var(--ink-200)', background: '#fff', font: '500 13px var(--font-sans)', color: 'var(--ink-700)' }}>
        Reenviar aviso
      </button>
      <button style={{ flex: 1.4, height: 46, borderRadius: 10, border: 'none', background: 'var(--pp-500)', color: '#fff', font: '600 13px var(--font-sans)', boxShadow: '0 4px 14px rgba(110,58,255,0.25)' }}>
        Marcar como pagado
      </button>
    </div>
  </div>
);

// ─── 15 · Perfil & cambio de rol ────────────────────────────────────
const MFlowPerfil = () => (
  <div style={{ height: '100%', background: 'var(--bg-muted)', overflow: 'auto', paddingBottom: 100 }}>
    <div style={{ padding: '54px 0 18px', background: '#fff', borderBottom: '1px solid var(--ink-100)', textAlign: 'center' }}>
      <Avatar name="Pablo Mendoza" size={72} tone="warn" />
      <h1 style={{ margin: '12px 0 2px', font: '600 18px var(--font-sans)', letterSpacing: '-0.015em' }}>Pablo Mendoza</h1>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>pablo@gfc.mx</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '4px 10px', borderRadius: 999, background: 'var(--pp-50)' }}>
        <Dot tone="violet" size={6} />
        <span style={{ fontSize: 11, color: 'var(--pp-700)', fontWeight: 600 }}>Viendo como · Propietario</span>
      </div>
    </div>

    <MSection title="Cambiar de rol" style={{ paddingTop: 14 }}>
      <MCard style={{ padding: 0 }}>
        {[
          { I: IcChart, n: 'Propietario', d: 'Familia Mendoza · 4 propiedades', active: true },
          { I: IcKey, n: 'Inquilino', d: 'Sofía M. · Casa Polanco 412', active: false },
          { I: IcBuilding, n: 'Operador GFC', d: 'Acceso administrador · 87 propiedades', active: false },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
            borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
            background: r.active ? 'var(--pp-50)' : '#fff',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 9,
              background: r.active ? 'var(--pp-500)' : 'var(--ink-50)',
              color: r.active ? '#fff' : 'var(--ink-600)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
            }}><r.I size={17}/></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 13px var(--font-sans)', color: r.active ? 'var(--pp-700)' : 'var(--ink-900)' }}>{r.n}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{r.d}</div>
            </div>
            {r.active ? <IcCheck size={16} style={{ color: 'var(--pp-600)' }}/> : <IcChevR size={14} style={{ color: 'var(--ink-400)' }} />}
          </div>
        ))}
      </MCard>
    </MSection>

    <MSection title="Cuenta">
      <MCard style={{ padding: 0 }}>
        {[
          [IcUsers, 'Información personal', null],
          [IcBell, 'Notificaciones', 'Push · email · WhatsApp'],
          [IcShield, 'Seguridad', 'Face ID activo'],
          [IcDownload, 'Datos y privacidad', null],
        ].map(([I, n, d], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink-50)', color: 'var(--ink-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><I size={15}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ font: '500 13px var(--font-sans)' }}>{n}</div>
              {d && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{d}</div>}
            </div>
            <IcChevR size={13} style={{ color: 'var(--ink-400)' }} />
          </div>
        ))}
      </MCard>
    </MSection>

    <MSection title="App">
      <MCard style={{ padding: 0 }}>
        {[
          [IcSpark, 'Apariencia', 'Sistema'],
          [IcSettings, 'Idioma', 'Español (MX)'],
          [IcDoc, 'Términos y privacidad', null],
        ].map(([I, n, d], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink-50)', color: 'var(--ink-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><I size={15}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ font: '500 13px var(--font-sans)' }}>{n}</div>
              {d && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)' }}>{d}</div>}
            </div>
            <IcChevR size={13} style={{ color: 'var(--ink-400)' }} />
          </div>
        ))}
      </MCard>
    </MSection>

    <div style={{ padding: '14px 18px 4px' }}>
      <button style={{
        width: '100%', height: 46, borderRadius: 12,
        border: '1px solid var(--ink-200)', background: '#fff', color: 'var(--bad)',
        font: '500 14px var(--font-sans)',
      }}>Cerrar sesión</button>
    </div>
    <div style={{ padding: '6px 18px 0', textAlign: 'center' }}>
      <span className="mono" style={{ fontSize: 9, color: 'var(--ink-400)', letterSpacing: '0.1em' }}>
        propaily v1.2.3 · build 26.05.14
      </span>
    </div>

    <MTabBar active={4} />
  </div>
);

Object.assign(window, {
  MFlowSplash, MFlowOnboard1, MFlowOnboard2, MFlowInstall, MFlowRole, MFlowMagicSent,
  MFlowOwnerPending, MFlowApproveDetail,
  MFlowComprobUpload, MFlowComprobOk, MFlowCamera,
  MFlowAdminHome, MFlowAdminCobranza,
  MFlowAvisoDetalle, MFlowPerfil,
  MFlowTopBar, PageDots,
});
