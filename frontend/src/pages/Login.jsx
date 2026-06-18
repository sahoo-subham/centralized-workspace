import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
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
            ⚡
          </div>
          <p
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: "22px",
              margin: 0,
            }}
          >
            Centralized Workspace
          </p>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
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
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#3f4659")}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: "#818cf8",
                  fontSize: "12px",
                  fontWeight: "500",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
                onMouseLeave={(e) => (e.target.style.color = "#818cf8")}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
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
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#4338ca";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#4f46e5";
            }}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
