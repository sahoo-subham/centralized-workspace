import { useState } from "react"
import { ChevronDown, Folder, X } from "lucide-react"

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

const PRIORITY_FILTERS = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

function TaskFilter({
  projects,
  statusFilter,
  priorityFilter,
  projectFilter,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onClear,
}) {

  const [statusOpen, setStatusOpen] = useState(false)
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)

  const selectedStatus = STATUS_FILTERS.find((s) => s.value === statusFilter)
  const selectedPriority = PRIORITY_FILTERS.find((p) => p.value === priorityFilter)
  const selectedProject = projects.find((p) => p.id === parseInt(projectFilter))

  const box = (open) =>
    `flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 cursor-pointer text-sm text-white backdrop-blur-xl transition-all duration-200 ${
      open
        ? 'border-purple-500/60 ring-4 ring-purple-500/10 bg-white/[0.04]'
        : 'border-white/10 bg-white/[0.04] hover:border-white/20'
    }`

  const Item = ({ active, children, onClick }) => (
    <div
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-colors duration-150 ${
        active ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300 hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </div>
  )

  const panel = "absolute z-[61] top-[calc(100%+6px)] w-full rounded-2xl border border-white/10 bg-[#111524]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150"

  return (
    <div className="flex gap-4 mb-8 flex-wrap items-end">

      <div className="relative min-w-[180px]">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Status
        </label>

        <div onClick={() => setStatusOpen(true)} className={box(statusOpen)}>
          {selectedStatus.label}
          <ChevronDown size={15} className="text-slate-500" />
        </div>

        {statusOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setStatusOpen(false)} />
            <div className={panel}>
              {STATUS_FILTERS.map((s) => (
                <Item
                  key={s.value}
                  active={statusFilter === s.value}
                  onClick={() => { onStatusChange(s.value); setStatusOpen(false) }}
                >{s.label}</Item>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative min-w-[180px]">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Priority
        </label>

        <div onClick={() => setPriorityOpen(true)} className={box(priorityOpen)}>
          {selectedPriority.label}
          <ChevronDown size={15} className="text-slate-500" />
        </div>

        {priorityOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setPriorityOpen(false)} />
            <div className={panel}>
              {PRIORITY_FILTERS.map((p) => (
                <Item
                  key={p.value}
                  active={priorityFilter === p.value}
                  onClick={() => { onPriorityChange(p.value); setPriorityOpen(false) }}
                >{p.label}</Item>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative min-w-[220px]">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Project
        </label>

        <div onClick={() => setProjectOpen(true)} className={box(projectOpen)}>
          <span className="truncate">
            {selectedProject ? selectedProject.title : "All Projects"}
          </span>
          <ChevronDown size={15} className="text-slate-500 shrink-0" />
        </div>

        {projectOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setProjectOpen(false)} />
            <div className={`${panel} max-h-[280px] overflow-y-auto`}>
              <Item
                active={!projectFilter}
                onClick={() => { onProjectChange(""); setProjectOpen(false) }}
              >All Projects</Item>

              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { onProjectChange(String(p.id)); setProjectOpen(false) }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] font-medium transition-colors duration-150 ${
                    parseInt(projectFilter) === p.id ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                    <Folder size={12} />
                  </span>
                  <span className="truncate">{p.title}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {(statusFilter || priorityFilter || projectFilter) && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  )
}

export default TaskFilter;