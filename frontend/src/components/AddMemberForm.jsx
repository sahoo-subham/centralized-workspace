import { useState, useEffect } from "react";
import api from "../services/api";

const roleSuggestions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Team Lead",
  "QA Tester",
];

export default function AddMemberForm({ team, teams, onAdded, onCancel }) {
  const isLocked = !!team;
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(team?.id || "");
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let allUsers = [];
        let url = "/users/?page=1";

        while (url) {
          const res = await api.get(url);

          allUsers = [...allUsers, ...(res.data?.results ?? res.data ?? [])];

          if (res.data?.next) {
            const next = new URL(res.data.next);
            url = `/users/?${next.searchParams.toString()}`;
          } else {
            url = null;
          }
        }

        setUsers(allUsers);
      } catch {}
    };
    fetchUsers();
  }, []);

  const existingMemberIds = isLocked
    ? (team.members?.map((m) => m.user) ?? [])
    : [];

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();

    return (
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  });

  const selectedUserObj = users.find((u) => u.id === Number(selectedUser));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam || !selectedUser) {
      setError("Please select a member.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/team-members/", {
        team: selectedTeam,
        user: selectedUser,
        role,
      });

      setSuccess("Member added successfully!");
      setSelectedUser("");
      setRole("");

      onAdded();
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          "This user is already a member of this team.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-5 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-7 border-b border-gray-700 bg-linear-to-br from-indigo-500/20 via-purple-500/10 to-indigo-500/20">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
              👥
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Add Team Member</h2>
              <p className="text-sm text-gray-400 mt-1">
                {isLocked
                  ? `Adding member to ${team.team_name}`
                  : "Assign user to team with role"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="h-9 w-9 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase">
              Team
            </label>
            {isLocked ? (
              <div className="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-gray-400 border border-gray-700">
                {team.team_name}
              </div>
            ) : (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
              >
                <option value="">Choose a team</option>
                {teams?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.team_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="relative">
            <label className="text-xs text-gray-400 font-semibold uppercase">
              Select Member
            </label>
            <div
              onClick={() => setDropdownOpen(true)}
              className={`mt-2 flex items-center gap-3 rounded-xl bg-gray-800 border px-4 py-3 cursor-pointer transition ${
                dropdownOpen ? "border-indigo-500" : "border-gray-700"
              }`}
            >
              {selectedUserObj && !dropdownOpen ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                    {selectedUserObj.name?.[0]}
                  </div>
                  <span className="text-white flex-1">
                    {selectedUserObj.name}
                  </span>
                  ▾
                </>
              ) : (
                <>
                  🔍
                  <input
                    autoFocus={dropdownOpen}
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setDropdownOpen(true);
                    }}
                    placeholder="Search user..."
                    className="flex-1 bg-transparent outline-none text-white"
                  />
                </>
              )}
            </div>
            {dropdownOpen && (
              <>
                <div
                  onClick={() => setDropdownOpen(false)}
                  className="fixed inset-0 z-40"
                />
                <div className="absolute top-full mt-2 w-full z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2">
                  {filteredUsers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center p-4">
                      No users found
                    </p>
                  ) : (
                    filteredUsers.map((u) => {
                      const already = existingMemberIds.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            if (already) return;
                            setSelectedUser(String(u.id));
                            setUserSearch("");
                            setDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition ${
                            already
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-indigo-500/10 cursor-pointer"
                          }`}
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                            {u.name?.[0]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                          {already && (
                            <span className="text-xs text-green-300 bg-green-500/10 px-3 py-1 rounded-full">
                              Already
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase">
              Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter role"
              className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {roleSuggestions.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    role === r
                      ? "bg-indigo-500 text-white"
                      : "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl p-3 text-sm">
              {success}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Member →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
