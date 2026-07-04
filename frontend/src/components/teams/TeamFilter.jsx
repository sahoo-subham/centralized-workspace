import { useState } from 'react'
import { Folder, FolderOpen, Search, ChevronDown, Users, Layers } from 'lucide-react'

function TeamFilter({ teams, selectedTeam, onFilterChange }) {

  const [search, setSearch]       = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredTeams = teams.filter((t) =>
    t.team_name?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedTeamObj = teams.find((t) => t.id === parseInt(selectedTeam))

  return (
    <div className="w-full max-w-sm relative">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
        Filter by Team
      </label>

      <div
        onClick={() => setDropdownOpen(true)}
        className={`flex items-center gap-2.5 w-full rounded-2xl bg-white/[0.04] backdrop-blur-xl border px-4 py-3 cursor-pointer transition-all duration-200 ${
          dropdownOpen ? 'border-purple-500/60 ring-4 ring-purple-500/10' : 'border-white/10 hover:border-white/20'
        }`}
      >
        {selectedTeamObj && !dropdownOpen ? (
          <>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
              <FolderOpen size={14} />
            </span>
            <span className="flex-1 text-sm text-white truncate">{selectedTeamObj.team_name}</span>
            <ChevronDown size={15} className="text-slate-500" />
          </>
        ) : !dropdownOpen && !selectedTeam ? (
          <>
            <Folder size={16} className="text-slate-500" />
            <span className="flex-1 text-sm text-slate-400">All Teams</span>
            <ChevronDown size={15} className="text-slate-500" />
          </>
        ) : (
          <>
            <Search size={15} className="text-slate-500 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true) }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search teams..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
            />
          </>
        )}
      </div>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            className="fixed inset-0 z-[60]"
          />
          <div className="absolute z-[61] left-0 right-0 top-[calc(100%+6px)] max-h-[280px] overflow-y-auto rounded-2xl border border-white/10 bg-[#111524]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">

            <div
              onClick={() => { onFilterChange(''); setSearch(''); setDropdownOpen(false) }}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                selectedTeam === '' ? 'bg-purple-500/15' : 'hover:bg-white/[0.06]'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                <Layers size={13} />
              </span>
              <span className="text-[13px] font-semibold text-slate-200">All Teams</span>
            </div>

            <div className="my-1.5 border-t border-white/5" />

            {filteredTeams.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-slate-500">No teams found.</p>
            ) : (
              filteredTeams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { onFilterChange(String(t.id)); setSearch(''); setDropdownOpen(false) }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                    parseInt(selectedTeam) === t.id ? 'bg-purple-500/15' : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                    <Folder size={13} />
                  </span>
                  <p className="flex-1 min-w-0 truncate text-[13px] font-semibold text-slate-200">
                    {t.team_name}
                  </p>
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                    <Users size={11} /> {t.members?.length ?? 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default TeamFilter;