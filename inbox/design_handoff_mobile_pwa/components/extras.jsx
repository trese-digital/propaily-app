// Extras — shared helpers used across the new modules.
// Loaded after icons / ui-kit / app-chrome. All consume tokens.

const Avatar = ({ name = '', size = 28, tone = 'violet', src }) => {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const palettes = {
    violet:  ['var(--pp-300)', 'var(--pp-700)'],
    ok:      ['#A7F3D0', '#065F46'],
    warn:    ['#FCD34D', '#92400E'],
    bad:     ['#FCA5A5', '#991B1B'],
    info:    ['#93C5FD', '#1E3A8A'],
    neutral: ['var(--ink-200)', 'var(--ink-700)'],
  };
  const [a, b] = palettes[tone] || palettes.violet;
  return (
    <span style={{
      width: size, height: size, borderRadius: 999, flex: '0 0 auto',
      background: `linear-gradient(135deg, ${a}, ${b})`,
      color: '#fff', font: `600 ${Math.max(10, size * 0.38)}px var(--font-sans)`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      textShadow: '0 1px 1px rgba(0,0,0,0.1)',
    }}>{src ? <img src={src} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} /> : initials}</span>
  );
};

// Compact progress bar with label.
const Progress = ({ value = 0, tone = 'violet', height = 6, label, right }) => {
  const colors = {
    violet: 'var(--pp-500)', ok: '#10B981', warn: '#F59E0B', bad: '#EF4444', info: '#3B82F6',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(label || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && <span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>{label}</span>}
          {right && <span className="mono num" style={{ fontSize: 11, color: 'var(--ink-700)', fontWeight: 500 }}>{right}</span>}
        </div>
      )}
      <div style={{ height, borderRadius: 999, background: 'var(--ink-100)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%', background: colors[tone], borderRadius: 999 }} />
      </div>
    </div>
  );
};

// Card wrapper used by most module screens.
const Card = ({ title, subtitle, action, padding = 0, style = {}, children, accent }) => (
  <div style={{
    border: '1px solid var(--ink-100)', borderRadius: 12, background: '#fff',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: 'var(--shadow-xs)', ...style,
  }}>
    {(title || subtitle || action) && (
      <div style={{
        padding: '14px 16px 10px', display: 'flex', alignItems: 'flex-start', gap: 12,
        borderBottom: '1px solid var(--ink-100)',
        background: accent ? 'linear-gradient(180deg, var(--pp-50) 0%, transparent 100%)' : undefined,
      }}>
        <div style={{ flex: 1 }}>
          {title && <div style={{ font: '600 14px var(--font-sans)', color: 'var(--ink-900)', letterSpacing: '-0.005em' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding, flex: 1, minHeight: 0 }}>
      {children}
    </div>
  </div>
);

// Tabs row used across module screens.
const Tabs = ({ items = [], active }) => (
  <div style={{ display: 'flex', gap: 22, borderBottom: '1px solid var(--ink-100)', padding: '0 24px' }}>
    {items.map(([id, label, count]) => {
      const on = id === active;
      return (
        <div key={id} style={{
          padding: '14px 0', position: 'relative', cursor: 'pointer',
          color: on ? 'var(--ink-900)' : 'var(--ink-500)',
          font: `${on ? 600 : 500} 13px var(--font-sans)`, letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {label}
          {count !== undefined && (
            <span className="mono num" style={{
              padding: '1px 6px', borderRadius: 999, fontSize: 10,
              background: on ? 'var(--pp-50)' : 'var(--ink-50)',
              color: on ? 'var(--pp-700)' : 'var(--ink-500)',
              border: on ? '1px solid var(--pp-100)' : '1px solid var(--ink-100)',
            }}>{count}</span>
          )}
          {on && <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--pp-500)', borderRadius: 2 }} />}
        </div>
      );
    })}
  </div>
);

// Inline KPI strip cell (smaller than Dashboard's Kpi).
const KpiInline = ({ label, value, delta, deltaTone = 'ok', mono = true }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>{label}</span>
    <span className={mono ? 'mono num' : 'num'} style={{ font: '600 20px var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--ink-900)' }}>{value}</span>
    {delta && <Badge tone={deltaTone}>{delta}</Badge>}
  </div>
);

// Status dot — small colored circle used in lists/tables.
const Dot = ({ tone = 'violet', size = 8, ring = false }) => {
  const colors = {
    violet: 'var(--pp-500)', ok: '#10B981', warn: '#F59E0B', bad: '#EF4444', info: '#3B82F6',
    neutral: 'var(--ink-400)',
  };
  return (
    <span style={{
      width: size, height: size, borderRadius: 999, background: colors[tone], display: 'inline-block',
      flex: '0 0 auto',
      boxShadow: ring ? `0 0 0 3px ${colors[tone]}25` : 'none',
    }} />
  );
};

// Small currency formatter.
const fmtMxn = (n) => '$' + n.toLocaleString('es-MX', { maximumFractionDigits: 0 });

Object.assign(window, { Avatar, Progress, Card, Tabs, KpiInline, Dot, fmtMxn });
