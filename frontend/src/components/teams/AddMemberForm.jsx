// import { useState, useEffect } from 'react'
// import api from '../../services/api'

// const roleSuggestions = [
//   'Frontend Developer',
//   'Backend Developer',
//   'Full Stack Developer',
//   'UI/UX Designer',
//   'Team Lead',
//   'QA Tester',
// ]

// export default function AddMemberForm({ team, teams, onAdded, onCancel }) {

//   const isLocked = !!team

//   const [users, setUsers]               = useState([])
//   const [selectedTeam, setSelectedTeam] = useState(team?.id || '')
//   const [selectedUser, setSelectedUser] = useState('')
//   const [role, setRole]                 = useState('')
//   const [loading, setLoading]           = useState(false)
//   const [error, setError]               = useState('')

//   const [userSearch, setUserSearch]   = useState('')
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [success, setSuccess]           = useState('')

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         let allUsers = []
//         let url = '/users/?page=1'
//         while (url) {
//           const res = await api.get(url)
//           allUsers = [...allUsers, ...(res.data?.results ?? res.data ?? [])]
//           if (res.data?.next) {
//             const nextUrl = new URL(res.data.next)
//             url = `/users/?${nextUrl.searchParams.toString()}`
//           } else {
//             url = null
//           }
//         }
//         setUsers(allUsers.filter((u) => u.role !== 'admin'))
//       } catch (err) {
//         console.error('Failed to fetch users', err)
//       }
//     }
//     fetchUsers()
//   }, [])

//   const existingMemberIds = isLocked
//     ? (team.members?.map((m) => m.user) ?? [])
//     : []

//   const filteredUsers = users.filter((u) => {
//     const q = userSearch.toLowerCase()
//     return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
//   })

//   const selectedUserObj = users.find((u) => u.id === parseInt(selectedUser))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!selectedTeam || !selectedUser) {
//       setError('Please select a member.')
//       return
//     }
//     setLoading(true)
//     setError('')
//     setSuccess('')
//     try {
//       await api.post('/team-members/', {
//         team: selectedTeam,
//         user: selectedUser,
//         role: role,
//       })
//       setSuccess('Member added successfully!')
//       setSelectedUser('')
//       setRole('')
//       onAdded()
//     } catch (err) {
//       setError(
//         err.response?.data?.non_field_errors?.[0] ||
//         'This user is already a member of this team.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const inputStyle = {
//     width: '100%',
//     background: '#232938',
//     border: '1px solid #3f4659',
//     borderRadius: '14px',
//     color: '#fff',
//     fontSize: '14px',
//     padding: '14px 16px',
//     outline: 'none',
//     boxSizing: 'border-box',
//     fontFamily: 'inherit',
//   }

//   const lockedFieldStyle = {
//     ...inputStyle,
//     background: '#1c2130',
//     color: '#9ca3af',
//     cursor: 'not-allowed',
//     border: '1px solid #2d3348',
//   }

//   const avatarCircleStyle = {
//     width: '28px', height: '28px', borderRadius: '50%',
//     background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     color: '#a5b4fc', fontSize: '12px', fontWeight: '700', flexShrink: 0,
//   }

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 50,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       background: 'rgba(0,0,0,0.70)',
//       backdropFilter: 'blur(8px)',
//       padding: '24px',
//     }}>

//       <div style={{
//         width: '100%', maxWidth: '560px',
//         borderRadius: '24px',
//         border: '1px solid #2d3348',
//         background: '#1a1f2e',
//         boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
//         overflow: 'hidden',
//       }}>

