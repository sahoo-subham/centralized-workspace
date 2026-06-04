import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "32px",
          border: "0.5px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ margin: "0 0 4px" }}>Welcome back</h2>
        <p style={{ margin: "0 0 20px", fontSize: "14px", color: "gray" }}>
          Log in to your workspace
        </p>

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <label style={{ fontSize: "13px" }}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontSize: "13px" }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "10px", fontWeight: "500" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", marginTop: "16px" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}




