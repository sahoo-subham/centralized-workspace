// import { useState, useEffect } from 'react'
// import api from '../services/api'
// import CreateTeamForm from '../components/teams/CreateTeamForm'
// import TeamTable      from '../components/teams/TeamTable'
// import TeamFilter     from '../components/teams/TeamFilter'
// import Register       from './Register'
// import { useRole }    from '../hooks/useRole'

// export default function Teams() {

//   const { canCreateTeam, canEdit, canDelete, isAdmin } = useRole()
//   const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

//   const [allTeams, setAllTeams]             = useState([]) 
//   const [loading, setLoading]               = useState(true)
//   const [showForm, setShowForm]             = useState(false)
//   const [registerMember, setRegisterMember] = useState(false)
//   const [selectedTeam, setSelectedTeam]     = useState('') 

//   const [page, setPage]     = useState(1)
//   const [pageSize] = useState(6)

//   useEffect(() => { fetchAllTeams() }, [])

//   const fetchAllTeams = async () => {
//     setLoading(true)
//     try {
//       let combined = []
//       let url = '/teams/?page=1'

//       while (url) {
//         const res = await api.get(url)
//         combined = [...combined, ...(res.data?.results ?? [])]

//         if (res.data?.next) {
//           const nextUrl = new URL(res.data.next)
//           url = `/teams/?${nextUrl.searchParams.toString()}`
//         } else {
//           url = null
//         }
//       }

//       setAllTeams(combined)
//     } catch (err) {
//       console.error('Failed to fetch teams', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this team?')) return
//     try {
//       await api.delete(`/teams/${id}`)
//       fetchAllTeams()
//     } catch (err) {
//       console.error('Failed to delete team', err)
//     }
//   }

//   const myTeams = isAdmin
//     ? allTeams
//     : allTeams.filter((team) =>
//         team.members?.some((m) => m.user === currentUser.id) ||
//         team.created_by === currentUser.id
//       )

//   const visibleTeams = selectedTeam
//     ? myTeams.filter((t) => t.id === parseInt(selectedTeam))
//     : myTeams

//   const totalPages = Math.ceil(visibleTeams.length / pageSize)
//   const pagedTeams  = visibleTeams.slice((page - 1) * pageSize, page * pageSize)

//   useEffect(() => {
//     if (page > totalPages && totalPages > 0) setPage(totalPages)
//     if (totalPages === 0) setPage(1)
//   }, [totalPages])

//   useEffect(() => { setPage(1) }, [selectedTeam])

//   return (
//     <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">Teams</h1>
//           <p className="text-gray-400 text-sm mt-1">
//             {isAdmin ? 'Manage all teams' : 'Your teams'}
//           </p>
//         </div>

//         <div className="flex gap-3">
//           {canCreateTeam && (
//             <button
//               onClick={() => { setShowForm(!showForm); setRegisterMember(false) }}
//               style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
//               onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
//               onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
//             >+ New Team</button>
//           )}


//           {isAdmin && (
//             <button
//               onClick={() => { setRegisterMember(!registerMember); setShowForm(false) }}
//               style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
//               onMouseEnter={e => e.currentTarget.style.background = '#374151'}
//               onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
//             >+ Register New Member</button>
//           )}
//         </div>
//       </div>

//       <div className="mb-6">
//         <TeamFilter
//           teams={myTeams}
//           selectedTeam={selectedTeam}
//           onFilterChange={(val) => setSelectedTeam(val)}
//         />
//       </div>

//       {showForm && (
//         <CreateTeamForm
//           onCreated={() => { setShowForm(false); fetchAllTeams() }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}
//       {registerMember && (
//         <Register
//           onSuccess={() => setRegisterMember(false)}
//           onCancel={() => setRegisterMember(false)}
//         />
//       )}

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <p className="text-gray-400 text-sm">Loading teams...</p>
//         </div>

//       ) : visibleTeams.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
//           <span className="text-4xl mb-3">👥</span>
//           <p className="text-gray-300 font-medium">No teams found</p>
//           <p className="text-gray-500 text-sm mt-1">
//             {selectedTeam
//               ? 'Try a different team'
//               : isAdmin
//                 ? 'Click "+ New Team" to get started'
//                 : "You haven't been added to any team yet"}
//           </p>
//         </div>

//       ) : (
//         <>
//           <TeamTable
//             teams={pagedTeams}
//             onDelete={handleDelete}
//             onRefresh={fetchAllTeams}
//             canEdit={canEdit}
//             canDelete={canDelete}
//           />

