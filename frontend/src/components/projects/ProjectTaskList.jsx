import { useState, useEffect } from 'react'
import api from '../../services/api'
import { CalendarClock, CheckSquare, Circle, Clock } from 'lucide-react'

const TASK_STATUS_STYLES = {
  pending:     { classes: 'bg-slate-500/15 text-slate-300 border-slate-500/20', label: 'Pending', Icon: Circle },
  in_progress: { classes: 'bg-amber-500/15 text-amber-300 border-amber-500/20', label: 'In Progress', Icon: Clock },
  completed:   { classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', label: 'Completed', Icon: CheckSquare },
}

const TASK_PRIORITY_STYLES = {
  low:    { classes: 'bg-emerald-500/15 text-emerald-300' },
  medium: { classes: 'bg-amber-500/15 text-amber-300' },
  high:   { classes: 'bg-rose-500/15 text-rose-300' },
}

function ProjectTaskList({ projectId, maxHeight = '420px' }) {

  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) {
      setTasks([])
      setLoading(false)
      return
    }

    const fetchTasks = async () => {
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
        setTasks(combined.filter((t) => t.project === projectId))
      } catch (err) {
        console.error('Failed to fetch tasks for project', err)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [projectId])

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Tasks ({tasks.length})
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-3xl mb-2">🗒️</p>
          <p className="text-slate-500 text-sm">No tasks created for this project yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1" style={{ maxHeight }}>
          {tasks.map((task) => {
            const s = TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.pending
            const p = TASK_PRIORITY_STYLES[task.priority] || TASK_PRIORITY_STYLES.low
            const StatusIcon = s.Icon
            return (
              <div key={task.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate m-0">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                      <span>👤 {task.assigned_to_detail?.name || 'Unassigned'}</span>
                      {task.due_date && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock size={11} /> {task.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${s.classes}`}>
                      <StatusIcon size={10} /> {s.label}
                    </span>
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${p.classes}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectTaskList;