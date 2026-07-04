const STATUS_STYLES = {
  pending:     { bg: 'bg-slate-500/15',  text: 'text-slate-300' },
  in_progress: { bg: 'bg-amber-500/15',  text: 'text-amber-300' },
  completed:   { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
}

const PRIORITY_STYLES = {
  low:    { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  medium: { bg: 'bg-amber-500/15',   text: 'text-amber-300' },
  high:   { bg: 'bg-rose-500/15',    text: 'text-rose-300' },
}

export default function RecentTasks({ tasks, loading, onViewAll }) {
  return (
    <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✅</span>
          <h3 className="text-white font-bold text-[15px]">Recent Tasks</h3>
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
        ) : tasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-slate-500 text-sm">No tasks yet</p>
          </div>
        ) : (
          tasks.map((t) => {
            const s = STATUS_STYLES[t.status] || STATUS_STYLES.pending
            const p = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.low
            return (
              <div
                key={t.id}
                onClick={onViewAll}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 text-sm font-semibold truncate">{t.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">
                    {t.project_detail?.title || 'No project'}
                    {t.due_date && <span className="text-slate-600"> · Due {t.due_date}</span>}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 ml-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${p.bg} ${p.text}`}>
                    {t.priority}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                    {t.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}