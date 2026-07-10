import { Folder, Users, X } from 'lucide-react'
import ProjectTaskList from './ProjectTaskList'

const STATUS_STYLES = {
  pending:   { classes: 'bg-slate-500/15 text-slate-300 border-slate-500/20', label: 'Pending' },
  active:    { classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20', label: 'Active' },
  completed: { classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', label: 'Completed' },
  on_hold:   { classes: 'bg-rose-500/15 text-rose-300 border-rose-500/20', label: 'On Hold' },
}

function ViewProjectModal({ project, onClose }) {
  const s = STATUS_STYLES[project.status] || STATUS_STYLES.pending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 slide-in-from-bottom-2 duration-250 flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6 shrink-0">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Folder size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-white">{project.title}</p>
              <p className="mt-1 text-[13px] text-slate-400 truncate">{project.description || 'No description'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-[300px_1fr]">

          <div className="p-7 md:border-r md:border-white/10">
            <div className="mb-5">
              <span className={`inline-block whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${s.classes}`}>
                {s.label}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                <Users size={13} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 m-0">Team</p>
                <p className="text-[13px] font-semibold text-slate-200 m-0">{project.team_detail?.team_name || 'No team'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                {project.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-[11px] text-slate-500 m-0">Created by</p>
                <p className="text-[13px] font-semibold text-slate-200 m-0">{project.created_by_detail?.name || 'Unknown'}</p>
              </div>
            </div>
            <div className="border-t border-white/10 mb-5" />
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] text-slate-500 m-0">Start Date</p>
                <p className="text-[13px] font-semibold text-slate-200 mt-1 m-0">{project.start_date || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 m-0">End Date</p>
                <p className="text-[13px] font-semibold text-slate-200 mt-1 m-0">{project.end_date || '—'}</p>
              </div>
            </div>
          </div>

          <div className="p-7">
            <ProjectTaskList projectId={project.id} maxHeight="420px" />
          </div>
        </div>

        <div className="flex justify-end px-7 py-5 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
          >Close</button>
        </div>
      </div>
    </div>
  )
}

export default ViewProjectModal;