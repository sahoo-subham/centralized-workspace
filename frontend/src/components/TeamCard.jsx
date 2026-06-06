import api from "../services/api";

function TeamCard({ team, onDelete }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e2433 0%, #1a1f2e 100%)",
        border: "1px solid #2d3348",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {team.team_name}
          </p>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
            {team.description || "No description"}
          </p>
        </div>

        <button
          onClick={() => onDelete(team.id)}
          style={{
            background: "transparent",
            border: "1px solid #374151",
            color: "#6b7280",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#f87171";
            e.target.style.borderColor = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#6b7280";
            e.target.style.borderColor = "#374151";
          }}
        >
          Delete
        </button>
      </div>

      <div style={{ borderTop: "1px solid #2d3348" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            background: "rgba(99,102,241,0.15)",
            borderRadius: "8px",
            padding: "6px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#818cf8"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-5-4.9M9 20H4v-2a4 4 0 015-4.9m6-3.1a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <span style={{ color: "#d1d5db", fontSize: "13px", fontWeight: "600" }}>
          {team.members?.length ?? 0} member
          {team.members?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {team.members?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {team.members.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "10px",
                padding: "8px 12px",
              }}
            >
              <p
                style={{
                  color: "#e5e7eb",
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {m.name}
              </p>

              {m.role && (
                <span
                  style={{
                    background: "rgba(99,102,241,0.2)",
                    color: "#a5b4fc",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.role}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamCard;
