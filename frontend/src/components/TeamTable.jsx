import { useState, useEffect } from 'react'
import api from '../services/api'
import AddMemberForm from './AddMemberForm'

export default function TeamTable({ teams, onDelete, onRefresh, canEdit, canDelete }) {

  const [viewTeam, setViewTeam]       = useState(null)
  const [editTeam, setEditTeam]       = useState(null)
  const [addMemberTeam, setAddMemberTeam] = useState(null)
  const [removingId, setRemovingId]   = useState(null)
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (viewTeam) {
      const fresh = teams.find((t) => t.id === viewTeam.id)
      if (fresh) setViewTeam(fresh)
    }
  }, [teams])

  const handleRemoveMember = async (memberRowId) => {
    if (!window.confirm('Remove this member from the team?')) return
    setRemovingId(memberRowId)
    try {
      await api.delete(`/team-members/${memberRowId}/`)
      onRefresh()
    } catch (err) {
      console.error('Failed to remove member', err)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <>
      {!isMobile && (
        <div style={{
          background: '#1a1f2e', border: '1px solid #2d3348',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
                <th style={thStyle}>Team Name</th>
                <th style={thStyle}>Description</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Members</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id}
                  style={{ borderTop: i === 0 ? 'none' : '1px solid #2d3348', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📁</div>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{team.team_name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{team.description || <span style={{ color: '#4b5563', fontStyle: 'italic' }}>No description</span>}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={memberBadgeStyle}>👥 {team.members?.length ?? 0}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => setViewTeam(team)} style={btnStyle('#4f46e5', '#fff')}
                        onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
                        onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                      >View</button>

                      {canEdit && (
                        <button onClick={() => setAddMemberTeam(team)} style={btnStyle('#2d3348', '#a5b4fc')}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                        >+ Member</button>
                      )}

                      {canEdit && (
                        <button onClick={() => setEditTeam(team)} style={btnStyle('#2d3348', '#cbd5e1')}
                          onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                          onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                        >Edit</button>
                      )}

                      {canDelete && (
                        <button onClick={() => onDelete(team.id)} style={btnStyle('#2d3348', '#f87171')}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#2d3348'; e.currentTarget.style.color = '#f87171' }}
                        >Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teams.map((team) => (
            <div key={team.id} style={{
              background: '#1a1f2e', border: '1px solid #2d3348',
              borderRadius: '14px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📁</div>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{team.team_name}</span>
                </div>
                <span style={memberBadgeStyle}>👥 {team.members?.length ?? 0}</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{team.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setViewTeam(team)} style={{ ...btnStyle('#4f46e5', '#fff'), flex: 1 }}>View</button>
                {canEdit && <button onClick={() => setAddMemberTeam(team)} style={{ ...btnStyle('#2d3348', '#a5b4fc'), flex: 1 }}>+ Member</button>}
                {canEdit && <button onClick={() => setEditTeam(team)} style={{ ...btnStyle('#2d3348', '#cbd5e1'), flex: 1 }}>Edit</button>}
                {canDelete && <button onClick={() => onDelete(team.id)} style={{ ...btnStyle('#2d3348', '#f87171'), flex: 1 }}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewTeam && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div style={iconBoxStyle}>👥</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {viewTeam.team_name}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{viewTeam.description || 'No description'}</p>
                </div>
              </div>
              <button onClick={() => setViewTeam(null)} style={closeBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
              >✕</button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={avatarStyle}>{viewTeam.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Created by</p>
                  <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>{viewTeam.created_by_detail?.name || 'Unknown'}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #2d3348', marginBottom: '20px' }} />

              <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Members ({viewTeam.members?.length ?? 0})
              </p>

              {viewTeam.members?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {viewTeam.members.map((m, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
                      borderRadius: '10px', padding: '10px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={avatarStyle}>{m.user_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.user_detail?.name || 'Unknown'}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.user_detail?.email}
                          </p>
                        </div>
                      </div>
                      {m.role && (
                        <span style={{
                          background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                          fontSize: '11px', fontWeight: '600',
                          padding: '3px 10px', borderRadius: '999px',
                          whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px',
                        }}>{m.role}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '13px' }}>No members yet.</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #2d3348' }}>
                <button onClick={() => setViewTeam(null)}
                  style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 24px', borderRadius: '12px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTeam && (
        <EditTeamModal
          team={editTeam}
          onClose={() => { setEditTeam(null); onRefresh() }}
          onSaved={() => { setEditTeam(null); onRefresh() }}
        />
      )}

      {addMemberTeam && (
        <AddMemberForm
          team={addMemberTeam}
          onAdded={() => { setAddMemberTeam(null); onRefresh() }}
          onCancel={() => setAddMemberTeam(null)}
        />
      )}
    </>
  )
}

function EditTeamModal({ team, onClose, onSaved }) {
  const [teamName, setTeamName] = useState(team.team_name)
  const [teamDesc, setTeamDesc] = useState(team.description || '')
  const [saving, setSaving]     = useState(false)

  const [members, setMembers]   = useState(team.members || [])
  const [roleDrafts, setRoleDrafts] = useState(
    Object.fromEntries((team.members || []).map((m) => [m.id, m.role || '']))
  )
  const [removingId, setRemovingId] = useState(null)

  const handleRemoveMember = async (memberRowId) => {
    if (!window.confirm('Remove this member from the team?')) return
    setRemovingId(memberRowId)
    try {
      await api.delete(`/team-members/${memberRowId}/`)
      setMembers((prev) => prev.filter((m) => m.id !== memberRowId))
    } catch (err) {
      console.error('Failed to remove member', err)
      alert('Could not remove this member. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  const handleSaveAll = async () => {
    if (!teamName.trim()) return
    setSaving(true)
    try {
      await api.put(`/teams/${team.id}`, {
        team_name: teamName,
        description: teamDesc,
        created_by: team.created_by,
      })

      const roleUpdates = members
        .filter((m) => roleDrafts[m.id] !== m.role)
        .map((m) =>
          api.put(`/team-members/${m.id}/`, {
            team: team.id,
            user: m.user,
            role: roleDrafts[m.id],
          })
        )
      await Promise.all(roleUpdates)

      onSaved()
    } catch (err) {
      console.error('Failed to save team changes', err)
      alert('Something went wrong while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '12px 14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const roleInputStyle = {
    flex: 1, background: '#1c2130', border: '1px solid #2d3348',
    borderRadius: '8px', color: '#e5e7eb', fontSize: '12px',
    padding: '6px 10px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: '860px' }}>

        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={iconBoxStyle}>✏️</div>
            <div>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Edit Team</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                Manage members on the left, update team details on the right.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={closeBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
          >✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '360px' }}>

          <div style={{
            padding: '24px', borderRight: '1px solid #2d3348',
            maxHeight: '460px', overflowY: 'auto',
          }}>
            <p style={labelStyle}>Members ({members.length})</p>

            {members.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '12px' }}>No members yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {members.map((m) => (
                  <div key={m.id} style={{
                    background: 'rgba(99,102,241,0.07)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '12px', padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={avatarStyle}>
                        {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.user_detail?.name || 'Unknown'}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.user_detail?.email}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        value={roleDrafts[m.id] ?? ''}
                        onChange={(e) => setRoleDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                        placeholder="Role"
                        style={roleInputStyle}
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#2d3348'}
                      />
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={removingId === m.id}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: '#f87171', fontSize: '11px', fontWeight: '600',
                          padding: '6px 12px', borderRadius: '8px',
                          cursor: removingId === m.id ? 'not-allowed' : 'pointer',
                          opacity: removingId === m.id ? 0.6 : 1,
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { if (removingId !== m.id) e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        {removingId === m.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Team Name</label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} rows={5}
                  style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', marginTop: '20px', borderTop: '1px solid #2d3348' }}>
              <button onClick={onClose}
                style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
              >Close</button>
              <button onClick={handleSaveAll} disabled={saving}
                style={{ background: saving ? '#4338ca' : '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 24px', borderRadius: '12px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#4338ca' }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#4f46e5' }}
              >{saving ? 'Saving...' : 'Save All Changes →'}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const thStyle = { textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }
const tdStyle = { padding: '16px 20px', fontSize: '14px' }
const btnStyle = (bg, color) => ({ background: bg, border: 'none', color, fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' })
const memberBadgeStyle = { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '16px' }
const modalStyle = { width: '100%', maxWidth: '560px', borderRadius: '24px', border: '1px solid #2d3348', background: '#1a1f2e', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }
const headerStyle = { background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)', borderBottom: '1px solid #2d3348', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }
const iconBoxStyle = { width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }
const closeBtnStyle = { width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const avatarStyle = { width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', flexShrink: 0 }
const labelStyle = { color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0px' }