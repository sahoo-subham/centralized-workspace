
export default function StatCard({ icon, label, value, color, loading }) {

  const colors = {
    indigo: {
      bg:     'rgba(99,102,241,0.1)',
      border: 'rgba(99,102,241,0.2)',
      icon:   'rgba(99,102,241,0.2)',
      text:   '#a5b4fc',
      glow:   'rgba(99,102,241,0.15)',
    },
    emerald: {
      bg:     'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.2)',
      icon:   'rgba(16,185,129,0.2)',
      text:   '#6ee7b7',
      glow:   'rgba(16,185,129,0.15)',
    },
    amber: {
      bg:     'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.2)',
      icon:   'rgba(245,158,11,0.2)',
      text:   '#fcd34d',
      glow:   'rgba(245,158,11,0.15)',
    },
    rose: {
      bg:     'rgba(244,63,94,0.1)',
      border: 'rgba(244,63,94,0.2)',
      icon:   'rgba(244,63,94,0.2)',
      text:   '#fda4af',
      glow:   'rgba(244,63,94,0.15)',
    },
  }[color] || colors?.indigo

  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(17,21,36,0.6) 100%)`,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '24px',
      display: 'flex', alignItems: 'center', gap: '18px',
      boxShadow: `0 4px 24px ${colors.glow}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 32px ${colors.glow}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 4px 24px ${colors.glow}`
      }}
    >
      {/* Icon box */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: colors.icon,
        border: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', flexShrink: 0,
      }}>{icon}</div>

      {/* Text */}
      <div>
        <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          {label}
        </p>
        {loading ? (
          <div style={{ width: '48px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', marginTop: '6px', animation: 'pulse 1.5s ease infinite' }} />
        ) : (
          <p style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '800', margin: '4px 0 0', lineHeight: 1 }}>
            {value ?? '—'}
          </p>
        )}
      </div>
    </div>
  )
}