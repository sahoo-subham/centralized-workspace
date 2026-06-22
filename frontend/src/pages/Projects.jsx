// import { useState, useEffect } from 'react'
// import api from '../services/api'
// import CreateProjectForm from '../components/CreateProjectForm'
// import ProjectTable       from '../components/ProjectTable'
// import { useRole }        from '../hooks/useRole'
// import ProjectFilter from '../components/ProjectFilter'

// function Projects() {

//   const { canEdit, canDelete, isAdmin } = useRole()
//   const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

//   const [projects, setProjects]   = useState([])
//   const [teams, setTeams]         = useState([]) 
//   const [loading, setLoading]     = useState(true)
//   const [showForm, setShowForm]   = useState(false)
//   const [statusFilter, setStatusFilter] = useState('')

//   const [page, setPage]     = useState(1)
//   const [count, setCount]   = useState(0)
//   const [pageSize] = useState(6)

//   useEffect(() => {
//     fetchProjects(page)
//     fetchTeams()
//   }, [page])

//   const fetchProjects = async (pageNum) => {
//     setLoading(true)
//     try {
//       const res = await api.get(`/projects/?page=${pageNum}`)
//       setProjects(res.data?.results ?? [])
//       setCount(res.data?.count ?? 0)
//     } catch (err) {
//       console.error('Failed to fetch projects', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTeams = async () => {
//     try {
//       let allTeams = []
//       let url = '/teams/?page=1'
//       while (url) {
//         const res = await api.get(url)
//         allTeams = [...allTeams, ...(res.data?.results ?? [])]
//         if (res.data?.next) {
//           const nextUrl = new URL(res.data.next)
//           url = `/teams/?${nextUrl.searchParams.toString()}`
//         } else {
//           url = null
//         }
//       }
//       setTeams(allTeams)
//     } catch (err) {
//       console.error('Failed to fetch teams', err)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this project?')) return
//     try {
//       await api.delete(`/projects/${id}/`)
//       fetchProjects(page)
//     } catch (err) {
//       console.error('Failed to delete project', err)
//     }
//   }

//   const myTeamIds = teams
//     .filter((team) =>
//       team.members?.some((m) => m.user === currentUser.id) ||
//       team.created_by === currentUser.id
//     )
//     .map((team) => team.id)

//   const visibleProjects = isAdmin
//     ? projects
//     : projects.filter((p) => myTeamIds.includes(p.team))

//   const filteredProjects = statusFilter
//     ? visibleProjects.filter((p) => p.status === statusFilter)
//     : visibleProjects

//   const totalPages = Math.ceil(count / pageSize)

//   return (
//     <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
//           <p className="text-gray-400 text-sm mt-1">
//             {isAdmin ? 'Manage all projects' : 'Your team projects'}
//           </p>
//         </div>

//         {canEdit && (
//           <button
//             onClick={() => setShowForm(!showForm)}
//             style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
//             onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
//             onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
//           >+ New Project</button>
//         )}
//       </div>

//       <div className="mb-6">
//           <ProjectFilter
//   statusFilter={statusFilter}
//   onFilterChange={setStatusFilter}
// />
// </div>

//       {showForm && (
//         <CreateProjectForm
//           onCreated={() => { setShowForm(false); fetchProjects(page) }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <p className="text-gray-400 text-sm">Loading projects...</p>
//         </div>

//       ) : filteredProjects.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
//           <span className="text-4xl mb-3">📁</span>
//           <p className="text-gray-300 font-medium">No projects found</p>
//           <p className="text-gray-500 text-sm mt-1">
//             {statusFilter
//               ? 'Try a different status filter'
//               : isAdmin
//                 ? 'Click "+ New Project" to get started'
//                 : "Your team doesn't have any projects yet"}
//           </p>
//         </div>

//       ) : (
//         <>
//           <ProjectTable
//             projects={filteredProjects}
//             onDelete={handleDelete}
//             onRefresh={() => fetchProjects(page)}
//             canEdit={canEdit}
//             canDelete={canDelete}
//           />

//           {isAdmin && totalPages > 1 && (
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

// export default Projects;



import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateProjectForm from '../components/CreateProjectForm'
import ProjectTable       from '../components/ProjectTable'
import { useRole }        from '../hooks/useRole'

