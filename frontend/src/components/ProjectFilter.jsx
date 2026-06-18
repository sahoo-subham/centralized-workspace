import { useState } from 'react'

const STATUS_FILTERS = [
  { value: '', label: 'All Status', icon: '🗂️' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'active', label: 'Active', icon: '🟢' },
  { value: 'completed', label: 'Completed', icon: '✅' },
  { value: 'on_hold', label: 'On Hold', icon: '⏸️' },
]

function ProjectFilter({ statusFilter, onFilterChange }) {
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredStatuses = STATUS_FILTERS.filter((status) =>
    status.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedStatusObj = STATUS_FILTERS.find(
    (s) => s.value === statusFilter
  )

  const inputStyle = {
    width: '100%',
    background: '#232938',
    border: '1px solid #3f4659',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    padding: '13px 16px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const statusIconStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    flexShrink: 0,
  }

  return (
    <div style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
      <label
        style={{
          color: '#94a3b8',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'block',
          marginBottom: '10px',
        }}
      >
        Filter by Status
      </label>

      <div
        onClick={() => setDropdownOpen(true)}
        style={{
          ...inputStyle,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          borderColor: dropdownOpen ? '#6366f1' : '#3f4659',
        }}
      >
        {selectedStatusObj && !dropdownOpen ? (
          <>
            <div style={statusIconStyle}>
              {selectedStatusObj.icon}
            </div>
            <span style={{ color: '#fff', flex: 1 }}>
              {selectedStatusObj.label}
            </span>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
          </>
        ) : !dropdownOpen && !statusFilter ? (
          <>
            <span style={{ color: '#6b7280' }}>📊</span>
            <span style={{ color: '#9ca3af', flex: 1 }}>
              All Status
            </span>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
          </>
        ) : (
          <>
            <span style={{ color: '#6b7280' }}>🔍</span>
            <input
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setDropdownOpen(true)
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search status..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </>
        )}
      </div>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 61,
              background: '#1f2433',
              border: '1px solid #3f4659',
              borderRadius: '14px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '6px',
            }}
          >
            {filteredStatuses.length === 0 ? (
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                  padding: '14px',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                No status found.
              </p>
            ) : (
              filteredStatuses.map((status) => (
                <div
                  key={status.value}
                  onClick={() => {
                    onFilterChange(status.value)
                    setSearch('')
                    setDropdownOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background:
                      statusFilter === status.value
                        ? 'rgba(99,102,241,0.15)'
                        : 'transparent',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(99,102,241,0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      statusFilter === status.value
                        ? 'rgba(99,102,241,0.15)'
                        : 'transparent')
                  }
                >
                  <div style={statusIconStyle}>
                    {status.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: '#e5e7eb',
                        fontSize: '13px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      {status.label}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectFilter