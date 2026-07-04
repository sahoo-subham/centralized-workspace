import { useState } from "react";
import api from "../../services/api";
import { Tag, X } from "lucide-react";

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

  const fieldBase = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-4 p-7 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Tag size={24} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Team</h2>
              <p className="text-sm text-slate-400 mt-1">
                Set up a new team and start collaborating.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-7 space-y-5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Frontend Team"
              className={`mt-2.5 ${fieldBase} ${fieldNormal}`}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <textarea
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              placeholder="What does this team do?"
              rows="4"
              className={`mt-2.5 ${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-white/10">
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating..." : "Create Team →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}