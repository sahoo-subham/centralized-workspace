import { useState } from "react";
import { Folder, FolderOpen, Search, ChevronDown, Users, X, ListFilter } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

export default function ProjectFilter({
  teams,
  statusFilter,
  teamFilter,
  onStatusChange,
  onTeamChange,
  onClear,
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");

  const selectedTeam = teams.find((t) => t.id === parseInt(teamFilter));

  const filteredTeams = teams.filter((t) =>
    t.team_name?.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  const box = "flex items-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl text-white transition-all duration-200 hover:border-white/20";

  return (
    <div className="flex gap-4 mb-8 flex-wrap items-end">
      <div className="relative w-52">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Status
        </label>
        <div
          onClick={() => setStatusOpen(true)}
          className={`${box} px-4 py-3 cursor-pointer justify-between ${statusOpen ? 'border-purple-500/60 ring-4 ring-purple-500/10' : ''}`}
        >
          <span className="text-sm">
            {STATUS_FILTERS.find((s) => s.value === statusFilter)?.label}
          </span>
          <ChevronDown size={15} className="text-slate-500" />
        </div>
        {statusOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setStatusOpen(false)} />
            <div className="absolute z-[61] top-[calc(100%+6px)] w-full rounded-2xl border border-white/10 bg-[#111524]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              {STATUS_FILTERS.map((s) => (
                <div
                  key={s.value}
                  onClick={() => { onStatusChange(s.value); setStatusOpen(false) }}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer text-[13px] font-medium transition-colors duration-150 ${
                    statusFilter === s.value
                      ? 'bg-purple-500/15 text-purple-300'
                      : 'text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative w-64">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Filter by Team
        </label>
        <div
          onClick={() => setTeamOpen(true)}
          className={`${box} gap-2.5 px-4 py-3 cursor-pointer ${teamOpen ? 'border-purple-500/60 ring-4 ring-purple-500/10' : ''}`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
            <Folder size={12} />
          </span>
          <span className="flex-1 truncate text-sm">
            {selectedTeam ? selectedTeam.team_name : "All Teams"}
          </span>
          <ChevronDown size={15} className="text-slate-500" />
        </div>
        {teamOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setTeamOpen(false)} />
            <div className="absolute z-[61] top-[calc(100%+6px)] w-full max-h-[300px] overflow-y-auto rounded-2xl border border-white/10 bg-[#111524]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 mb-1.5">
                <Search size={14} className="text-slate-500 shrink-0" />
                <input
                  autoFocus
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search teams..."
                  className="bg-transparent outline-none w-full text-white text-sm placeholder:text-slate-500"
                />
              </div>

              <div
                onClick={() => { onTeamChange(""); setTeamOpen(false); setTeamSearch("") }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] font-medium transition-colors duration-150 ${
                  !teamFilter ? 'bg-purple-500/15 text-purple-300' : 'text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <FolderOpen size={14} /> All Teams
              </div>

              {filteredTeams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { onTeamChange(String(t.id)); setTeamOpen(false); setTeamSearch("") }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                    parseInt(teamFilter) === t.id ? 'bg-purple-500/15' : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                    <Folder size={12} />
                  </span>
                  <p className="flex-1 min-w-0 truncate text-[13px] font-semibold text-slate-200">
                    {t.team_name}
                  </p>
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                    <Users size={11} /> {t.members?.length ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {(statusFilter || teamFilter) && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  );
}
