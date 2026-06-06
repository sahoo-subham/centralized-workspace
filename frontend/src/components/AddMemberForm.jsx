import { useState } from "react";
import api from "../services/api";

const roleSuggestions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Team Lead",
  "QA Tester",
];

export default function AddMemberForm({ teams, onAdded, onCancel }) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [memberName, setMemberName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !memberName.trim()) {
      setError("Please select a team and enter a member name.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/team-members/", {
        team: selectedTeam,
        name: memberName,
        role,
      });
      setSuccess("Member added successfully!");
      setSelectedTeam("");
      setMemberName("");
      setRole("");
      onAdded();
    } catch (err) {
      setError("Failed to add member. Please try again.");
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
                flexShrink: 0,
              }}
            >
              👥
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
                Add Team Member
              </p>
              <p
                style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
              >
                Assign a member to a team and define their role.
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
              flexShrink: 0,
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

        <form onSubmit={handleSubmit} style={{ padding: "28px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
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
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
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
                Member Name
              </label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter member name"
                style={{ ...inputStyle, color: "#fff" }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
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
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Assign a role or pick one below"
              style={{ ...inputStyle, color: "#fff" }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {roleSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    border:
                      role === item
                        ? "1px solid rgba(99,102,241,0.6)"
                        : "1px solid rgba(99,102,241,0.2)",
                    background:
                      role === item
                        ? "rgba(99,102,241,0.3)"
                        : "rgba(99,102,241,0.1)",
                    color: role === item ? "#c7d2fe" : "#a5b4fc",
                    transition: "all 0.15s",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: "16px",
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
          {success && (
            <div
              style={{
                marginTop: "16px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#86efac",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "28px",
              paddingTop: "24px",
              borderTop: "1px solid #2d3348",
            }}
          >
            <button
              type="button"
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
              type="submit"
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
              {loading ? "Adding Member..." : "Add Member →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
