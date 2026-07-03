import { useState, useEffect } from "react";
import api from "../services/api";
import UploadDocumentForm from "../components/documents/UploadDocumentForm";
import DocumentFilter from "../components/documents/DocumentFilter";
import DocumentTable from "../components/documents/DocumentTable";
import { useRole } from "../hooks/useRole";
import { FileText, Plus, ChevronLeft, ChevronRight } from "lucide-react";

function Documents() {
  const { canEdit, canDelete, isAdmin, isMember } = useRole();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [projectFilter, setProjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

  const fetchAllDocs = async () => {
    setLoading(true);
    try {
      let combined = [];
      let url = "/documents/?page=1";
      while (url) {
        const res = await api.get(url);
        combined = [...combined, ...(res.data?.results ?? [])];
        if (res.data?.next) {
          const next = new URL(res.data.next);
          url = `/documents/?${next.searchParams.toString()}`;
        } else url = null;
      }
      setAllDocs(combined);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${id}/`);
      fetchAllDocs();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const afterProject = projectFilter
    ? allDocs.filter((d) => d.project === parseInt(projectFilter))
    : allDocs;

  const afterType = typeFilter
    ? afterProject.filter((d) => d.document_type === parseInt(typeFilter))
    : afterProject;

  const filteredDocs = searchFilter
    ? afterType.filter((d) =>
        d.title?.toLowerCase().includes(searchFilter.toLowerCase()),
      )
    : afterType;

  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const pagedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [projectFilter, typeFilter, searchFilter]);
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    if (totalPages === 0) setPage(1);
  }, [totalPages]);

  const projectsForFilter = Array.from(
    new Map(allDocs.map((d) => [d.project, d.project_detail])).entries(),
  ).map(([id, detail]) => ({ id, title: detail?.title ?? `Project ${id}` }));

  const typesForFilter = Array.from(
    new Map(
      allDocs
        .filter((d) => d.document_type)
        .map((d) => [d.document_type, d.document_type_detail]),
    ).entries(),
  ).map(([id, detail]) => ({ id, name: detail?.name ?? `Type ${id}` }));

  return (
    <div className="relative w-full min-h-screen bg-[#0A0D16] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-rose-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>

      <div className="relative w-full px-6 md:px-10 py-10 max-w-[1400px] mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Documents</h1>
            <p className="text-slate-400 text-sm mt-1.5">
              {isAdmin ? "Manage all documents across your organization" : "Your team documents"}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.5),0_10px_28px_-4px_rgba(124,58,237,0.65)] hover:scale-[1.02] active:scale-[0.98] w-fit"
          >
            <Plus size={16} strokeWidth={2.5} />
            Upload Document
          </button>
        </div>

        <DocumentFilter
          projects={projectsForFilter}
          docTypes={typesForFilter}
          searchFilter={searchFilter}
          projectFilter={projectFilter}
          typeFilter={typeFilter}
          onSearchChange={setSearchFilter}
          onProjectChange={setProjectFilter}
          onTypeChange={setTypeFilter}
          onClear={() => {
            setProjectFilter("");
            setTypeFilter("");
            setSearchFilter("");
          }}
        />

        {showForm && (
          <UploadDocumentForm
            onUploaded={() => {
              setShowForm(false);
              fetchAllDocs();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="h-4 w-4 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
              Loading documents...
            </div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-xl animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <FileText size={24} className="text-rose-400" strokeWidth={1.75} />
            </div>
            <p className="text-slate-200 font-semibold">No documents found</p>
            <p className="text-slate-500 text-sm mt-1.5">
              {projectFilter || typeFilter || searchFilter
                ? "Try adjusting your filters"
                : 'Click "Upload Document" to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              <DocumentTable
                documents={pagedDocs}
                onDelete={handleDelete}
                canDelete={canDelete}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === 1
                      ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <ChevronLeft size={15} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      p === page
                        ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_4px_14px_-2px_rgba(124,58,237,0.5)]'
                        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >{p}</button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === totalPages
                      ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Documents;