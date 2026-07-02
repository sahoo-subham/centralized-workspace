// import { useState } from "react";
// import api from "../../services/api";

// export default function CreateTeamForm({ onCreated, onCancel }) {
//   const [teamName, setTeamName] = useState("");
//   const [teamDesc, setTeamDesc] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!teamName.trim()) return;

//     const user = JSON.parse(localStorage.getItem("user"));

//     try {
//       setLoading(true);

//       await api.post("/teams/", {
//         team_name: teamName,
//         description: teamDesc,
//         created_by: user?.id,
//       });

//       setTeamName("");
//       setTeamDesc("");
//       onCreated();

//     } catch (err) {
//       console.error("Failed to create team", err);

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
//       <div className="w-full max-w-xl rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
//         <div className="flex items-center justify-between p-7 border-b border-gray-700 bg-linear-to-br from-indigo-500/20 via-purple-500/10 to-indigo-500/20">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
//               🏷️
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">
//                 Create New Team
//               </h2>
//               <p className="text-sm text-gray-400 mt-1">
//                 Set up a new team and start collaborating.
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onCancel}
//             className="h-9 w-9 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-7 space-y-5">
//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//               Team Name
//             </label>
//             <input
//               type="text"
//               value={teamName}
//               onChange={(e)=>setTeamName(e.target.value)}
//               placeholder="e.g. Frontend Team"
//               className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//               Description
//             </label>
//             <textarea
//               value={teamDesc}
//               onChange={(e)=>setTeamDesc(e.target.value)}
//               placeholder="What does this team do?"
//               rows="4"
//               className="mt-2 w-full resize-none rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-5 border-t border-gray-700">
//             <button
//               onClick={onCancel}
//               className="px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
//             >
//               {loading ? "Creating..." : "Create Team →"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2E1F]/30 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl border border-[#E5DBC9] bg-white shadow-[0_30px_80px_rgba(80,63,32,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-4 p-7 border-b border-[#EFE8DE] bg-gradient-to-br from-purple-50 via-[#F7F2EA] to-purple-50">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-purple-200 text-purple-600 shadow-sm">
              <Tag size={24} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Create New Team</h2>
              <p className="text-sm text-stone-500 mt-1">
                Set up a new team and start collaborating.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E5DBC9] text-stone-400 transition-colors duration-200 hover:bg-[#F7F2EA] hover:text-stone-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-7 space-y-5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Frontend Team"
              className="mt-2.5 w-full rounded-2xl bg-[#F9F6F0] border border-[#E5DBC9] px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Description
            </label>
            <textarea
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              placeholder="What does this team do?"
              rows="4"
              className="mt-2.5 w-full resize-none rounded-2xl bg-[#F9F6F0] border border-[#E5DBC9] px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 leading-relaxed focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-[#EFE8DE]">
            <button
              onClick={onCancel}
              className="rounded-xl border border-[#E5DBC9] bg-white px-5 py-3 text-sm font-semibold text-stone-600 transition-all duration-200 hover:bg-[#F7F2EA] hover:text-stone-900"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(124,58,237,0.15),0_8px_20px_-4px_rgba(124,58,237,0.35)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.3),0_10px_28px_-4px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating..." : "Create Team →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}