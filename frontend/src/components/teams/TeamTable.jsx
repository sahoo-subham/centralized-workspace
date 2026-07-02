// import { useState, useEffect } from 'react'
// import api from '../../services/api'
// import AddMemberForm from './AddMemberForm'

// export default function TeamTable({ teams, onDelete, onRefresh, canEdit, canDelete }) {

//   const [viewTeam, setViewTeam]       = useState(null)
//   const [editTeam, setEditTeam]       = useState(null)
//   const [addMemberTeam, setAddMemberTeam] = useState(null)
//   const [removingId, setRemovingId]   = useState(null)
//   const [isMobile, setIsMobile]       = useState(window.innerWidth < 768)

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   useEffect(() => {
//     if (viewTeam) {
//       const fresh = teams.find((t) => t.id === viewTeam.id)
//       if (fresh) setViewTeam(fresh)
//     }
//   }, [teams])

//   const handleRemoveMember = async (memberRowId) => {
//     if (!window.confirm('Remove this member from the team?')) return
//     setRemovingId(memberRowId)
//     try {
//       await api.delete(`/team-members/${memberRowId}/`)
//       onRefresh()
//     } catch (err) {
//       console.error('Failed to remove member', err)
//     } finally {
//       setRemovingId(null)
//     }
//   }

//   return (
//     <>
//       {!isMobile && (
//         <div style={{
//           background: '#1a1f2e', border: '1px solid #2d3348',
//           borderRadius: '16px', overflow: 'hidden',
//           boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
//         }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
//                 <th style={thStyle}>Team Name</th>
//                 <th style={thStyle}>Description</th>
//                 <th style={{ ...thStyle, textAlign: 'center' }}>Members</th>
//                 <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teams.map((team, i) => (
//                 <tr key={team.id}
//                   style={{ borderTop: i === 0 ? 'none' : '1px solid #2d3348', transition: 'background 0.15s' }}
//                   onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
//                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                 >
//                   <td style={tdStyle}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                       <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📁</div>
//                       <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{team.team_name}</span>
//                     </div>
//                   </td>
//                   <td style={tdStyle}>
//                     <span style={{ color: '#9ca3af', fontSize: '13px' }}>{team.description || <span style={{ color: '#4b5563', fontStyle: 'italic' }}>No description</span>}</span>
//                   </td>
//                   <td style={{ ...tdStyle, textAlign: 'center' }}>
//                     <span style={memberBadgeStyle}>👥 {team.members?.length ?? 0}</span>
//                   </td>
//                   <td style={{ ...tdStyle, textAlign: 'right' }}>
//                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
//                       <button onClick={() => setViewTeam(team)} style={btnStyle('#4f46e5', '#fff')}
//                         onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
//                         onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
//                       >View</button>

//                       {canEdit && (
//                         <button onClick={() => setAddMemberTeam(team)} style={btnStyle('#2d3348', '#a5b4fc')}
//                           onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
//                           onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//                         >+ Member</button>
//                       )}

//                       {canEdit && (
//                         <button onClick={() => setEditTeam(team)} style={btnStyle('#2d3348', '#cbd5e1')}
//                           onMouseEnter={e => e.currentTarget.style.background = '#374151'}
//                           onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//                         >Edit</button>
//                       )}

//                       {canDelete && (
//                         <button onClick={() => onDelete(team.id)} style={btnStyle('#2d3348', '#f87171')}
//                           onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5' }}
//                           onMouseLeave={e => { e.currentTarget.style.background = '#2d3348'; e.currentTarget.style.color = '#f87171' }}
//                         >Delete</button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {isMobile && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {teams.map((team) => (
//             <div key={team.id} style={{
//               background: '#1a1f2e', border: '1px solid #2d3348',
//               borderRadius: '14px', padding: '16px',
//               display: 'flex', flexDirection: 'column', gap: '10px',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📁</div>
//                   <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{team.team_name}</span>
//                 </div>
//                 <span style={memberBadgeStyle}>👥 {team.members?.length ?? 0}</span>
//               </div>
//               <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{team.description || 'No description'}</p>
//               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                 <button onClick={() => setViewTeam(team)} style={{ ...btnStyle('#4f46e5', '#fff'), flex: 1 }}>View</button>
//                 {canEdit && <button onClick={() => setAddMemberTeam(team)} style={{ ...btnStyle('#2d3348', '#a5b4fc'), flex: 1 }}>+ Member</button>}
//                 {canEdit && <button onClick={() => setEditTeam(team)} style={{ ...btnStyle('#2d3348', '#cbd5e1'), flex: 1 }}>Edit</button>}
//                 {canDelete && <button onClick={() => onDelete(team.id)} style={{ ...btnStyle('#2d3348', '#f87171'), flex: 1 }}>Delete</button>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {viewTeam && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <div style={headerStyle}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
//                 <div style={iconBoxStyle}>👥</div>
//                 <div style={{ minWidth: 0 }}>
//                   <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                     {viewTeam.team_name}
//                   </p>
//                   <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{viewTeam.description || 'No description'}</p>
//                 </div>
//               </div>
//               <button onClick={() => setViewTeam(null)} style={closeBtnStyle}
//                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
//                 onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
//               >✕</button>
//             </div>

//             <div style={{ padding: '28px 32px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//                 <div style={avatarStyle}>{viewTeam.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
//                 <div>
//                   <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Created by</p>
//                   <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0 }}>{viewTeam.created_by_detail?.name || 'Unknown'}</p>
//                 </div>
//               </div>

//               <div style={{ borderTop: '1px solid #2d3348', marginBottom: '20px' }} />

//               <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
//                 Members ({viewTeam.members?.length ?? 0})
//               </p>

//               {viewTeam.members?.length > 0 ? (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   {viewTeam.members.map((m, i) => (
//                     <div key={i} style={{
//                       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                       background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
//                       borderRadius: '10px', padding: '10px 14px',
//                     }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
//                         <div style={avatarStyle}>{m.user_detail?.name?.charAt(0).toUpperCase() || '?'}</div>
//                         <div style={{ minWidth: 0 }}>
//                           <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                             {m.user_detail?.name || 'Unknown'}
//                           </p>
//                           <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                             {m.user_detail?.email}
//                           </p>
//                         </div>
//                       </div>
//                       {m.role && (
//                         <span style={{
//                           background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
//                           fontSize: '11px', fontWeight: '600',
//                           padding: '3px 10px', borderRadius: '999px',
//                           whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px',
//                         }}>{m.role}</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p style={{ color: '#6b7280', fontSize: '13px' }}>No members yet.</p>
//               )}

//               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #2d3348' }}>
//                 <button onClick={() => setViewTeam(null)}
//                   style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 24px', borderRadius: '12px', cursor: 'pointer' }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#374151'}
//                   onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//                 >Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {editTeam && (
//         <EditTeamModal
//           team={editTeam}
//           onClose={() => { setEditTeam(null); onRefresh() }}
//           onSaved={() => { setEditTeam(null); onRefresh() }}
//         />
//       )}

//       {addMemberTeam && (
//         <AddMemberForm
//           team={addMemberTeam}
//           onAdded={() => { setAddMemberTeam(null); onRefresh() }}
//           onCancel={() => setAddMemberTeam(null)}
//         />
//       )}
//     </>
//   )
// }

// function EditTeamModal({ team, onClose, onSaved }) {
//   const [teamName, setTeamName] = useState(team.team_name)
//   const [teamDesc, setTeamDesc] = useState(team.description || '')
//   const [saving, setSaving]     = useState(false)

//   const [members, setMembers]   = useState(team.members || [])
//   const [roleDrafts, setRoleDrafts] = useState(
//     Object.fromEntries((team.members || []).map((m) => [m.id, m.role || '']))
//   )
//   const [removingId, setRemovingId] = useState(null)

//   const handleRemoveMember = async (memberRowId) => {
//     if (!window.confirm('Remove this member from the team?')) return
//     setRemovingId(memberRowId)
//     try {
//       await api.delete(`/team-members/${memberRowId}/`)
//       setMembers((prev) => prev.filter((m) => m.id !== memberRowId))
//     } catch (err) {
//       console.error('Failed to remove member', err)
//       alert('Could not remove this member. Please try again.')
//     } finally {
//       setRemovingId(null)
//     }
//   }

//   const handleSaveAll = async () => {
//     if (!teamName.trim()) return
//     setSaving(true)
//     try {
//       await api.put(`/teams/${team.id}`, {
//         team_name: teamName,
//         description: teamDesc,
//         created_by: team.created_by,
//       })

//       const roleUpdates = members
//         .filter((m) => roleDrafts[m.id] !== m.role)
//         .map((m) =>
//           api.put(`/team-members/${m.id}/`, {
//             team: team.id,
//             user: m.user,
//             role: roleDrafts[m.id],
//           })
//         )
//       await Promise.all(roleUpdates)

//       onSaved()
//     } catch (err) {
//       console.error('Failed to save team changes', err)
//       alert('Something went wrong while saving. Please try again.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const inputStyle = {
//     width: '100%', background: '#232938', border: '1px solid #3f4659',
//     borderRadius: '12px', color: '#fff', fontSize: '14px',
//     padding: '12px 14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
//   }

//   const roleInputStyle = {
//     flex: 1, background: '#1c2130', border: '1px solid #2d3348',
//     borderRadius: '8px', color: '#e5e7eb', fontSize: '12px',
//     padding: '6px 10px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
//   }

//   return (
//     <div style={overlayStyle}>
//       <div style={{ ...modalStyle, maxWidth: '860px' }}>

//         <div style={headerStyle}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div style={iconBoxStyle}>✏️</div>
//             <div>
//               <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Edit Team</p>
//               <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
//                 Manage members on the left, update team details on the right.
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} style={closeBtnStyle}
//             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
//             onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
//           >✕</button>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '360px' }}>

//           <div style={{
//             padding: '24px', borderRight: '1px solid #2d3348',
//             maxHeight: '460px', overflowY: 'auto',
//           }}>
//             <p style={labelStyle}>Members ({members.length})</p>

//             {members.length === 0 ? (
//               <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '12px' }}>No members yet.</p>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
//                 {members.map((m) => (
//                   <div key={m.id} style={{
//                     background: 'rgba(99,102,241,0.07)',
//                     border: '1px solid rgba(99,102,241,0.15)',
//                     borderRadius: '12px', padding: '12px',
//                   }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
//                       <div style={avatarStyle}>
//                         {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
//                       </div>
//                       <div style={{ minWidth: 0, flex: 1 }}>
//                         <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                           {m.user_detail?.name || 'Unknown'}
//                         </p>
//                         <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                           {m.user_detail?.email}
//                         </p>
//                       </div>
//                     </div>

//                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//                       <input
//                         value={roleDrafts[m.id] ?? ''}
//                         onChange={(e) => setRoleDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
//                         placeholder="Role"
//                         style={roleInputStyle}
//                         onFocus={e => e.target.style.borderColor = '#6366f1'}
//                         onBlur={e => e.target.style.borderColor = '#2d3348'}
//                       />
//                       <button
//                         onClick={() => handleRemoveMember(m.id)}
//                         disabled={removingId === m.id}
//                         style={{
//                           background: 'transparent',
//                           border: '1px solid rgba(239,68,68,0.3)',
//                           color: '#f87171', fontSize: '11px', fontWeight: '600',
//                           padding: '6px 12px', borderRadius: '8px',
//                           cursor: removingId === m.id ? 'not-allowed' : 'pointer',
//                           opacity: removingId === m.id ? 0.6 : 1,
//                           whiteSpace: 'nowrap',
//                         }}
//                         onMouseEnter={e => { if (removingId !== m.id) e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
//                         onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
//                       >
//                         {removingId === m.id ? 'Removing...' : 'Remove'}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//             <div>
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={labelStyle}>Team Name</label>
//                 <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={inputStyle}
//                   onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
//               </div>
//               <div>
//                 <label style={labelStyle}>Description</label>
//                 <textarea value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} rows={5}
//                   style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
//                   onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
//               </div>
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', marginTop: '20px', borderTop: '1px solid #2d3348' }}>
//               <button onClick={onClose}
//                 style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#374151'}
//                 onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//               >Close</button>
//               <button onClick={handleSaveAll} disabled={saving}
//                 style={{ background: saving ? '#4338ca' : '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 24px', borderRadius: '12px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
//                 onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#4338ca' }}
//                 onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#4f46e5' }}
//               >{saving ? 'Saving...' : 'Save All Changes →'}</button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// const thStyle = { textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }
// const tdStyle = { padding: '16px 20px', fontSize: '14px' }
// const btnStyle = (bg, color) => ({ background: bg, border: 'none', color, fontSize: '12px', fontWeight: '600', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' })
// const memberBadgeStyle = { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }
// const overlayStyle = { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '16px' }
// const modalStyle = { width: '100%', maxWidth: '560px', borderRadius: '24px', border: '1px solid #2d3348', background: '#1a1f2e', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }
// const headerStyle = { background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)', borderBottom: '1px solid #2d3348', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }
// const iconBoxStyle = { width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }
// const closeBtnStyle = { width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
// const avatarStyle = { width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', flexShrink: 0 }
// const labelStyle = { color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0px' }






import { useState, useEffect } from 'react'
import api from '../../services/api'
import AddMemberForm from './AddMemberForm'
import {
  Folder, Users, Eye, UserPlus, Pencil, Trash2, X, Loader2,
} from 'lucide-react'

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

  const iconBtn = (extra = '') =>
    `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${extra}`

  return (
    <>
      {!isMobile && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(15,23,42,0.1)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-purple-50/80">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Team Name</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Description</th>
                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Members</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id}
                  className={`${i === 0 ? '' : 'border-t border-slate-100'} transition-colors duration-150 hover:bg-purple-50/40`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
                        <Folder size={16} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-slate-500">
                      {team.description || <span className="italic text-slate-400">No description</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-600">
                      <Users size={12} /> {team.members?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewTeam(team)}
                        title="View"
                        className={iconBtn('border-transparent bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95')}
                      ><Eye size={14} /></button>

                      {canEdit && (
                        <button
                          onClick={() => setAddMemberTeam(team)}
                          title="Add member"
                          className={iconBtn('border-slate-200 bg-white text-indigo-500 hover:bg-indigo-50 hover:border-indigo-300')}
                        ><UserPlus size={14} /></button>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => setEditTeam(team)}
                          title="Edit"
                          className={iconBtn('border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900')}
                        ><Pencil size={14} /></button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => onDelete(team.id)}
                          title="Delete"
                          className={iconBtn('border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600')}
                        ><Trash2 size={14} /></button>
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
        <div className="flex flex-col gap-3">
          {teams.map((team) => (
            <div key={team.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
                    <Folder size={14} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{team.team_name}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold text-purple-600">
                  <Users size={12} /> {team.members?.length ?? 0}
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0">{team.description || 'No description'}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setViewTeam(team)} className="flex-1 rounded-lg bg-gradient-to-b from-purple-500 to-indigo-600 py-2 text-xs font-semibold text-white">View</button>
                {canEdit && <button onClick={() => setAddMemberTeam(team)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-indigo-600">+ Member</button>}
                {canEdit && <button onClick={() => setEditTeam(team)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600">Edit</button>}
                {canDelete && <button onClick={() => onDelete(team.id)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-red-500">Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white border border-purple-200 text-purple-600 shadow-sm">
                  <Users size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-slate-900">{viewTeam.team_name}</p>
                  <p className="mt-1 text-[13px] text-slate-500">{viewTeam.description || 'No description'}</p>
                </div>
              </div>
              <button
                onClick={() => setViewTeam(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700"
              ><X size={16} /></button>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-600">
                  {viewTeam.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 m-0">Created by</p>
                  <p className="text-[13px] font-semibold text-slate-700 m-0">{viewTeam.created_by_detail?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 mb-5" />

              <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Members ({viewTeam.members?.length ?? 0})
              </p>

              {viewTeam.members?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {viewTeam.members.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 px-3.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-purple-200 text-[11px] font-bold text-purple-600">
                          {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-700 m-0">{m.user_detail?.name || 'Unknown'}</p>
                          <p className="truncate text-[11px] text-slate-400 m-0 mt-0.5">{m.user_detail?.email}</p>
                        </div>
                      </div>
                      {m.role && (
                        <span className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                          {m.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400">No members yet.</p>
              )}

              <div className="flex justify-end mt-6 pt-5 border-t border-slate-100">
                <button
                  onClick={() => setViewTeam(null)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900"
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[860px] max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white border border-purple-200 text-purple-600 shadow-sm">
              <Pencil size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 m-0">Edit Team</p>
              <p className="mt-1 text-[13px] text-slate-500">
                Manage members on the left, update team details on the right.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700"
          ><X size={16} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">

          <div className="border-b md:border-b-0 md:border-r border-slate-100 p-6 max-h-[460px] overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 m-0">
              Members ({members.length})
            </p>

            {members.length === 0 ? (
              <p className="mt-3 text-[13px] text-slate-400">No members yet.</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {members.map((m) => (
                  <div key={m.id} className="rounded-xl border border-purple-100 bg-purple-50/50 p-3">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-purple-200 text-[11px] font-bold text-purple-600">
                        {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-700 m-0">{m.user_detail?.name || 'Unknown'}</p>
                        <p className="truncate text-[11px] text-slate-400 m-0 mt-0.5">{m.user_detail?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        value={roleDrafts[m.id] ?? ''}
                        onChange={(e) => setRoleDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                        placeholder="Role"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition-colors duration-200 focus:border-purple-400"
                      />
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={removingId === m.id}
                        className="whitespace-nowrap rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removingId === m.id ? (
                          <span className="inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Removing...</span>
                        ) : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-6">
            <div>
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2.5">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2.5">Description</label>
                <textarea
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 leading-relaxed outline-none transition-all duration-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900"
              >Close</button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,58,237,0.15),0_8px_20px_-4px_rgba(124,58,237,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >{saving ? 'Saving...' : 'Save All Changes →'}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}