//         <div style={{
//           background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)',
//           borderBottom: '1px solid #2d3348',
//           padding: '28px 32px',
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div style={{
//               width: '52px', height: '52px', borderRadius: '16px',
//               background: 'rgba(99,102,241,0.2)',
//               border: '1px solid rgba(99,102,241,0.3)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '24px', flexShrink: 0,
//             }}>👥</div>
//             <div>
//               <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>
//                 Add Team Member
//               </p>
//               <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
//                 {isLocked
//                   ? `Adding a member to ${team.team_name}`
//                   : 'Assign a registered user to a team with a role.'}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={onCancel}
//             style={{
//               width: '36px', height: '36px', borderRadius: '10px',
//               background: 'rgba(255,255,255,0.05)', border: 'none',
//               color: '#94a3b8', fontSize: '16px', cursor: 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
//             onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
//           >✕</button>
//         </div>

//         <form onSubmit={handleSubmit} style={{ padding: '28px 32px' }}>

//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
//               Team
//             </label>

//             {isLocked ? (
//               <div style={lockedFieldStyle}>
//                 {team.team_name}
//               </div>
//             ) : (
//               <select
//                 value={selectedTeam}
//                 onChange={(e) => setSelectedTeam(e.target.value)}
//                 style={inputStyle}
//                 onFocus={e => e.target.style.borderColor = '#6366f1'}
//                 onBlur={e => e.target.style.borderColor = '#3f4659'}
//               >
//                 <option value="">Choose a team</option>
//                 {teams?.map((t) => (
//                   <option key={t.id} value={t.id}>{t.team_name}</option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div style={{ marginBottom: '20px', position: 'relative' }}>
//             <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
//               Select Member
//             </label>

//             <div
//               onClick={() => setDropdownOpen(true)}
//               style={{
//                 ...inputStyle,
//                 display: 'flex', alignItems: 'center', gap: '10px',
//                 cursor: 'pointer',
//                 borderColor: dropdownOpen ? '#6366f1' : '#3f4659',
//               }}
//             >
//               {selectedUserObj && !dropdownOpen ? (
//                 <>
//                   <div style={avatarCircleStyle}>
//                     {selectedUserObj.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <span style={{ color: '#fff', flex: 1 }}>
//                     {selectedUserObj.name} — {selectedUserObj.email}
//                   </span>
//                   <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
//                 </>
//               ) : (
//                 <>
//                   <span style={{ color: '#6b7280' }}>🔍</span>
//                   <input
//                     autoFocus={dropdownOpen}
//                     value={userSearch}
//                     onChange={(e) => { setUserSearch(e.target.value); setDropdownOpen(true) }}
//                     onFocus={() => setDropdownOpen(true)}
//                     placeholder="Search by name or email..."
//                     style={{
//                       flex: 1, background: 'transparent', border: 'none', outline: 'none',
//                       color: '#fff', fontSize: '14px', fontFamily: 'inherit',
//                     }}
//                   />
//                 </>
//               )}
//             </div>

//             {dropdownOpen && (
//               <>
//                 <div
//                   onClick={() => setDropdownOpen(false)}
//                   style={{ position: 'fixed', inset: 0, zIndex: 60 }}
//                 />
//                 <div style={{
//                   position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
//                   zIndex: 61,
//                   background: '#1f2433',
//                   border: '1px solid #3f4659',
//                   borderRadius: '14px',
//                   boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
//                   maxHeight: '260px',
//                   overflowY: 'auto',
//                   padding: '6px',
//                 }}>
//                   {filteredUsers.length === 0 ? (
//                     <p style={{ color: '#6b7280', fontSize: '13px', padding: '14px', textAlign: 'center', margin: 0 }}>
//                       No users found.
//                     </p>
//                   ) : (
//                     filteredUsers.map((u) => {
//                       const alreadyMember = existingMemberIds.includes(u.id)
//                       return (
//                         <div
//                           key={u.id}
//                           onClick={() => {
//                             if (alreadyMember) return
//                             setSelectedUser(String(u.id))
//                             setUserSearch('')
//                             setDropdownOpen(false)
//                           }}
//                           style={{
//                             display: 'flex', alignItems: 'center', gap: '10px',
//                             padding: '10px 12px', borderRadius: '10px',
//                             cursor: alreadyMember ? 'not-allowed' : 'pointer',
//                             opacity: alreadyMember ? 0.45 : 1,
//                             background: parseInt(selectedUser) === u.id ? 'rgba(99,102,241,0.15)' : 'transparent',
//                           }}
//                           onMouseEnter={e => { if (!alreadyMember) e.currentTarget.style.background = 'rgba(99,102,241,0.1)' }}
//                           onMouseLeave={e => { e.currentTarget.style.background = parseInt(selectedUser) === u.id ? 'rgba(99,102,241,0.15)' : 'transparent' }}
//                         >
//                           <div style={avatarCircleStyle}>
//                             {u.name?.charAt(0).toUpperCase()}
//                           </div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <p style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                               {u.name}
//                             </p>
//                             <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                               {u.email}
//                             </p>
//                           </div>
//                           {alreadyMember && (
//                             <span style={{
//                               background: 'rgba(34,197,94,0.15)', color: '#86efac',
//                               fontSize: '10px', fontWeight: '700',
//                               padding: '3px 8px', borderRadius: '999px', whiteSpace: 'nowrap',
//                             }}>Already in team</span>
//                           )}
//                         </div>
//                       )
//                     })
//                   )}
//                 </div>
//               </>
//             )}
//           </div>

//           <div style={{ marginBottom: '8px' }}>
//             <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '10px' }}>
//               Role
//             </label>
//             <input
//               type="text"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               placeholder="Assign a role or pick one below"
//               style={{ ...inputStyle, color: '#fff' }}
//               onFocus={e => e.target.style.borderColor = '#6366f1'}
//               onBlur={e => e.target.style.borderColor = '#3f4659'}
//             />

//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
//               {roleSuggestions.map((item) => (
//                 <button
//                   key={item} type="button" onClick={() => setRole(item)}
//                   style={{
//                     padding: '6px 14px', borderRadius: '999px',
//                     fontSize: '12px', fontWeight: '500', cursor: 'pointer',
//                     border: role === item ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(99,102,241,0.2)',
//                     background: role === item ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.1)',
//                     color: role === item ? '#c7d2fe' : '#a5b4fc',
//                     transition: 'all 0.15s',
//                   }}
//                 >{item}</button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#fca5a5', fontSize: '13px' }}>
//               {error}
//             </div>
//           )}
//           {success && (
//             <div style={{ marginTop: '16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#86efac', fontSize: '13px' }}>
//               {success}
//             </div>
//           )}

//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #2d3348' }}>
//             <button
//               type="button" onClick={onCancel}
//               style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
//               onMouseEnter={e => e.currentTarget.style.background = '#374151'}
//               onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//             >Cancel</button>
//             <button
//               type="submit" disabled={loading}
//               style={{ background: loading ? '#4338ca' : '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 24px', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
//               onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4338ca' }}
//               onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4f46e5' }}
//             >{loading ? 'Adding Member...' : 'Add Member →'}</button>
//           </div>

//         </form>
//       </div>
//     </div>
//   )
// }





import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Users, X, Search, CheckCircle2 } from 'lucide-react'

const roleSuggestions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Team Lead',
  'QA Tester',
]

