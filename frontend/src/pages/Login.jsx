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

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[1.05fr_1fr] bg-slate-50 font-sans text-slate-900">
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
          <div className="w-10 h-10 rounded-xl grid place-items-center text-lg bg-linear-to-br from-indigo-400 to-fuchsia-500 shadow-[0_10px_30px_rgba(129,140,248,.45)] ring-1 ring-white/20">
            ⚡
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

      
      <main className="grid place-items-center p-6 sm:p-8 md:p-12 bg-linear-to-br from-slate-50 to-white">
        <div className="w-full max-w-105 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-[11px] tracking-[0.22em] uppercase text-slate-500 mb-2.5">
            Welcome back
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-2"
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
                className="w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 px-4 py-3 outline-hidden transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
              />
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:underline"
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
                className="w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 px-4 py-3 outline-hidden transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
              />
            </div>

           
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3.5 py-2.5 text-sm">
                {error}
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white bg-linear-to-br from-indigo-600 to-indigo-500 shadow-[0_10px_24px_rgba(79,70,229,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(79,70,229,0.38)] hover:from-indigo-700 hover:to-indigo-600 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
