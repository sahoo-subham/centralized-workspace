import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: '#94a3b8' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  completed:   { label: 'Completed',   color: '#10b981' },
}

export default function TaskCompletionChart({ tasks, loading }) {

  const counts = { pending: 0, in_progress: 0, completed: 0 }
  tasks.forEach((t) => {
    if (counts[t.status] !== undefined) counts[t.status]++
  })

  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATUS_CONFIG[key].label,
      value,
      color: STATUS_CONFIG[key].color,
    }))

  const total = tasks.length
  const completedPct = total > 0 ? Math.round((counts.completed / total) * 100) : 0

  return (
    <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">📊</span>
          <h3 className="text-white font-bold text-[15px]">Task Completion</h3>
        </div>
        {!loading && total > 0 && (
          <span className="text-emerald-400 text-xs font-bold bg-emerald-500/15 px-3 py-1 rounded-full">
            {completedPct}% done
          </span>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="h-56 rounded-xl bg-white/[0.03] animate-pulse" />
        ) : total === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-slate-500 text-sm">No tasks to show</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3348', borderRadius: '10px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-3">
              {Object.entries(counts).map(([key, value]) => {
                const cfg = STATUS_CONFIG[key]
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      <span className="text-slate-300 text-sm">{cfg.label}</span>
                    </div>
                    <span className="text-slate-400 text-sm font-semibold">{value} <span className="text-slate-600">({pct}%)</span></span>
                  </div>
                )
              })}
              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total</span>
                <span className="text-white text-sm font-bold">{total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}