import { useState } from "react";
import api from "../services/api";

export default function CreateTeamForm({ onCreated, onCancel }) {
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!teamName.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      setLoading(true);

      await api.post("/teams/", {
        team_name: teamName,
        description: teamDesc,
        created_by: user?.id,
      });

      setTeamName("");
      setTeamDesc("");
      onCreated();

    } catch (err) {
      console.error("Failed to create team", err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-7 border-b border-gray-700 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-indigo-500/20">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
              🏷️
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Create New Team
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Set up a new team and start collaborating.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="h-9 w-9 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-7 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e)=>setTeamName(e.target.value)}
              placeholder="e.g. Frontend Team"
              className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Description
            </label>
            <textarea
              value={teamDesc}
              onChange={(e)=>setTeamDesc(e.target.value)}
              placeholder="What does this team do?"
              rows="4"
              className="mt-2 w-full resize-none rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-gray-700">
            <button
              onClick={onCancel}
              className="px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Team →"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}