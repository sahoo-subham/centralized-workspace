import { useState, useEffect } from "react";
import api from "../services/api";

function CreateProjectForm({ onCreated, onCancel }) {
  const [teams, setTeams] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/teams/");
        setTeams(res.data?.results ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !team) {
      setError("Title and Team are required.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await api.post("/projects/", {
        title,
        description,
        team,
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: user?.id,
      });
      onCreated();
    } catch (err) {
      const apiError = err.response?.data?.end_date?.[0];
      setError(apiError || "Failed to create project. Please try again.");
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
          maxWidth: "620px",
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
              📁
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
                Create New Project
              </p>
              <p
                style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
              >
                Set up a new project for a team.
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
            <label
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Website"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this project about?"
              style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
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
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              >
                <option value="">Choose a team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.team_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
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
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              />
            </div>

            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              />
            </div>
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
              style={{
                background: "#4f46e5",
                border: "none",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                padding: "11px 24px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#4338ca")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#4f46e5")
              }
            >
              Create Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectForm;