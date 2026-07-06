import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { Zap } from "lucide-react";

function Login() {
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

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1.05fr_1fr] bg-[#0A0D16] font-sans text-white">
      <aside className="relative overflow-hidden text-white flex flex-col justify-between p-6 md:p-14 min-h-50 md:min-h-screen bg-[radial-gradient(900px_500px_at_15%_20%,rgba(129,140,248,0.35),transparent_60%),radial-gradient(700px_500px_at_90%_90%,rgba(168,85,247,0.30),transparent_60%),linear-gradient(160deg,#0b1020_0%,#131a35_55%,#1a1147_100%)]">

        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 30%, #000 40%, transparent 75%)",
            maskImage:
              "radial-gradient(ellipse at 30% 30%, #000 40%, transparent 75%)",
          }}
        />

        <div className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 rounded-full bg-indigo-500 opacity-55 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-14 -right-10 w-72 h-72 rounded-full bg-fuchsia-500 opacity-50 blur-3xl animate-pulse [animation-duration:6s]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-linear-to-br from-indigo-400 to-fuchsia-500 shadow-[0_10px_30px_rgba(129,140,248,.45)]">
            <Zap size={18} className="text-white" fill="currentColor" />
          </div>
          <div className="font-semibold tracking-wide">Nexus</div>
        </div>

        <div className="relative z-10 max-w-lg hidden md:block">
          <span className="inline-block text-[11px] tracking-[0.22em] uppercase text-indigo-200 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            Centralized Workspace
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold leading-tight tracking-tight mb-4">
            One quiet place for{" "}
            <em className="not-italic bg-linear-to-r from-indigo-200 to-fuchsia-300 bg-clip-text text-transparent">
              everything
            </em>{" "}
            your team ships.
          </h2>
          <p className="text-slate-300 text-[15px] leading-relaxed">
            Bring projects, docs, and decisions into a single focused surface —
            built for calm, fast work.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex justify-between items-center text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Nexus</span>
          <span>Secure by design</span>
        </div>
      </aside>

      <main className="relative grid place-items-center overflow-hidden p-6 sm:p-8 md:p-12 bg-[#0A0D16]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-105 w-105 rounded-full bg-purple-600/10 blur-[140px]" />
          <div className="absolute bottom-0 -left-40 h-105 w-105 rounded-full bg-indigo-600/10 blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-105 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-[11px] tracking-[0.22em] uppercase text-slate-500 mb-2.5">
            Welcome back
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleLogin} noValidate className="space-y-4">

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-white/20 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-300 hover:text-indigo-200 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                required
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-white/20 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-b from-purple-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
            Protected by industry-standard encryption.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;