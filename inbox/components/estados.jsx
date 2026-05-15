// Estados — Empty states · Modales · Toasts · Loading · Errores
// Una sola pantalla apilada que sirve de "guía de estados del sistema".

const Estados = () => {
  return (
    <div style={{
      background: 'var(--bg-muted)', minHeight: '100%', padding: 32,
      display: 'flex', flexDirection: 'column', gap: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>
          03 · Sistema
        </span>
        <h1 style={{ margin: 0, font: '600 30px var(--font-sans)', letterSpacing: '-0.025em' }}>Estados del sistema</h1>
      </div>

      {/* Empty states */}
      <Section title="Empty states" subtitle="Cuando una vista aún no tiene contenido — siempre con CTA claro">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Empty
            icon={IcBuilding}
            title="Aún no hay propiedades"
            sub="Crea tu primera propiedad o impórtala desde Excel para empezar a operar."
            primary="Crear propiedad"
            secondary="Importar CSV"
          />
          <Empty
            icon={IcDoc}
            title="Sin documentos cargados"
            sub="Sube escrituras, contratos, avalúos y comprobantes. Hasta 24 MB por archivo."
            primary="Cargar documentos"
            secondary="Pedir a propietario"
            accent
          />
          <Empty
            icon={IcKey}
            title="No tienes permisos para esta vista"
            sub="Pide acceso al administrador del portafolio o cambia de cliente desde la barra superior."
            primary="Solicitar acceso"
            secondary="Cambiar cliente"
            tone="warn"
          />
        </div>
      </Section>

      {/* Modal: new property */}
      <Section title="Modal · Crear propiedad" subtitle="Form denso, 3 pasos · este es el step 1">
        <ModalShell title="Nueva propiedad" sub="Paso 1 de 3 · Identificación">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Step n="1" label="Identificación" active />
            <Step n="2" label="Ubicación" />
            <Step n="3" label="Valores" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Nombre"><Input value="Casa Polanco 412" /></Field>
            <Field label="Tipo">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip active>Casa</Chip><Chip>Depto</Chip><Chip>Terreno</Chip><Chip>Local</Chip><Chip>Bodega</Chip><Chip>Otro</Chip>
              </div>
            </Field>
            <Field label="Portafolio"><Select value="Residencial CDMX" /></Field>
            <Field label="Cliente"><Select value="Familia Mendoza" /></Field>
            <Field label="Notas internas" full>
              <Textarea placeholder="Información solo visible para administradores del portafolio." />
            </Field>
            <Field label="Etiquetas" full>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip onRemove>Polanco</Chip><Chip onRemove>Residencial</Chip><Chip onRemove>Activa</Chip>
                <Chip>+ Etiqueta</Chip>
              </div>
            </Field>
          </div>
        </ModalShell>
      </Section>

      {/* Toasts + alerts + loading */}
      <Section title="Toasts · Alertas · Loading" subtitle="Para feedback en línea">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="Toasts" padding={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Toast tone="ok" title="Propiedad creada" body="Casa Polanco 412 se agregó a Residencial CDMX." action="Ver" />
              <Toast tone="warn" title="Avalúo por vencer" body="3 propiedades necesitan re-avalúo este mes." action="Revisar" />
              <Toast tone="bad" title="No pudimos guardar" body="El servidor respondió 500. Reintentamos automáticamente en 30s." action="Reintentar" />
              <Toast tone="violet" title="3 personas comentaron" body="Marcela, Andrea y Pablo M. discuten LSE-2024-018." action="Abrir hilo" />
              <Toast tone="info" title="Importación lista" body="218 propiedades fueron procesadas, 4 con advertencias." action="Ver advertencias" />
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card title="Loading · skeleton" padding={16}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            </Card>
            <Card title="Alerta · error de sistema" padding={16}>
              <div style={{
                padding: 16, border: '1px solid #FECACA', background: '#FEF2F2', borderRadius: 10,
                display: 'flex', gap: 12,
              }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: '#FEE2E2', color: '#991B1B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontWeight: 700 }}>!</span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 13px var(--font-sans)', color: '#991B1B' }}>Conexión perdida con el catastro de León</div>
                  <p style={{ margin: '2px 0 8px', fontSize: 12, color: '#991B1B', lineHeight: 1.5 }}>
                    No pudimos sincronizar los valores fiscales 2026. Los datos mostrados son del último corte exitoso.
                    <span className="mono" style={{ display: 'block', fontSize: 11, color: '#991B1B', opacity: 0.8 }}>último intento: hoy 11:42 · próximo en 5 min</span>
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="secondary" size="sm">Reintentar ahora</Btn>
                    <Btn variant="ghost" size="sm">Ver detalles</Btn>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Confirmación destructiva" padding={16}>
              <div style={{
                padding: 14, border: '1px solid var(--ink-100)', background: '#fff', borderRadius: 10,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ font: '600 14px var(--font-sans)' }}>¿Eliminar contrato LSE-2024-018?</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-600)' }}>
                  Se conservará el historial de pagos en auditoría, pero el contrato dejará de aparecer en Rentas.
                  Escribe <span className="mono" style={{ background: 'var(--ink-50)', padding: '1px 5px', borderRadius: 3, color: 'var(--ink-900)' }}>LSE-2024-018</span> para confirmar.
                </p>
                <Input placeholder="LSE-2024-018" />
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="danger" size="md" disabled>Eliminar contrato</Btn>
                  <Btn variant="secondary" size="md">Cancelar</Btn>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Success page */}
      <Section title="Éxito · página completa" subtitle="Cuando algo grande termina bien — onboarding, importación, etc.">
        <div style={{
          background: '#fff', border: '1px solid var(--ink-100)', borderRadius: 14, padding: '48px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, var(--pp-50) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <span style={{
            width: 64, height: 64, borderRadius: 999, background: '#ECFDF5', color: '#10B981',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            boxShadow: '0 0 0 6px rgba(16,185,129,0.10)',
          }}><IcCheck size={32}/></span>
          <h2 style={{ margin: '8px 0 0', font: '600 24px var(--font-sans)', letterSpacing: '-0.015em', position: 'relative' }}>
            ¡Importación completada!
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-600)', maxWidth: 500, lineHeight: 1.5, position: 'relative' }}>
            Procesamos <span className="mono num" style={{ color: 'var(--ink-900)', fontWeight: 600 }}>218 propiedades</span> de tu archivo Excel. 214 quedaron <strong>activas</strong> · 4 marcadas como <strong>en revisión</strong> porque faltó el folio catastral.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, position: 'relative' }}>
            <Btn>Ir a propiedades</Btn>
            <Btn variant="secondary">Ver advertencias (4)</Btn>
          </div>
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, subtitle, children }) => (
  <div>
    <div style={{ marginBottom: 12 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
        {title}
      </span>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 3 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const Empty = ({ icon: I, title, sub, primary, secondary, accent, tone }) => (
  <div style={{
    background: '#fff', border: '1px solid var(--ink-100)', borderRadius: 12, padding: 28,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
    position: 'relative', overflow: 'hidden',
  }}>
    {accent && (
      <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--pp-500)' }} />
    )}
    <span style={{
      width: 56, height: 56, borderRadius: 14,
      background: tone === 'warn' ? '#FFFBEB' : 'var(--pp-50)',
      color: tone === 'warn' ? '#F59E0B' : 'var(--pp-600)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <I size={26} />
      <span style={{ position: 'absolute', inset: -8, borderRadius: 18, border: `1px dashed ${tone === 'warn' ? '#FDE68A' : 'var(--pp-200)'}` }} />
    </span>
    <h3 style={{ margin: '8px 0 0', font: '600 16px var(--font-sans)', color: 'var(--ink-900)' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)', maxWidth: 280, lineHeight: 1.5 }}>{sub}</p>
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
      <Btn size="md">{primary}</Btn>
      <Btn variant="ghost" size="md">{secondary}</Btn>
    </div>
  </div>
);

const ModalShell = ({ title, sub, children }) => (
  <div style={{
    width: '100%', maxWidth: 720, margin: '0 auto',
    background: '#fff', borderRadius: 14, border: '1px solid var(--ink-100)',
    boxShadow: 'var(--shadow-lg)',
  }}>
    <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, font: '600 18px var(--font-sans)', letterSpacing: '-0.01em' }}>{title}</h2>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--ink-500)' }}>{sub}</p>
      </div>
      <Btn variant="icon"><IcX size={14}/></Btn>
    </div>
    <div style={{ padding: 20 }}>{children}</div>
    <div style={{ padding: 14, borderTop: '1px solid var(--ink-100)', background: 'var(--bg-subtle)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Btn variant="ghost" size="md">Cancelar</Btn>
      <Btn variant="secondary" size="md">Guardar borrador</Btn>
      <Btn size="md">Continuar <IcArrowR size={12}/></Btn>
    </div>
  </div>
);

const Step = ({ n, label, active }) => (
  <div style={{
    flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
    borderRadius: 8, background: active ? 'var(--pp-50)' : 'var(--bg-subtle)',
    border: active ? '1px solid var(--pp-200)' : '1px solid var(--ink-100)',
  }}>
    <span className="mono num" style={{
      width: 22, height: 22, borderRadius: 999, background: active ? 'var(--pp-500)' : 'var(--ink-200)',
      color: active ? '#fff' : 'var(--ink-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11,
    }}>{n}</span>
    <span style={{ font: `${active ? 600 : 500} 13px var(--font-sans)`, color: active ? 'var(--pp-700)' : 'var(--ink-600)' }}>{label}</span>
  </div>
);

const Toast = ({ tone, title, body, action }) => {
  const toneMap = {
    ok: { bg: '#ECFDF5', bd: '#A7F3D0', fg: '#065F46', dot: '#10B981' },
    warn: { bg: '#FFFBEB', bd: '#FDE68A', fg: '#92400E', dot: '#F59E0B' },
    bad: { bg: '#FEF2F2', bd: '#FECACA', fg: '#991B1B', dot: '#EF4444' },
    info: { bg: '#EFF6FF', bd: '#BFDBFE', fg: '#1E3A8A', dot: '#3B82F6' },
    violet: { bg: 'var(--pp-50)', bd: 'var(--pp-200)', fg: 'var(--pp-700)', dot: 'var(--pp-500)' },
  };
  const t = toneMap[tone];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
      background: '#fff', border: `1px solid ${t.bd}`, borderRadius: 10, boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: t.dot, marginTop: 6, flex: '0 0 auto', boxShadow: `0 0 0 3px ${t.dot}33` }} />
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 13px var(--font-sans)', color: 'var(--ink-900)' }}>{title}</div>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-600)' }}>{body}</p>
      </div>
      {action && <Btn variant="ghost" size="sm">{action}</Btn>}
      <Btn variant="icon" style={{ width: 22, height: 22 }}><IcX size={11}/></Btn>
    </div>
  );
};

const SkeletonRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink-100)' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ height: 10, width: '60%', borderRadius: 4, background: 'var(--ink-100)' }} />
      <span style={{ height: 8, width: '40%', borderRadius: 4, background: 'var(--ink-50)' }} />
    </div>
    <span style={{ width: 80, height: 10, borderRadius: 4, background: 'var(--ink-100)' }} />
    <span style={{ width: 40, height: 18, borderRadius: 999, background: 'var(--ink-50)' }} />
  </div>
);

Object.assign(window, { Estados, Empty, ModalShell, Step, Toast, SkeletonRow });
