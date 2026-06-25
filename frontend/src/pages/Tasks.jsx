import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateTaskForm from '../components/CreateTaskForm'
import TaskTable      from '../components/TaskTable'
import TaskFilter     from '../components/TaskFilter'
import { useRole }    from '../hooks/useRole'

function Tasks() {

  const { canEdit, canDelete, isAdmin, isTeamLead, isMember } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allTasks, setAllTasks]   = useState([])
  const [allTeams, setAllTeams]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)

  const [statusFilter, setStatusFilter]     = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [projectFilter, setProjectFilter]   = useState('')

  const [page, setPage]   = useState(1)
  const [pageSize]        = useState(6)

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

  const myTeamIds = allTeams
    .filter((t) =>
      t.members?.some((m) => m.user === currentUser.id) ||
      t.created_by === currentUser.id
    )
    .map((t) => t.id)

  const myTasks = (() => {
    if (isAdmin) return allTasks

    if (isMember) {
      return allTasks.filter((t) => t.assigned_to === currentUser.id)
    }

    if (isTeamLead) {
      return allTasks.filter((t) =>
        t.created_by === currentUser.id ||
        t.assigned_to === currentUser.id
      )
    }

    return allTasks
  })()

  const afterStatus = statusFilter
    ? myTasks.filter((t) => t.status === statusFilter)
    : myTasks

  const afterPriority = priorityFilter
    ? afterStatus.filter((t) => t.priority === priorityFilter)
    : afterStatus

  const filteredTasks = projectFilter
    ? afterPriority.filter((t) => t.project === parseInt(projectFilter))
    : afterPriority

  const totalPages    = Math.ceil(filteredTasks.length / pageSize)
  const pagedTasks    = filteredTasks.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [statusFilter, priorityFilter, projectFilter])
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  const projectsForFilter = Array.from(
    new Map(myTasks.map((t) => [t.project, t.project_detail])).entries()
  ).map(([id, detail]) => ({ id, title: detail?.title ?? `Project ${id}` }))

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Manage all tasks' : isMember ? 'Tasks assigned to you' : 'Your team tasks'}
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

      <TaskFilter
        projects={projectsForFilter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        projectFilter={projectFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onProjectChange={setProjectFilter}
        onClear={() => { setStatusFilter(''); setPriorityFilter(''); setProjectFilter('') }}
      />

      {showForm && (
        <CreateTaskForm
          onCreated={() => { setShowForm(false); fetchAllTasks() }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading tasks...</p>
        </div>

      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">✅</span>
          <p className="text-gray-300 font-medium">No tasks found</p>
          <p className="text-gray-500 text-sm mt-1">
            {statusFilter || priorityFilter || projectFilter
              ? 'Try adjusting your filters'
              : isMember
                ? 'No tasks have been assigned to you yet'
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
            isMember={isMember}
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