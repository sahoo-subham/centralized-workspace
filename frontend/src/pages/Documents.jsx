import { useState, useEffect } from "react";
import api from "../services/api";
import UploadDocumentForm from "../components/documents/UploadDocumentForm";
import DocumentFilter from "../components/documents/DocumentFilter";
import DocumentTable from "../components/documents/DocumentTable";
import { useRole } from "../hooks/useRole";

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
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Documents
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? "Manage all documents" : "Your team documents"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#4f46e5",
            border: "none",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
        >
          + Upload Document
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
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">📄</span>
          <p className="text-gray-300 font-medium">No documents found</p>
          <p className="text-gray-500 text-sm mt-1">
            {projectFilter || typeFilter || searchFilter
              ? "Try adjusting your filters"
              : 'Click "+ Upload Document" to get started'}
          </p>
        </div>
      ) : (
        <>
          <DocumentTable
            documents={pagedDocs}
            onDelete={handleDelete}
            canDelete={canDelete}
          />

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginTop: "32px",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: page === 1 ? "#1f2330" : "#2d3348",
                  border: "1px solid #3f4659",
                  color: page === 1 ? "#4b5563" : "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    background: p === page ? "#4f46e5" : "#2d3348",
                    border: "1px solid #3f4659",
                    color: p === page ? "#fff" : "#cbd5e1",
                    fontSize: "14px",
                    fontWeight: "600",
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: page === totalPages ? "#1f2330" : "#2d3348",
                  border: "1px solid #3f4659",
                  color: page === totalPages ? "#4b5563" : "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Documents;
