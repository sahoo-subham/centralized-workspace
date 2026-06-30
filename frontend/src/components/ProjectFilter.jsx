import { useState } from "react";

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

  const box = `
    bg-[#232938]
    border border-[#3f4659]
    rounded-xl
    text-white
    transition
    hover:border-indigo-500
  `;
  return (
    <div className="flex gap-4 mb-6 flex-wrap items-end">
      <div className="relative w-52">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Filter by Status
        </label>
        <div
          onClick={() => setStatusOpen(true)}
          className={`${box} px-4 py-3 cursor-pointer flex items-center justify-between`}
        >
          <span>
            {STATUS_FILTERS.find((s) => s.value === statusFilter)?.label}
          </span>
          <span className="text-gray-500">▾</span>
        </div>
        {statusOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setStatusOpen(false)}
            />
            <div
              className="
          absolute z-50 top-full mt-2 w-full
          bg-[#1f2433]
          border border-[#3f4659]
          rounded-xl
          shadow-2xl
          p-2
          "
            >
              {STATUS_FILTERS.map((s) => (
                <div
                  key={s.value}
                  onClick={() => {
                    onStatusChange(s.value);
                    setStatusOpen(false);
                  }}
                  className={`
                px-3 py-2 rounded-lg cursor-pointer text-sm
                transition
                ${
                  statusFilter === s.value
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-gray-300 hover:bg-white/10"
                }
                `}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="relative w-60">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Filter by Team
        </label>
        <div
          onClick={() => setTeamOpen(true)}
          className={`${box} px-4 py-3 flex items-center gap-3 cursor-pointer`}
        >
          📁
          <span className="flex-1 truncate text-sm">
            {selectedTeam ? selectedTeam.team_name : "All Teams"}
          </span>
          <span className="text-gray-500">▾</span>
        </div>
        {teamOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setTeamOpen(false)}
            />
            <div
              className="
        absolute z-50 top-full mt-2 w-full
        bg-[#1f2433]
        border border-[#3f4659]
        rounded-xl
        shadow-2xl
        p-2
        "
            >
              <div
                className="
          flex items-center gap-2
          bg-[#232938]
          border border-[#3f4659]
          rounded-lg
          px-3 py-2 mb-2
          "
              >
                🔍
                <input
                  autoFocus
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search teams..."
                  className="
              bg-transparent
              outline-none
              w-full
              text-white
              text-sm
              "
                />
              </div>

              <div
                onClick={() => {
                  onTeamChange("");
                  setTeamOpen(false);
                  setTeamSearch("");
                }}
                className={`
          px-3 py-2 rounded-lg cursor-pointer text-sm
          ${
            !teamFilter
              ? "bg-indigo-500/20 text-indigo-300"
              : "text-gray-300 hover:bg-white/10"
          }

          `}
              >
                📂 All Teams
              </div>

              {filteredTeams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onTeamChange(String(t.id));
                    setTeamOpen(false);
                    setTeamSearch("");
                  }}
                  className={`
              flex items-center gap-3
              px-3 py-2
              rounded-lg
              cursor-pointer
              transition

              ${
                parseInt(teamFilter) === t.id
                  ? "bg-indigo-500/20"
                  : "hover:bg-white/10"
              }

              `}
                >
                  <div>📁</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 font-medium">
                      {t.team_name}
                    </p>
                  </div>
                  <span
                    className="
              bg-indigo-500/20
              text-indigo-300
              text-xs
              px-2 py-1
              rounded-full
              "
                  >
                    👥 {t.members?.length ?? 0}
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
          className="
        px-4 py-3
        rounded-xl
        border border-[#3f4659]
        text-gray-400
        text-sm
        hover:border-red-400
        hover:text-red-400
        transition
        "
        >
          ✕ Clear filters
        </button>
      )}
    </div>
  );
}
