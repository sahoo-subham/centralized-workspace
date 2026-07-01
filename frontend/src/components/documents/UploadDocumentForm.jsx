import { useState, useEffect } from "react";
import api from "../../services/api";

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

  const inputStyle = {
    width: "100%",
    background: "#232938",
    border: "1px solid #3f4659",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "14px",
    padding: "14px 16px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: "10px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.70)",
        backdropFilter: "blur(8px)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "24px",
          border: "1px solid #2d3348",
          background: "#1a1f2e",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)",
            borderBottom: "1px solid #2d3348",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              📄
            </div>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "20px",
                  margin: 0,
                }}
              >
                Upload Document
              </p>
              <p
                style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
              >
                Attach a file to a project.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "none",
              color: "#94a3b8",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Requirements"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              >
                <option value="">Choose a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              >
                <option value="">Select type (optional)</option>
                {docTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>File</label>
            <div
              onClick={() => document.getElementById("doc-file-input").click()}
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "16px",
                border: file
                  ? "1px solid rgba(99,102,241,0.5)"
                  : "1px dashed #3f4659",
                background: file ? "rgba(99,102,241,0.08)" : "#232938",
              }}
            >
              <span style={{ fontSize: "20px" }}>{file ? "📄" : "📁"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {file ? (
                  <>
                    <p
                      style={{
                        color: "#a5b4fc",
                        fontSize: "13px",
                        fontWeight: "600",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "11px",
                        margin: "2px 0 0",
                      }}
                    >
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                ) : (
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                    Click to choose a file
                  </p>
                )}
              </div>
              {file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    fontSize: "16px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <input
              id="doc-file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              style={{ display: "none" }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#fca5a5",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid #2d3348",
            }}
          >
            <button
              onClick={onCancel}
              style={{
                background: "#2d3348",
                border: "1px solid #3f4659",
                color: "#cbd5e1",
                fontSize: "14px",
                fontWeight: "500",
                padding: "11px 20px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#374151")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#2d3348")
              }
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? "#4338ca" : "#4f46e5",
                border: "none",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                padding: "11px 24px",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#4338ca";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#4f46e5";
              }}
            >
              {loading ? "Uploading..." : "Upload Document →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
