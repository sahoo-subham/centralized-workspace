function DocumentFilter({
  projects,
  docTypes,
  searchFilter,
  projectFilter,
  typeFilter,
  onSearchChange,
  onProjectChange,
  onTypeChange,
  onClear,
}) {

  const selectStyle = {
    background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '11px 16px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
  }

  const labelStyle = {
    color: '#94a3b8', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  const anyActive = searchFilter || projectFilter || typeFilter

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Search</label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#232938', border: '1px solid #3f4659',
          borderRadius: '12px', padding: '11px 16px', minWidth: '200px',
        }}>
          <span style={{ color: '#6b7280' }}>🔍</span>
          <input
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'inherit', flex: 1 }}
          />
          {searchFilter && (
            <button onClick={() => onSearchChange('')}
              style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', padding: 0 }}
            >✕</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Filter by Project</label>
        <select value={projectFilter} onChange={(e) => onProjectChange(e.target.value)}
          style={{ ...selectStyle, minWidth: '180px' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
          <option value="">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Filter by Type</label>
        <select value={typeFilter} onChange={(e) => onTypeChange(e.target.value)}
          style={{ ...selectStyle, minWidth: '180px' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
          <option value="">All Types</option>
          {docTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {anyActive && (
        <button onClick={onClear}
          style={{
            background: 'transparent', border: '1px solid #3f4659',
            color: '#94a3b8', fontSize: '13px', fontWeight: '500',
            padding: '11px 16px', borderRadius: '12px', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f4659'; e.currentTarget.style.color = '#94a3b8' }}
        >✕ Clear</button>
      )}

    </div>
  )
}

export default DocumentFilter;