import { useState, useEffect } from 'react'
import api from '../services/api'

const STATUS_STYLES = {
  pending:   { bg: 'rgba(156,163,175,0.15)', text: '#d1d5db', label: 'Pending' },
  active:    { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc', label: 'Active' },
  completed: { bg: 'rgba(34,197,94,0.15)',   text: '#86efac', label: 'Completed' },
  on_hold:   { bg: 'rgba(239,68,68,0.15)',   text: '#fca5a5', label: 'On Hold' },
}

export default function ProjectTable({ projects, onDelete, onRefresh, canEdit, canDelete }) {

  const [viewProject, setViewProject] = useState(null)
  const [editProject, setEditProject] = useState(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {!isMobile && (
      <div style={{
        background: '#1a1f2e',
        border: '1px solid #2d3348',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
              <th style={thStyle}>Project Title</th>
              <th style={thStyle}>Team</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              <th style={thStyle}>Dates</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => {
              const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.pending
              return (
                <tr
                  key={project.id}
                  style={{ borderTop: i === 0 ? 'none' : '1px solid #2d3348', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'rgba(99,102,241,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                      }}>📁</div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                          {project.title}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                          {project.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                      {project.team_detail?.team_name || '—'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{
                      background: statusStyle.bg, color: statusStyle.text,
                      fontSize: '11px', fontWeight: '700',
                      padding: '4px 12px', borderRadius: '999px',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>{statusStyle.label}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#9ca3af', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {project.start_date && <span>📅 {project.start_date}</span>}
                      {project.end_date   && <span>🏁 {project.end_date}</span>}
                      {!project.start_date && !project.end_date && <span style={{ color: '#4b5563' }}>—</span>}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => setViewProject(project)} style={btnStyle('#4f46e5', '#fff')}
                        onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
                        onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                      >View</button>

                      {canEdit && (
                        <button onClick={() => setEditProject(project)} style={btnStyle('#2d3348', '#cbd5e1')}
                          onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                          onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                        >Edit</button>
                      )}

                      {canDelete && (
                        <button onClick={() => onDelete(project.id)} style={btnStyle('#2d3348', '#f87171')}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#2d3348'; e.currentTarget.style.color = '#f87171' }}
                        >Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      )}

      {isMobile && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projects.map((project) => {
          const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.pending
          return (
            <div key={project.id} style={{
              background: '#1a1f2e', border: '1px solid #2d3348',
              borderRadius: '14px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📁</div>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title}</span>
                </div>
                <span style={{
                  background: statusStyle.bg, color: statusStyle.text,
                  fontSize: '11px', fontWeight: '700',
                  padding: '4px 10px', borderRadius: '999px',
                  textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px',
                }}>{statusStyle.label}</span>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                {project.description || <span style={{ color: '#4b5563', fontStyle: 'italic' }}>No description</span>}
              </p>

              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af' }}>
                <span>👥 {project.team_detail?.team_name || '—'}</span>
              </div>

              {(project.start_date || project.end_date) && (
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                  {project.start_date && <span>📅 {project.start_date}</span>}
                  {project.end_date   && <span>🏁 {project.end_date}</span>}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={() => setViewProject(project)} style={{ ...btnStyle('#4f46e5', '#fff'), flex: 1 }}>View</button>
                {canEdit && <button onClick={() => setEditProject(project)} style={{ ...btnStyle('#2d3348', '#cbd5e1'), flex: 1 }}>Edit</button>}
                {canDelete && <button onClick={() => onDelete(project.id)} style={{ ...btnStyle('#2d3348', '#f87171'), flex: 1 }}>Delete</button>}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {viewProject && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={iconBoxStyle}>📁</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {viewProject.title}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    {viewProject.description || 'No description'}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewProject(null)} style={closeBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
              >✕</button>
            </div>

            <div style={{ padding: '28px 32px' }}>

              <div style={{ marginBottom: '20px' }}>
                {(() => {
                  const s = STATUS_STYLES[viewProject.status] || STATUS_STYLES.pending
                  return (
                    <span style={{
                      background: s.bg, color: s.text,
                      fontSize: '12px', fontWeight: '700',
                      padding: '6px 16px', borderRadius: '999px',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{s.label}</span>
                  )
                })()}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={avatarStyle}>👥</div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Team</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                    {viewProject.team_detail?.team_name || 'No team'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={avatarStyle}>
                  {viewProject.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Created by</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>
                    {viewProject.created_by_detail?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #2d3348', marginBottom: '20px' }} />

              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Start Date</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: '4px 0 0' }}>
                    {viewProject.start_date || '—'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>End Date</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: '4px 0 0' }}>
                    {viewProject.end_date || '—'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #2d3348' }}>
                <button
                  onClick={() => setViewProject(null)}
                  style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 24px', borderRadius: '12px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSaved={() => { setEditProject(null); onRefresh() }}
        />
      )}
    </>
  )
}

function EditProjectModal({ project, onClose, onSaved }) {
  const [title, setTitle]             = useState(project.title)
  const [description, setDescription] = useState(project.description || '')
  const [status, setStatus]           = useState(project.status)
  const [startDate, setStartDate]     = useState(project.start_date || '')
  const [endDate, setEndDate]         = useState(project.end_date || '')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.put(`/projects/${project.id}/`, {
        title,
        description,
        team: project.team,
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: project.created_by,
      })
      onSaved()
    } catch (err) {
      const apiError = err.response?.data?.end_date?.[0]
      setError(apiError || 'Failed to update project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '12px 14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: '520px' }}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={iconBoxStyle}>✏️</div>
            <div>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Edit Project</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Update project details.</p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
          >✕</button>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          {error && (
            <div style={{ marginBottom: '20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#fca5a5', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #2d3348' }}>
            <button onClick={onClose}
              style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
            >Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ background: saving ? '#4338ca' : '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 24px', borderRadius: '12px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#4338ca' }} onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#4f46e5' }}
            >{saving ? 'Saving...' : 'Save Changes →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const thStyle = {
  textAlign: 'left', padding: '16px 20px',
  color: '#94a3b8', fontSize: '11px', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.08em',
}
const tdStyle = { padding: '16px 20px', fontSize: '14px' }
const btnStyle = (bg, color) => ({
  background: bg, border: 'none', color,
  fontSize: '12px', fontWeight: '600',
  padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
  transition: 'all 0.15s', whiteSpace: 'nowrap',
})
const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '16px',
}
const modalStyle = {
  width: '100%', maxWidth: '560px', borderRadius: '24px',
  border: '1px solid #2d3348', background: '#1a1f2e',
  boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden',
  maxHeight: '85vh', overflowY: 'auto',
}
const headerStyle = {
  background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)',
  borderBottom: '1px solid #2d3348', padding: '24px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
}
const iconBoxStyle = {
  width: '52px', height: '52px', borderRadius: '16px',
  background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
}
const closeBtnStyle = {
  width: '36px', height: '36px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)', border: 'none',
  color: '#94a3b8', fontSize: '16px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const avatarStyle = {
  width: '28px', height: '28px', borderRadius: '50%',
  background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#a5b4fc', fontSize: '11px', fontWeight: '700', flexShrink: 0,
}
const labelStyle = {
  color: '#94a3b8', fontSize: '11px', fontWeight: '600',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  display: 'block', marginBottom: '10px',
}