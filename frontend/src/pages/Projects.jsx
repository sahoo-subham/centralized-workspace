import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateProjectForm from '../components/projects/CreateProjectForm'
import ProjectTable       from '../components/projects/ProjectTable'
import ProjectFilter      from '../components/projects/ProjectFilter'
import { useRole }        from '../hooks/useRole'

function Projects() {

  const { canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allProjects, setAllProjects] = useState([]) 
  const [allTeams, setAllTeams]       = useState([]) 
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)

  const [statusFilter, setStatusFilter] = useState('')
  const [teamFilter, setTeamFilter]     = useState('')

  const [page, setPage]     = useState(1)
  const [pageSize] = useState(6)

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

  useEffect(() => {
    fetchAllProjects()
    fetchAllTeams()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}/`)
      fetchAllProjects()
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  const myTeamIds = allTeams
    .filter((t) =>
      t.members?.some((m) => m.user === currentUser.id) ||
      t.created_by === currentUser.id
    )
    .map((t) => t.id)

  const myProjects = isAdmin
    ? allProjects
    : allProjects.filter((p) => myTeamIds.includes(p.team))

  const afterStatusFilter = statusFilter
    ? myProjects.filter((p) => p.status === statusFilter)
    : myProjects

  const filteredProjects = teamFilter
    ? afterStatusFilter.filter((p) => p.team === parseInt(teamFilter))
    : afterStatusFilter

  const totalPages  = Math.ceil(filteredProjects.length / pageSize)
  const pagedProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [statusFilter, teamFilter])
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [page, totalPages])

  const teamsForFilter = isAdmin
    ? allTeams
    : allTeams.filter((t) => myTeamIds.includes(t.id))

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">
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

      <ProjectFilter
        teams={teamsForFilter}
        statusFilter={statusFilter}
        teamFilter={teamFilter}
        onStatusChange={(val) => setStatusFilter(val)}
        onTeamChange={(val) => setTeamFilter(val)}
        onClear={() => { setStatusFilter(''); setTeamFilter('') }}
      />

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
