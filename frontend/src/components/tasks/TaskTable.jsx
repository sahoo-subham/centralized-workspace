import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
  CheckSquare, Folder, User, Eye, Pencil, Trash2, X, Calendar,
} from 'lucide-react'

const STATUS_STYLES = {
  pending:     { classes: 'bg-slate-500/15 text-slate-300 border-slate-500/20', label: 'Pending' },
  in_progress: { classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20', label: 'In Progress' },
  completed:   { classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', label: 'Completed' },
}

const PRIORITY_STYLES = {
  low:    { classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', label: 'Low' },
  medium: { classes: 'bg-amber-500/15 text-amber-300 border-amber-500/20', label: 'Medium' },
  high:   { classes: 'bg-rose-500/15 text-rose-300 border-rose-500/20', label: 'High' },
}

function TaskTable({ tasks, onDelete, onRefresh, canEdit, canDelete, isMember, canEditStatus }) {

  const [viewTask, setViewTask] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const iconBtn = (extra = '') =>
    `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${extra}`

  return (
    <>
      {!isMobile && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500/[0.08] via-indigo-500/[0.05] to-purple-500/[0.08]">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Task</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Project</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned To</th>
                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Priority</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Due Date</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => {
                const statusStyle   = STATUS_STYLES[task.status] || STATUS_STYLES.pending
                const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                return (
                  <tr key={task.id}
                    className={`${i === 0 ? '' : 'border-t border-white/[0.06]'} transition-colors duration-150 hover:bg-purple-500/[0.04]`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300">
                          <CheckSquare size={16} />
                        </div>
                        <span className="truncate max-w-[180px] text-sm font-semibold text-white">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-400">{task.project_detail?.title || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-400">{task.assigned_to_detail?.name || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${statusStyle.classes}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${priorityStyle.classes}`}>
                        {priorityStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{task.due_date || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewTask(task)}
                          title="View"
                          className={iconBtn('border-transparent bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95')}
                        ><Eye size={14} /></button>

                        {(canEdit || canEditStatus) && (
                          <button
                            onClick={() => setEditTask(task)}
                            title="Edit"
                            className={iconBtn('border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white')}
                          ><Pencil size={14} /></button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => onDelete(task.id)}
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
          {tasks.map((task) => {
            const statusStyle   = STATUS_STYLES[task.status] || STATUS_STYLES.pending
            const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
            return (
              <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20 text-purple-300">
                      <CheckSquare size={14} />
                    </div>
                    <span className="truncate text-sm font-semibold text-white">{task.title}</span>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle.classes}`}>
                    {statusStyle.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Folder size={12} /> {task.project_detail?.title || '—'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <User size={12} /> {task.assigned_to_detail?.name || 'Unassigned'}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${priorityStyle.classes}`}>
                    {priorityStyle.label} priority
                  </span>
                  {task.due_date && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar size={11} /> {task.due_date}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-1">
                  <button onClick={() => setViewTask(task)} className="flex-1 rounded-lg bg-gradient-to-b from-purple-500 to-indigo-600 py-2 text-xs font-semibold text-white">View</button>
                  {(canEdit || canEditStatus) && <button onClick={() => setEditTask(task)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-300">Edit</button>}
                  {canDelete && <button onClick={() => onDelete(task.id)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-red-400">Delete</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
                  <CheckSquare size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-white">{viewTask.title}</p>
                  <p className="mt-1 text-[13px] text-slate-400">{viewTask.description || 'No description'}</p>
                </div>
              </div>
              <button
                onClick={() => setViewTask(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              ><X size={16} /></button>
            </div>

            <div className="p-7">

              <div className="flex gap-3 mb-5">
                {(() => {
                  const s = STATUS_STYLES[viewTask.status] || STATUS_STYLES.pending
                  return (
                    <span className={`inline-block whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold ${s.classes}`}>
                      {s.label}
                    </span>
                  )
                })()}
                {(() => {
                  const p = PRIORITY_STYLES[viewTask.priority] || PRIORITY_STYLES.medium
                  return (
                    <span className={`inline-block whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold ${p.classes}`}>
                      {p.label} Priority
                    </span>
                  )
                })()}
              </div>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  <Folder size={13} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 m-0">Project</p>
                  <p className="text-[13px] font-semibold text-slate-200 m-0">{viewTask.project_detail?.title || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                  {viewTask.assigned_to_detail?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 m-0">Assigned to</p>
                  <p className="text-[13px] font-semibold text-slate-200 m-0">{viewTask.assigned_to_detail?.name || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                  {viewTask.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 m-0">Created by</p>
                  <p className="text-[13px] font-semibold text-slate-200 m-0">{viewTask.created_by_detail?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="border-t border-white/10 mb-5" />

              <div>
                <p className="text-[11px] text-slate-500 m-0">Due Date</p>
                <p className="text-[13px] font-semibold text-slate-200 mt-1 m-0">{viewTask.due_date || '—'}</p>
              </div>

              <div className="flex justify-end mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={() => setViewTask(null)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTask && (
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onSaved={() => { setEditTask(null); onRefresh() }} />
      )}
    </>
  )
}

function EditTaskModal({ task, onClose, onSaved }) {
  const [title, setTitle]             = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus]           = useState(task.status)
  const [priority, setPriority]       = useState(task.priority)
  const [dueDate, setDueDate]         = useState(task.due_date || '')
  const [saving, setSaving]           = useState(false)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isMember    = currentUser.role === 'member'

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      if (isMember) {
        await api.patch(`/tasks/${task.id}/`, { status })
      } else {
        await api.put(`/tasks/${task.id}/`, {
          title, description,
          project:     task.project,
          assigned_to: task.assigned_to,  
          created_by:  task.created_by,
          status, priority,
          due_date: dueDate || null,
        })
      }
      onSaved()
    } catch (err) {
      console.error('Failed to update task', err)
    } finally {
      setSaving(false)
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const optionClass = "bg-[#111524] text-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Pencil size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Edit Task</p>
              <p className="mt-1 text-[13px] text-slate-400">
                {isMember ? 'Update task status only.' : 'Update task details.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="p-7">

          {!isMember && (
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${fieldBase} ${fieldNormal}`}
              />
            </div>
          )}

          {!isMember && (
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
              />
            </div>
          )}

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${fieldBase} ${fieldNormal}`}
            >
              <option value="pending" className={optionClass}>Pending</option>
              <option value="in_progress" className={optionClass}>In Progress</option>
              <option value="completed" className={optionClass}>Completed</option>
            </select>
          </div>

          {!isMember && (
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${fieldBase} ${fieldNormal}`}
              >
                <option value="low" className={optionClass}>Low</option>
                <option value="medium" className={optionClass}>Medium</option>
                <option value="high" className={optionClass}>High</option>
              </select>
            </div>
          )}

          {!isMember && (
            <div className="mb-7">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${fieldBase} ${fieldNormal}`}
              />
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

export default TaskTable;