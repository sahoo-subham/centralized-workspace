import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#94a3b8' },
  active:    { label: 'Active',    color: '#6366f1' },
  completed: { label: 'Completed', color: '#10b981' },
  on_hold:   { label: 'On Hold',   color: '#f43f5e' },
}

export default function ProjectStatusChart({ projects, loading }) {

  const counts = { pending: 0, active: 0, completed: 0, on_hold: 0 }
  projects.forEach((p) => {
    if (counts[p.status] !== undefined) counts[p.status]++
  })

  const data = Object.entries(counts).map(([key, value]) => ({
    name: STATUS_CONFIG[key].label,
    value,
    color: STATUS_CONFIG[key].color,
  }))

  const total = projects.length

  return (
    <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">📈</span>
          <h3 className="text-white font-bold text-[15px]">Project Status</h3>
        </div>
        {!loading && (
          <span className="text-indigo-400 text-xs font-bold bg-indigo-500/15 px-3 py-1 rounded-full">
            {total} total
          </span>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="h-56 rounded-xl bg-white/[0.03] animate-pulse" />
        ) : total === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-slate-500 text-sm">No projects to show</p>
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#2d3348' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#1a1f2e', border: '1px solid #2d3348', borderRadius: '10px', fontSize: '12px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}