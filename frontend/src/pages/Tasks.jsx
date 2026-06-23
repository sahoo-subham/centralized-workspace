import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateTaskForm from '../components/CreateTaskForm'
import TaskTable      from '../components/TaskTable'
import { useRole }    from '../hooks/useRole'

const STATUS_FILTERS = [
  { value: '',            label: 'All Status' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
]

const PRIORITY_FILTERS = [
  { value: '',       label: 'All Priority' },
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
]

function Tasks() {

  const { canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allTasks, setAllTasks]   = useState([])
  const [allTeams, setAllTeams]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)

  // ── three filters ──────────────────────────────────────
  const [statusFilter, setStatusFilter]     = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [projectFilter, setProjectFilter]   = useState('')

  // ── pagination (client-side) ───────────────────────────
  const [page, setPage]   = useState(1)
  const [pageSize]        = useState(6)

  // fetch all tasks across all pages
  const fetchAllTasks = async () => {
    setLoading(true)
    try {
      let combined = []
      let url = '/tasks/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/tasks/?${next.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setAllTasks(combined)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  // fetch all teams to determine which projects/tasks the user can see
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
    fetchAllTasks()
    fetchAllTeams()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}/`)
      fetchAllTasks()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  // ── STEP 1 — role-based visibility ─────────────────────
  // Admin        → all tasks
  // Team lead/member → only tasks whose project belongs to their team
  const myTeamIds = allTeams
    .filter((t) =>
      t.members?.some((m) => m.user === currentUser.id) ||
      t.created_by === currentUser.id
    )
    .map((t) => t.id)

  const myTasks = isAdmin
    ? allTasks
    : allTasks.filter((task) => {
        // task.project_detail.team is the team id the project belongs to
        const taskTeamId = task.project_detail?.team ?? task.team
        return myTeamIds.includes(taskTeamId)
      })

  // ── STEP 2 — status filter ─────────────────────────────
  const afterStatusFilter = statusFilter
    ? myTasks.filter((t) => t.status === statusFilter)
    : myTasks

  // ── STEP 3 — priority filter ───────────────────────────
  const afterPriorityFilter = priorityFilter
    ? afterStatusFilter.filter((t) => t.priority === priorityFilter)
    : afterStatusFilter

  // ── STEP 4 — project filter ────────────────────────────
  const filteredTasks = projectFilter
    ? afterPriorityFilter.filter((t) => t.project === parseInt(projectFilter))
    : afterPriorityFilter

  // ── STEP 5 — paginate ──────────────────────────────────
  const totalPages   = Math.ceil(filteredTasks.length / pageSize)
  const pagedTasks   = filteredTasks.slice((page - 1) * pageSize, page * pageSize)

  // reset page when filters change
  useEffect(() => { setPage(1) }, [statusFilter, priorityFilter, projectFilter])
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  // unique projects from visible tasks for the project filter dropdown
  const projectsForFilter = Array.from(
    new Map(myTasks.map((t) => [t.project, t.project_detail])).entries()
  ).map(([id, detail]) => ({ id, title: detail?.title ?? `Project ${id}` }))

  const selectStyle = {
    background: '#232938', border: '1px solid #3f4659',
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    padding: '12px 16px', outline: 'none', cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    color: '#94a3b8', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  const anyFilterActive = statusFilter || priorityFilter || projectFilter

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Manage all tasks' : 'Your team tasks'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
          >+ New Task</button>
        )}
      </div>

      {/* ── FILTERS ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Filter by Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '180px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
            {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Priority */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Filter by Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '180px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
            {PRIORITY_FILTERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        {/* Project */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Filter by Project</label>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
            style={{ ...selectStyle, minWidth: '200px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
            <option value="">All Projects</option>
            {projectsForFilter.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        {/* Clear filters */}
        {anyFilterActive && (
          <button
            onClick={() => { setStatusFilter(''); setPriorityFilter(''); setProjectFilter('') }}
            style={{
              background: 'transparent', border: '1px solid #3f4659',
              color: '#94a3b8', fontSize: '13px', fontWeight: '500',
              padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3f4659'; e.currentTarget.style.color = '#94a3b8' }}
          >✕ Clear filters</button>
        )}
      </div>

      {/* Create Task Modal */}
      {showForm && (
        <CreateTaskForm
          onCreated={() => { setShowForm(false); fetchAllTasks() }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tasks Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading tasks...</p>
        </div>

      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">✅</span>
          <p className="text-gray-300 font-medium">No tasks found</p>
          <p className="text-gray-500 text-sm mt-1">
            {anyFilterActive
              ? 'Try adjusting your filters'
              : isAdmin
                ? 'Click "+ New Task" to get started'
                : "Your team doesn't have any tasks yet"}
          </p>
        </div>

      ) : (
        <>
          <TaskTable
            tasks={pagedTasks}
            onDelete={handleDelete}
            onRefresh={fetchAllTasks}
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

export default Tasks