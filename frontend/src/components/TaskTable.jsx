// components/TaskTable.jsx
// Desktop → table view
// Mobile  → card view (responsive)
// Columns: Task | Project | Assigned To | Status | Priority | Due Date | Actions

import { useState, useEffect } from 'react'
import api from '../services/api'

const STATUS_STYLES = {
  pending:     { bg: 'rgba(156,163,175,0.15)', text: '#d1d5db', label: 'Pending' },
  in_progress: { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc', label: 'In Progress' },
  completed:   { bg: 'rgba(34,197,94,0.15)',   text: '#86efac', label: 'Completed' },
}

const PRIORITY_STYLES = {
  low:    { bg: 'rgba(34,197,94,0.15)',  text: '#86efac', label: 'Low' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d', label: 'Medium' },
  high:   { bg: 'rgba(239,68,68,0.15)',  text: '#fca5a5', label: 'High' },
}

export default function TaskTable({ tasks, onDelete, onRefresh, canEdit, canDelete }) {

  const [viewTask, setViewTask] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* ── DESKTOP TABLE ───────────────────────────────── */}
      {!isMobile && (
      <div style={{
        background: '#1a1f2e', border: '1px solid #2d3348',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
              <th style={thStyle}>Task</th>
              <th style={thStyle}>Project</th>
              <th style={thStyle}>Assigned To</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Priority</th>
              <th style={thStyle}>Due Date</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              const statusStyle   = STATUS_STYLES[task.status] || STATUS_STYLES.pending
              const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
              return (
                <tr key={task.id}
                  style={{ borderTop: i === 0 ? 'none' : '1px solid #2d3348', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✅</div>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{task.project_detail?.title || '—'}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{task.assigned_to_detail?.name || 'Unassigned'}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ background: statusStyle.bg, color: statusStyle.text, fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ background: priorityStyle.bg, color: priorityStyle.text, fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {priorityStyle.label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>{task.due_date || '—'}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => setViewTask(task)} style={btnStyle('#4f46e5', '#fff')}
                        onMouseEnter={e => e.currentTarget.style.background = '#4338ca'} onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                      >View</button>
                      {canEdit && (
                        <button onClick={() => setEditTask(task)} style={btnStyle('#2d3348', '#cbd5e1')}
                          onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                        >Edit</button>
                      )}
                      {canDelete && (
                        <button onClick={() => onDelete(task.id)} style={btnStyle('#2d3348', '#f87171')}
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

      {/* ── MOBILE CARDS ────────────────────────────────── */}
      {isMobile && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => {
          const statusStyle   = STATUS_STYLES[task.status] || STATUS_STYLES.pending
          const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
          return (
            <div key={task.id} style={{
              background: '#1a1f2e', border: '1px solid #2d3348',
              borderRadius: '14px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>✅</div>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
                </div>
                <span style={{ background: statusStyle.bg, color: statusStyle.text, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {statusStyle.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af' }}>
                <span>📁 {task.project_detail?.title || '—'}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af' }}>
                <span>👤 {task.assigned_to_detail?.name || 'Unassigned'}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: priorityStyle.bg, color: priorityStyle.text, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' }}>
                  {priorityStyle.label} priority
                </span>
                {task.due_date && <span style={{ color: '#94a3b8', fontSize: '11px' }}>📅 {task.due_date}</span>}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={() => setViewTask(task)} style={{ ...btnStyle('#4f46e5', '#fff'), flex: 1 }}>View</button>
                {canEdit && <button onClick={() => setEditTask(task)} style={{ ...btnStyle('#2d3348', '#cbd5e1'), flex: 1 }}>Edit</button>}
                {canDelete && <button onClick={() => onDelete(task.id)} style={{ ...btnStyle('#2d3348', '#f87171'), flex: 1 }}>Delete</button>}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* ── VIEW MODAL ───────────────────────────────────── */}
      {viewTask && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={iconBoxStyle}>✅</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {viewTask.title}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    {viewTask.description || 'No description'}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewTask(null)} style={closeBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
              >✕</button>
            </div>

            <div style={{ padding: '28px 32px' }}>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {(() => {
                  const s = STATUS_STYLES[viewTask.status] || STATUS_STYLES.pending
                  return <span style={{ background: s.bg, color: s.text, fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '999px' }}>{s.label}</span>
                })()}
                {(() => {
                  const p = PRIORITY_STYLES[viewTask.priority] || PRIORITY_STYLES.medium
                  return <span style={{ background: p.bg, color: p.text, fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '999px' }}>{p.label} Priority</span>
                })()}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={avatarStyle}>📁</div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Project</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>{viewTask.project_detail?.title || '—'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={avatarStyle}>{viewTask.assigned_to_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Assigned to</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>{viewTask.assigned_to_detail?.name || 'Unassigned'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={avatarStyle}>{viewTask.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Created by</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>{viewTask.created_by_detail?.name || 'Unknown'}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #2d3348', marginBottom: '20px' }} />

              <div>
                <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Due Date</p>
                <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: '4px 0 0' }}>{viewTask.due_date || '—'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #2d3348' }}>
                <button onClick={() => setViewTask(null)}
                  style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 24px', borderRadius: '12px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ───────────────────────────────────── */}
      {editTask && (
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onSaved={() => { setEditTask(null); onRefresh() }} />
      )}
    </>
  )
}

function EditTaskModal({ task, onClose, onSaved }) {
  const [title, setTitle]             = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus]           = useState(task.status)
  const [priority, setPriority]       = useState(task.priority)
  const [dueDate, setDueDate]         = useState(task.due_date || '')
  const [users, setUsers]             = useState([])
  const [assignedTo, setAssignedTo]   = useState(task.assigned_to || '')
  const [saving, setSaving]           = useState(false)

  useEffect(() => {
    api.get('/users/').then(res => setUsers(res.data?.results ?? [])).catch(console.error)
  }, [])

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await api.put(`/tasks/${task.id}/`, {
        title, description,
        project: task.project,
        assigned_to: assignedTo || null,
        created_by: task.created_by,
        status, priority,
        due_date: dueDate || null,
      })
      onSaved()
    } catch (err) {
      console.error('Failed to update task', err)
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
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Edit Task</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Update task details.</p>
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
              <label style={labelStyle}>Assigned To</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
            </div>
          </div>

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

const thStyle = { textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }
const tdStyle = { padding: '16px 20px', fontSize: '14px' }
const btnStyle = (bg, color) => ({ background: bg, border: 'none', color, fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' })
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '16px' }
const modalStyle = { width: '100%', maxWidth: '560px', borderRadius: '24px', border: '1px solid #2d3348', background: '#1a1f2e', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden', maxHeight: '85vh', overflowY: 'auto' }
const headerStyle = { background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)', borderBottom: '1px solid #2d3348', padding: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }
const iconBoxStyle = { width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }
const closeBtnStyle = { width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const avatarStyle = { width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', flexShrink: 0 }
const labelStyle = { color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }