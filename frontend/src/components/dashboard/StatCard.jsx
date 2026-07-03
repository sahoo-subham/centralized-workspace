
const COLORS = {
  indigo:  { from: 'from-indigo-500/10',  border: 'border-indigo-500/20', icon: 'bg-indigo-500/15 text-indigo-400',  ring: 'hover:border-indigo-500/50', glow: 'hover:shadow-indigo-500/10' },
  emerald: { from: 'from-emerald-500/10', border: 'border-emerald-500/20', icon: 'bg-emerald-500/15 text-emerald-400', ring: 'hover:border-emerald-500/50', glow: 'hover:shadow-emerald-500/10' },
  amber:   { from: 'from-amber-500/10',   border: 'border-amber-500/20', icon: 'bg-amber-500/15 text-amber-400',   ring: 'hover:border-amber-500/50', glow: 'hover:shadow-amber-500/10' },
  rose:    { from: 'from-rose-500/10',    border: 'border-rose-500/20', icon: 'bg-rose-500/15 text-rose-400',    ring: 'hover:border-rose-500/50', glow: 'hover:shadow-rose-500/10' },
}

export default function StatCard({ icon, label, value, color, loading, onClick }) {
  const c = COLORS[color] || COLORS.indigo

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left
        bg-gradient-to-br ${c.from} to-transparent
        border ${c.border} ${c.ring}
        rounded-2xl p-5
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-xl ${c.glow}
        group cursor-pointer
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${c.icon}`}>
          {icon}
        </div>

        {/* Text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-12 rounded-md bg-white/5 animate-pulse" />
          ) : (
            <p className="text-3xl font-extrabold text-white leading-none tracking-tight">
              {value ?? '—'}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-3 text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
        Click to view {label.toLowerCase()} →
      </p>
    </button>
  )
}