export default function AddMemberForm({ team, teams, onAdded, onCancel }) {

  const isLocked = !!team

  const [users, setUsers]               = useState([])
  const [selectedTeam, setSelectedTeam] = useState(team?.id || '')
  const [selectedUser, setSelectedUser] = useState('')
  const [role, setRole]                 = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const [userSearch, setUserSearch]   = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [success, setSuccess]           = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let allUsers = []
        let url = '/users/?page=1'
        while (url) {
          const res = await api.get(url)
          allUsers = [...allUsers, ...(res.data?.results ?? res.data ?? [])]
          if (res.data?.next) {
            const nextUrl = new URL(res.data.next)
            url = `/users/?${nextUrl.searchParams.toString()}`
          } else {
            url = null
          }
        }
        setUsers(allUsers.filter((u) => u.role !== 'admin'))
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
    }
    fetchUsers()
  }, [])

  const existingMemberIds = isLocked
    ? (team.members?.map((m) => m.user) ?? [])
    : []

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  const selectedUserObj = users.find((u) => u.id === parseInt(selectedUser))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTeam || !selectedUser) {
      setError('Please select a member.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/team-members/', {
        team: selectedTeam,
        user: selectedUser,
        role: role,
      })
      setSuccess('Member added successfully!')
      setSelectedUser('')
      setRole('')
      onAdded()
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        'This user is already a member of this team.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
  const fieldLocked = "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6 animate-in fade-in duration-200">

      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white border border-purple-200 text-purple-600 shadow-sm">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 m-0">Add Team Member</p>
              <p className="mt-1 text-[13px] text-slate-500">
                {isLocked
                  ? `Adding a member to ${team.team_name}`
                  : 'Assign a registered user to a team with a role.'}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700"
          ><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-7">

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2.5">
              Team
            </label>

            {isLocked ? (
              <div className={`${fieldBase} ${fieldLocked}`}>{team.team_name}</div>
            ) : (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className={`${fieldBase} ${fieldNormal}`}
              >
                <option value="">Choose a team</option>
                {teams?.map((t) => (
                  <option key={t.id} value={t.id}>{t.team_name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-5 relative">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2.5">
              Select Member
            </label>

            <div
              onClick={() => setDropdownOpen(true)}
              className={`flex items-center gap-2.5 cursor-pointer ${fieldBase} ${
                dropdownOpen ? 'border-purple-400 ring-4 ring-purple-500/10 bg-white' : fieldNormal
              }`}
            >
              {selectedUserObj && !dropdownOpen ? (
                <>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-purple-200 text-[12px] font-bold text-purple-600">
                    {selectedUserObj.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-slate-900 truncate">
                    {selectedUserObj.name} — {selectedUserObj.email}
                  </span>
                  <span className="text-slate-400 text-xs">▾</span>
                </>
              ) : (
                <>
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <input
                    autoFocus={dropdownOpen}
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setDropdownOpen(true) }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search by name or email..."
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </>
              )}
            </div>

            {dropdownOpen && (
              <>
                <div
                  onClick={() => setDropdownOpen(false)}
                  className="fixed inset-0 z-[60]"
                />
                <div className="absolute z-[61] left-0 right-0 top-[calc(100%+6px)] max-h-[260px] overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {filteredUsers.length === 0 ? (
                    <p className="py-4 text-center text-[13px] text-slate-400 m-0">No users found.</p>
                  ) : (
                    filteredUsers.map((u) => {
                      const alreadyMember = existingMemberIds.includes(u.id)
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            if (alreadyMember) return
                            setSelectedUser(String(u.id))
                            setUserSearch('')
                            setDropdownOpen(false)
                          }}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-150 ${
                            alreadyMember ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-purple-50'
                          } ${parseInt(selectedUser) === u.id ? 'bg-purple-50' : ''}`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-purple-200 text-[12px] font-bold text-purple-600">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-slate-700 m-0">{u.name}</p>
                            <p className="truncate text-[11px] text-slate-400 m-0 mt-0.5">{u.email}</p>
                          </div>
                          {alreadyMember && (
                            <span className="whitespace-nowrap rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 border border-green-200">
                              Already in team
                            </span>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mb-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2.5">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Assign a role or pick one below"
              className={`${fieldBase} ${fieldNormal}`}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {roleSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border ${
                    role === item
                      ? 'border-purple-400 bg-purple-100 text-purple-700'
                      : 'border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >{item}</button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
              <CheckCircle2 size={15} /> {success}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-7 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900"
            >Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,58,237,0.15),0_8px_20px_-4px_rgba(124,58,237,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >{loading ? 'Adding Member...' : 'Add Member →'}</button>
          </div>

        </form>
      </div>
    </div>
  )
}