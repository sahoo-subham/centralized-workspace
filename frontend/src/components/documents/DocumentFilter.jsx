import { Search, X } from "lucide-react";

function DocumentFilter({
  projects,
  docTypes,
  searchFilter,
  projectFilter,
  typeFilter,
  onSearchChange,
  onProjectChange,
  onTypeChange,
  onClear,
}) {

  const fieldBase = "rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const optionClass = "bg-[#111524] text-white"

  const anyActive = searchFilter || projectFilter || typeFilter;

  return (
    <div className="flex gap-4 mb-8 flex-wrap items-end">

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Search
        </label>

        <div className={`flex items-center gap-2.5 min-w-[220px] ${fieldBase} ${fieldNormal} focus-within:border-purple-500/60 focus-within:ring-4 focus-within:ring-purple-500/10`}>
          <Search size={15} className="text-slate-500 shrink-0" />

          <input
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
          />

          {searchFilter && (
            <button
              onClick={() => onSearchChange("")}
              className="shrink-0 text-slate-500 transition-colors duration-200 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Project
        </label>

        <select
          value={projectFilter}
          onChange={(e) => onProjectChange(e.target.value)}
          className={`${fieldBase} ${fieldNormal} min-w-[180px] block cursor-pointer`}
        >
          <option value="" className={optionClass}>All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id} className={optionClass}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Type
        </label>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className={`${fieldBase} ${fieldNormal} min-w-[180px] block cursor-pointer`}
        >
          <option value="" className={optionClass}>All Types</option>
          {docTypes.map((t) => (
            <option key={t.id} value={t.id} className={optionClass}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {anyActive && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <X size={14} /> Clear
        </button>
      )}

    </div>
  )
}

export default DocumentFilter