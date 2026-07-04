import { useState } from "react";
import { register } from "../services/authService";
import { UserPlus, Zap, X, CheckCircle2 } from "lucide-react";

export default function Register({ onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, role);
      setSuccess("User created successfully!");
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldBase = "mt-2.5 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const optionClass = "bg-[#111524] text-white"
  const label = "text-[11px] font-semibold uppercase tracking-wider text-slate-400"

  const form = (
    <div className="space-y-5">
      <div>
        <label className={label}>Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className={`${fieldBase} ${fieldNormal}`}
        />
      </div>

      <div>
        <label className={label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`${fieldBase} ${fieldNormal}`}
        />
      </div>

      <div>
        <label className={label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={`${fieldBase} ${fieldNormal}`}
        />
      </div>

      <div>
        <label className={label}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`${fieldBase} ${fieldNormal} cursor-pointer`}
        >
          <option value="member" className={optionClass}>Member</option>
          <option value="team_lead" className={optionClass}>Team Lead</option>
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Creating..." : "Create Account →"}
        </button>
      </div>
    </div>
  );

  if (onSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

          <div className="flex items-center justify-between gap-4 p-7 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
                <UserPlus size={24} strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Register New Member</h2>
                <p className="text-sm text-slate-400 mt-1">Create a new user account.</p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-7">{form}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0D16] flex items-center justify-center px-6 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute bottom-0 -right-40 h-[480px] w-[480px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 border-b border-white/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <Zap size={28} strokeWidth={1.75} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-white">Register New User</h1>
          <p className="mt-2 text-sm text-slate-400">Admin access only</p>
        </div>
        <div className="p-8">{form}</div>
      </div>
    </div>
  );
}