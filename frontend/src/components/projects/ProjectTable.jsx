import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
  Folder, Users, Eye, Pencil, Trash2, X, Calendar, Flag, CalendarClock,
  CheckSquare, Circle, Clock,
} from 'lucide-react'

const STATUS_STYLES = {
  pending:   { classes: 'bg-slate-500/15 text-slate-300 border-slate-500/20', label: 'Pending' },
  active:    { classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20', label: 'Active' },
  completed: { classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', label: 'Completed' },
  on_hold:   { classes: 'bg-rose-500/15 text-rose-300 border-rose-500/20', label: 'On Hold' },
}

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

function ProjectTable({ projects, onDelete, onRefresh, canEdit, canDelete }) {

  const [viewProject, setViewProject] = useState(null)
  const [editProject, setEditProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!viewProject) {
      setProjectTasks([])
      return
    }
    const fetchProjectTasks = async () => {
      setLoadingTasks(true)
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
        setProjectTasks(combined.filter((t) => t.project === viewProject.id))
      } catch (err) {
        console.error('Failed to fetch project tasks', err)
        setProjectTasks([])
      } finally {
        setLoadingTasks(false)
      }
    }
    fetchProjectTasks()
  }, [viewProject])

  const iconBtn = (extra = '') =>
    `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${extra}`

  return (
    <>
      {!isMobile && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500/[0.08] via-indigo-500/[0.05] to-purple-500/[0.08]">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Title</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Team</th>
                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Dates</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => {
                const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.pending
                return (
                  <tr key={project.id}
                    className={`${i === 0 ? '' : 'border-t border-white/[0.06]'} transition-colors duration-150 hover:bg-purple-500/[0.04]`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300">
                          <Folder size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate max-w-[220px] text-sm font-semibold text-white m-0">{project.title}</p>
                          <p className="truncate max-w-[220px] text-xs text-slate-500 m-0 mt-0.5">{project.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-400">{project.team_detail?.team_name || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyle.classes}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-400">
                        {project.start_date && (
                          <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {project.start_date}</span>
                        )}
                        {project.end_date && (
                          <span className="inline-flex items-center gap-1.5"><Flag size={12} /> {project.end_date}</span>
                        )}
                        {!project.start_date && !project.end_date && <span className="text-slate-600">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewProject(project)}
                          title="View"
                          className={iconBtn('border-transparent bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95')}
                        ><Eye size={14} /></button>

                        {canEdit && (
                          <button
                            onClick={() => setEditProject(project)}
                            title="Edit"
                            className={iconBtn('border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white')}
                          ><Pencil size={14} /></button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => onDelete(project.id)}
                            title="Delete"
                            className={iconBtn('border-white/10 bg-white/[0.04] text-red-400 hover:bg-red-500/15 hover:border-red-400/30 hover:text-red-300')}
                          ><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.pending
            return (
              <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20 text-purple-300">
                      <Folder size={14} />
                    </div>
                    <span className="truncate text-sm font-semibold text-white">{project.title}</span>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle.classes}`}>
                    {statusStyle.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500 m-0">
                  {project.description || <span className="italic text-slate-600">No description</span>}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users size={12} /> {project.team_detail?.team_name || '—'}
                </div>

                {(project.start_date || project.end_date) && (
                  <div className="flex gap-3 text-[11px] text-slate-500">
                    {project.start_date && <span className="inline-flex items-center gap-1"><Calendar size={11} /> {project.start_date}</span>}
                    {project.end_date && <span className="inline-flex items-center gap-1"><Flag size={11} /> {project.end_date}</span>}
                  </div>
                )}

                <div className="flex gap-2 mt-1">
                  <button onClick={() => setViewProject(project)} className="flex-1 rounded-lg bg-gradient-to-b from-purple-500 to-indigo-600 py-2 text-xs font-semibold text-white">View</button>
                  {canEdit && <button onClick={() => setEditProject(project)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-300">Edit</button>}
                  {canDelete && <button onClick={() => onDelete(project.id)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-red-400">Delete</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 slide-in-from-bottom-2 duration-250 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6 shrink-0">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
                  <Folder size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-white">{viewProject.title}</p>
                  <p className="mt-1 text-[13px] text-slate-400 truncate">{viewProject.description || 'No description'}</p>
                </div>
              </div>
              <button
                onClick={() => setViewProject(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              ><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-[300px_1fr]">

              <div className="p-7 md:border-r md:border-white/10">
                <div className="mb-5">
                  {(() => {
                    const s = STATUS_STYLES[viewProject.status] || STATUS_STYLES.pending
                    return (
                      <span className={`inline-block whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${s.classes}`}>
                        {s.label}
                      </span>
                    )
                  })()}
                </div>

                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    <Users size={13} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 m-0">Team</p>
                    <p className="text-[13px] font-semibold text-slate-200 m-0">{viewProject.team_detail?.team_name || 'No team'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                    {viewProject.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 m-0">Created by</p>
                    <p className="text-[13px] font-semibold text-slate-200 m-0">{viewProject.created_by_detail?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 mb-5" />

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500 m-0">Start Date</p>
                    <p className="text-[13px] font-semibold text-slate-200 mt-1 m-0">{viewProject.start_date || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 m-0">End Date</p>
                    <p className="text-[13px] font-semibold text-slate-200 mt-1 m-0">{viewProject.end_date || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Tasks ({projectTasks.length})
                </p>

                {loadingTasks ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
                    ))}
                  </div>
                ) : projectTasks.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-3xl mb-2">🗒️</p>
                    <p className="text-slate-500 text-sm">No tasks created for this project yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {projectTasks.map((task) => {
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
            </div>

            <div className="flex justify-end px-7 py-5 border-t border-white/10 shrink-0">
              <button
                onClick={() => setViewProject(null)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
              >Close</button>
            </div>
          </div>
        </div>
      )}

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSaved={() => { setEditProject(null); onRefresh() }}
        />
      )}
    </>
  )
}

function EditProjectModal({ project, onClose, onSaved }) {
  const [title, setTitle]             = useState(project.title)
  const [description, setDescription] = useState(project.description || '')
  const [status, setStatus]           = useState(project.status)
  const [startDate, setStartDate]     = useState(project.start_date || '')
  const [endDate, setEndDate]         = useState(project.end_date || '')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.put(`/projects/${project.id}/`, {
        title,
        description,
        team: project.team,
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: project.created_by,
      })
      onSaved()
    } catch (err) {
      const apiError = err.response?.data?.end_date?.[0]
      setError(apiError || 'Failed to update project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Pencil size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Edit Project</p>
              <p className="mt-1 text-[13px] text-slate-400">Update project details.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="p-7">
          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${fieldBase} ${fieldNormal}`}
            />
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${fieldBase} ${fieldNormal} [color-scheme:dark]`}
              >
                <option value="pending" className="bg-[#111524] text-white">Pending</option>
                <option value="active" className="bg-[#111524] text-white">Active</option>
                <option value="completed" className="bg-[#111524] text-white">Completed</option>
                <option value="on_hold" className="bg-[#111524] text-white">On Hold</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${fieldBase} ${fieldNormal} [color-scheme:dark]`}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`${fieldBase} ${fieldNormal} [color-scheme:dark]`}
            />
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-5 border-t border-white/10">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >{saving ? 'Saving...' : 'Save Changes →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectTable;