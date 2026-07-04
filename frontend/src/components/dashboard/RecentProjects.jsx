const STATUS_STYLES = {
  pending:   { bg: 'bg-slate-500/15',   text: 'text-slate-300' },
  active:    { bg: 'bg-indigo-500/15',  text: 'text-indigo-300' },
  completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  on_hold:   { bg: 'bg-rose-500/15',    text: 'text-rose-300' },
}

export default function RecentProjects({ projects, loading, onViewAll }) {
  return (
    <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">📁</span>
          <h3 className="text-white font-bold text-[15px]">Recent Projects</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-slate-500 text-sm">No projects yet</p>
          </div>
        ) : (
          projects.map((p) => {
            const s = STATUS_STYLES[p.status] || STATUS_STYLES.pending
            return (
              <div
                key={p.id}
                onClick={onViewAll}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">
                    {p.team_detail?.team_name || 'No team'}
                  </p>
                </div>
                <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                  {p.status?.replace('_', ' ')}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}