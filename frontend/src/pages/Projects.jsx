import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateProjectForm from '../components/CreateProjectForm'
import ProjectTable       from '../components/ProjectTable'
import { useRole }        from '../hooks/useRole'
import ProjectFilter from '../components/ProjectFilter'

function Projects() {

  const { canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [projects, setProjects]   = useState([])
  const [teams, setTeams]         = useState([]) 
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const [page, setPage]     = useState(1)
  const [count, setCount]   = useState(0)
  const [pageSize] = useState(6)

  useEffect(() => {
    fetchProjects(page)
    fetchTeams()
  }, [page])

  const fetchProjects = async (pageNum) => {
    setLoading(true)
    try {
      const res = await api.get(`/projects/?page=${pageNum}`)
      setProjects(res.data?.results ?? [])
      setCount(res.data?.count ?? 0)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      let allTeams = []
      let url = '/teams/?page=1'
      while (url) {
        const res = await api.get(url)
        allTeams = [...allTeams, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const nextUrl = new URL(res.data.next)
          url = `/teams/?${nextUrl.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setTeams(allTeams)
    } catch (err) {
      console.error('Failed to fetch teams', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}/`)
      fetchProjects(page)
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  const myTeamIds = teams
    .filter((team) =>
      team.members?.some((m) => m.user === currentUser.id) ||
      team.created_by === currentUser.id
    )
    .map((team) => team.id)

  const visibleProjects = isAdmin
    ? projects
    : projects.filter((p) => myTeamIds.includes(p.team))

  const filteredProjects = statusFilter
    ? visibleProjects.filter((p) => p.status === statusFilter)
    : visibleProjects

  const totalPages = Math.ceil(count / pageSize)

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

      <div className="mb-6">
          <ProjectFilter
  statusFilter={statusFilter}
  onFilterChange={setStatusFilter}
/>
</div>

      {showForm && (
        <CreateProjectForm
          onCreated={() => { setShowForm(false); fetchProjects(page) }}
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
            {statusFilter
              ? 'Try a different status filter'
              : isAdmin
                ? 'Click "+ New Project" to get started'
                : "Your team doesn't have any projects yet"}
          </p>
        </div>

      ) : (
        <>
          <ProjectTable
            projects={filteredProjects}
            onDelete={handleDelete}
            onRefresh={() => fetchProjects(page)}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          {isAdmin && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: page === 1 ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === 1 ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
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

export default Projects;