//           {totalPages > 1 && (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 style={{ background: page === 1 ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === 1 ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
//               >← Prev</button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   style={{ background: p === page ? '#4f46e5' : '#2d3348', border: '1px solid #3f4659', color: p === page ? '#fff' : '#cbd5e1', fontSize: '14px', fontWeight: '600', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}
//                 >{p}</button>
//               ))}

//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 style={{ background: page === totalPages ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === totalPages ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
//               >Next →</button>
//             </div>
//           )}
//         </>
//       )}

//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateTeamForm from '../components/teams/CreateTeamForm'
import TeamTable      from '../components/teams/TeamTable'
import TeamFilter     from '../components/teams/TeamFilter'
import Register       from './Register'
import { useRole }    from '../hooks/useRole'
import { Users, Plus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Teams() {

  const { canCreateTeam, canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allTeams, setAllTeams]             = useState([]) 
  const [loading, setLoading]               = useState(true)
  const [showForm, setShowForm]             = useState(false)
  const [registerMember, setRegisterMember] = useState(false)
  const [selectedTeam, setSelectedTeam]     = useState('') 

  const [page, setPage]     = useState(1)
  const [pageSize] = useState(6)

  useEffect(() => { fetchAllTeams() }, [])

  const fetchAllTeams = async () => {
    setLoading(true)
    try {
      let combined = []
      let url = '/teams/?page=1'

      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]

        if (res.data?.next) {
          const nextUrl = new URL(res.data.next)
          url = `/teams/?${nextUrl.searchParams.toString()}`
        } else {
          url = null
        }
      }

      setAllTeams(combined)
    } catch (err) {
      console.error('Failed to fetch teams', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return
    try {
      await api.delete(`/teams/${id}`)
      fetchAllTeams()
    } catch (err) {
      console.error('Failed to delete team', err)
    }
  }

  const myTeams = isAdmin
    ? allTeams
    : allTeams.filter((team) =>
        team.members?.some((m) => m.user === currentUser.id) ||
        team.created_by === currentUser.id
      )

  const visibleTeams = selectedTeam
    ? myTeams.filter((t) => t.id === parseInt(selectedTeam))
    : myTeams

  const totalPages = Math.ceil(visibleTeams.length / pageSize)
  const pagedTeams  = visibleTeams.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  useEffect(() => { setPage(1) }, [selectedTeam])

  return (
    <div className="relative w-full min-h-screen bg-[#F7F7FB] overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-300/25 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-indigo-300/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>

      <div className="relative w-full px-6 md:px-10 py-10 max-w-[1400px] mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teams</h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {isAdmin ? 'Manage all teams across your organization' : 'Your teams'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {canCreateTeam && (
              <button
                onClick={() => { setShowForm(!showForm); setRegisterMember(false) }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,58,237,0.15),0_8px_20px_-4px_rgba(124,58,237,0.35)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.3),0_10px_28px_-4px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} strokeWidth={2.5} />
                New Team
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => { setRegisterMember(!registerMember); setShowForm(false) }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-xl px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:bg-white hover:border-slate-300 hover:text-slate-900"
              >
                <UserPlus size={16} strokeWidth={2.5} />
                Register Member
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
          <TeamFilter
            teams={myTeams}
            selectedTeam={selectedTeam}
            onFilterChange={(val) => setSelectedTeam(val)}
          />
        </div>

        {showForm && (
          <CreateTeamForm
            onCreated={() => { setShowForm(false); fetchAllTeams() }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {registerMember && (
          <Register
            onSuccess={() => setRegisterMember(false)}
            onCancel={() => setRegisterMember(false)}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <span className="h-4 w-4 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
              Loading teams...
            </div>
          </div>

        ) : visibleTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-slate-300 bg-white/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
              <Users size={24} className="text-purple-500" strokeWidth={1.75} />
            </div>
            <p className="text-slate-800 font-semibold">No teams found</p>
            <p className="text-slate-500 text-sm mt-1.5">
              {selectedTeam
                ? 'Try a different team'
                : isAdmin
                  ? 'Click "New Team" to get started'
                  : "You haven't been added to any team yet"}
            </p>
          </div>

        ) : (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              <TeamTable
                teams={pagedTeams}
                onDelete={handleDelete}
                onRefresh={fetchAllTeams}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === 1
                      ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <ChevronLeft size={15} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      p === page
                        ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_0_0_1px_rgba(124,58,237,0.15),0_4px_14px_-2px_rgba(124,58,237,0.4)]'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                    }`}
                  >{p}</button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === totalPages
                      ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}