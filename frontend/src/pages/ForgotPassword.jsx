import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password/", { email });
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1a1f2e",
          border: "1px solid #2d3348",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)",
            borderBottom: "1px solid #2d3348",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              margin: "0 auto 16px",
            }}
          >
            🔑
          </div>
          <p
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: "22px",
              margin: 0,
            }}
          >
            Forgot Password?
          </p>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div style={{ padding: "32px" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📧</div>
              <p
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "16px",
                  margin: "0 0 8px",
                }}
              >
                Check your email
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  margin: "0 0 24px",
                }}
              >
                If this email exists, a reset link has been sent.
              </p>
              <Link
                to="/login"
                style={{
                  color: "#818cf8",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
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
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    background: "#232938",
                    border: "1px solid #3f4659",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "14px",
                    padding: "13px 16px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
                />
              </div>

              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "#fca5a5",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#4338ca" : "#4f46e5",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "14px",
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
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                <Link
                  to="/login"
                  style={{
                    color: "#818cf8",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  ← Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