const STATUS_FILTERS = [
  { value: '',          label: 'All Status' },
  { value: 'pending',   label: 'Pending' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold',   label: 'On Hold' },
]

function Projects() {

  const { canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allProjects, setAllProjects] = useState([]) // all pages combined
  const [allTeams, setAllTeams]       = useState([]) // all teams for filter dropdown
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)

  // ── two filters ────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('')
  const [teamFilter, setTeamFilter]     = useState('')

  // ── pagination (client-side, same as Teams page) ───────
  const [page, setPage]     = useState(1)
  const [pageSize] = useState(6)

  useEffect(() => {
    fetchAllProjects()
    fetchAllTeams()
  }, [])

  // fetch EVERY project page so filters work across all pages
  const fetchAllProjects = async () => {
    setLoading(true)
    try {
      let combined = []
      let url = '/projects/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/projects/?${next.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setAllProjects(combined)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  // fetch all teams for dropdown + role-based filter
  const fetchAllTeams = async () => {
    try {
      let combined = []
      let url = '/teams/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/teams/?${next.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setAllTeams(combined)
    } catch (err) {
      console.error('Failed to fetch teams', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}/`)
      fetchAllProjects()
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  // ── STEP 1 — role-based visibility ─────────────────────
  // Admin → all projects
  // Others → only projects whose team the user belongs to or created
  const myTeamIds = allTeams
    .filter((t) =>
      t.members?.some((m) => m.user === currentUser.id) ||
      t.created_by === currentUser.id
    )
    .map((t) => t.id)

  const myProjects = isAdmin
    ? allProjects
    : allProjects.filter((p) => myTeamIds.includes(p.team))

  // ── STEP 2 — apply status filter ───────────────────────
  const afterStatusFilter = statusFilter
    ? myProjects.filter((p) => p.status === statusFilter)
    : myProjects

  // ── STEP 3 — apply team filter ─────────────────────────
  const filteredProjects = teamFilter
    ? afterStatusFilter.filter((p) => p.team === parseInt(teamFilter))
    : afterStatusFilter

  // ── STEP 4 — paginate the final result ─────────────────
  const totalPages  = Math.ceil(filteredProjects.length / pageSize)
  const pagedProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize)

  // reset to page 1 whenever a filter changes
  useEffect(() => { setPage(1) }, [statusFilter, teamFilter])
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  // teams visible in the team filter dropdown
  // admin sees all teams, others see only their teams
  const teamsForFilter = isAdmin
    ? allTeams
    : allTeams.filter((t) => myTeamIds.includes(t.id))

  const selectStyle = {
    background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '12px 16px', outline: 'none', cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Manage all projects' : 'Your team projects'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
          >+ New Project</button>
        )}
      </div>

      {/* ── FILTERS — Status + Team side by side ─────────── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>

        {/* Status filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '180px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#3f4659'}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Team filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Filter by Team
          </label>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '200px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#3f4659'}
          >
            <option value="">All Teams</option>
            {teamsForFilter.map((t) => (
              <option key={t.id} value={t.id}>{t.team_name}</option>
            ))}
          </select>
        </div>

        {/* Clear filters button — only show when any filter is active */}
        {(statusFilter || teamFilter) && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setStatusFilter(''); setTeamFilter('') }}
              style={{
                background: 'transparent', border: '1px solid #3f4659',
                color: '#94a3b8', fontSize: '13px', fontWeight: '500',
                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f4659'; e.currentTarget.style.color = '#94a3b8' }}
            >✕ Clear filters</button>
          </div>
        )}
      </div>

      {showForm && (
        <CreateProjectForm
          onCreated={() => { setShowForm(false); fetchAllProjects() }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading projects...</p>
        </div>

      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">📁</span>
          <p className="text-gray-300 font-medium">No projects found</p>
          <p className="text-gray-500 text-sm mt-1">
            {statusFilter || teamFilter
              ? 'Try adjusting your filters'
              : isAdmin
                ? 'Click "+ New Project" to get started'
                : "Your team doesn't have any projects yet"}
          </p>
        </div>

      ) : (
        <>
          <ProjectTable
            projects={pagedProjects}
            onDelete={handleDelete}
            onRefresh={fetchAllProjects}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: page === 1 ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === 1 ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background: p === page ? '#4f46e5' : '#2d3348', border: '1px solid #3f4659', color: p === page ? '#fff' : '#cbd5e1', fontSize: '14px', fontWeight: '600', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}
                >{p}</button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ background: page === totalPages ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === totalPages ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >Next →</button>
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default Projects