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
    borderRadius: "14px",
    color: "#fff",
    fontSize: "14px",
    padding: "14px 16px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "all .25s ease",
  };

  return (
    <>
      <style>
        {`

    @keyframes float1 {
      0%,100%{
        transform:translateY(0);
      }
      50%{
        transform:translateY(35px);
      }
    }

    @keyframes float2 {

      0%,100%{
        transform:translateY(0);
      }

      50%{
        transform:translateY(-40px);
      }

    }

    @keyframes pulseGlow {
      0%,100%{
        transform:scale(1);
        box-shadow:
        0 0 20px rgba(99,102,241,.4);

      }

      50%{

        transform:scale(1.08);

        box-shadow:
        0 0 40px rgba(99,102,241,.8);

      }

    }

    @keyframes cardFloat {

      0%,100%{

        transform:translateY(0);
      }
      50%{

        transform:translateY(-8px);

      }
    }

    `}
      </style>

      <div
        style={{
          minHeight: "100vh",

          background: `
      radial-gradient(circle at top left,
      rgba(99,102,241,.18),
      transparent 35%),

      radial-gradient(circle at bottom right,
      rgba(168,85,247,.18),
      transparent 35%),

      #0f1117
      `,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(99,102,241,.25)",
            filter: "blur(90px)",
            animation: "float1 8s infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-120px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(168,85,247,.25)",
            filter: "blur(90px)",
            animation: "float2 10s infinite",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(26,31,46,.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "26px",
            overflow: "hidden",
            boxShadow: "0 30px 100px rgba(0,0,0,.6)",
            animation: "cardFloat 5s infinite",
          }}
        >

          <div
            style={{
              padding: "35px",

              textAlign: "center",

              borderBottom: "1px solid #2d3348",

              background:
                "linear-gradient(135deg,rgba(99,102,241,.25),rgba(168,85,247,.15))",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "rgba(99,102,241,.2)",
                border: "1px solid rgba(99,102,241,.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 16px",
                fontSize: "30px",
                animation: "pulseGlow 2.5s infinite",
              }}
            >
              ⚡
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              Centralized Workspace
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
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
                  fontWeight: "700",
                  letterSpacing: "1px",
                }}
              >
                EMAIL
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";

                  e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3f4659";

                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <label
                  style={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  PASSWORD
                </label>

                <Link
                  to="/forgot-password"
                  style={{
                    color: "#818cf8",
                    fontSize: "12px",
                  }}
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
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";

                  e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3f4659";

                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,.1)",
                  border: "1px solid rgba(239,68,68,.2)",
                  color: "#fca5a5",
                  padding: "12px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "14px",
                border: "none",
                background: "#4f46e5",
                color: "#fff",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: ".3s",
                boxShadow: "0 15px 35px rgba(79,70,229,.4)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.background = "#4338ca";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#4f46e5";
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
