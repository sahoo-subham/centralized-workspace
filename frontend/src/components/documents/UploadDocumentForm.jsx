import { useState, useEffect } from "react";
import api from "../../services/api";
import { FileText, Folder, X, File as FileIcon } from "lucide-react";

export default function UploadDocumentForm({ onUploaded, onCancel }) {
  const [projects, setProjects] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProjects();
    fetchDocTypes();
  }, []);

  const fetchProjects = async () => {
    try {
      let allTeams = [];
      let teamUrl = "/teams/?page=1";
      while (teamUrl) {
        const res = await api.get(teamUrl);
        allTeams = [...allTeams, ...(res.data?.results ?? [])];
        if (res.data?.next) {
          const next = new URL(res.data.next);
          teamUrl = `/teams/?${next.searchParams.toString()}`;
        } else teamUrl = null;
      }

      const myTeamIds = allTeams
        .filter(
          (t) =>
            t.members?.some((m) => m.user === currentUser.id) ||
            t.created_by === currentUser.id,
        )
        .map((t) => t.id);

      let combined = [];
      let url = "/projects/?page=1";
      while (url) {
        const res = await api.get(url);
        combined = [...combined, ...(res.data?.results ?? [])];
        if (res.data?.next) {
          const next = new URL(res.data.next);
          url = `/projects/?${next.searchParams.toString()}`;
        } else url = null;
      }

      const visible =
        currentUser.role === "admin"
          ? combined
          : combined.filter((p) => myTeamIds.includes(p.team));

      setProjects(visible);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchDocTypes = async () => {
    try {
      let combined = [];
      let url = "/document-types/";
      while (url) {
        const res = await api.get(url);
        const results = res.data?.results ?? res.data ?? [];
        combined = [...combined, ...results];
        if (res.data?.next) {
          const next = new URL(res.data.next);
          url = `/document-types/?${next.searchParams.toString()}`;
        } else url = null;
      }
      setDocTypes(combined);
    } catch (err) {
      console.error("Failed to fetch document types", err);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !project || !file) {
      setError("Title, Project and File are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("project", project);
      formData.append("file", file);
      if (documentType) formData.append("document_type", documentType);

      await api.post("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded();
    } catch (err) {
      setError("Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldBase = "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const optionClass = "bg-[#111524] text-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-4 p-7 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <FileText size={24} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Upload Document</p>
              <p className="mt-1 text-[13px] text-slate-400">Attach a file to a project.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="p-7">

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Requirements"
              className={`${fieldBase} ${fieldNormal}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Project
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className={`${fieldBase} ${fieldNormal} cursor-pointer`}
              >
                <option value="" className={optionClass}>Choose a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className={optionClass}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`${fieldBase} ${fieldNormal} cursor-pointer`}
              >
                <option value="" className={optionClass}>Select type (optional)</option>
                {docTypes.map((t) => (
                  <option key={t.id} value={t.id} className={optionClass}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              File
            </label>
            <div
              onClick={() => document.getElementById("doc-file-input").click()}
              className={`flex items-center gap-3 rounded-2xl px-4 py-4 cursor-pointer transition-all duration-200 ${
                file
                  ? 'border border-purple-500/50 bg-purple-500/[0.08]'
                  : 'border border-dashed border-white/15 bg-white/[0.04] hover:border-white/25'
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300">
                {file ? <FileText size={17} /> : <Folder size={17} />}
              </div>
              <div className="flex-1 min-w-0">
                {file ? (
                  <>
                    <p className="truncate text-[13px] font-semibold text-purple-300 m-0">{file.name}</p>
                    <p className="text-[11px] text-slate-500 m-0 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <p className="text-[13px] text-slate-500 m-0">Click to choose a file</p>
                )}
              </div>
              {file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="shrink-0 text-red-400 transition-colors duration-200 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <input
              id="doc-file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="hidden"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >{loading ? "Uploading..." : "Upload Document →"}</button>
          </div>

        </div>
      </div>
    </div>
  );
}