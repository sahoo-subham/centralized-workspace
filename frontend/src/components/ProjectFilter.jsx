const STATUS_FILTERS = [
  { value: '',          label: 'All Status' },
  { value: 'pending',   label: 'Pending' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold',   label: 'On Hold' },
]

export default function ProjectFilter({ teams, statusFilter, teamFilter, onStatusChange, onTeamChange, onClear }) {

  const selectStyle = {
    background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '12px 16px', outline: 'none', cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    color: '#94a3b8', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{ ...selectStyle, minWidth: '180px' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Filter by Team</label>
        <select
          value={teamFilter}
          onChange={(e) => onTeamChange(e.target.value)}
          style={{ ...selectStyle, minWidth: '200px' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        >
          <option value="">All Teams</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.team_name}</option>
          ))}
        </select>
      </div>

      {(statusFilter || teamFilter) && (
        <button
          onClick={onClear}
          style={{
            background: 'transparent', border: '1px solid #3f4659',
            color: '#94a3b8', fontSize: '13px', fontWeight: '500',
            padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
            marginBottom: '0px',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f4659'; e.currentTarget.style.color = '#94a3b8' }}
        >✕ Clear filters</button>
      )}

    </div>
  )
}