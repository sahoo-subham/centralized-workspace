import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";

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

  const fieldBase = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
  const label = "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2"

  return (
    <div className="relative min-h-screen bg-[#0A0D16] flex items-center justify-center px-6 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-130 w-130 rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute bottom-0 -right-40 h-120 w-120 rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-105 rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">

        <div className="p-8 text-center bg-linear-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 border-b border-white/10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <KeyRound size={24} strokeWidth={1.75} />
          </div>
          <p className="text-[22px] font-bold text-white m-0">Forgot Password?</p>
          <p className="mt-1.5 text-[13px] text-slate-400">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div className="p-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
                <Mail size={24} />
              </div>
              <p className="text-base font-semibold text-white m-0 mb-2">Check your email</p>
              <p className="text-[13px] text-slate-400 m-0 mb-6">
                If this email exists, a reset link has been sent.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-300 no-underline hover:text-indigo-200"
              >
                <ArrowLeft size={13} /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={label}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${fieldBase} ${fieldNormal}`}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-center text-[13px] text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-linear-to-b from-purple-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>

              <p className="text-center text-[13px] text-slate-500 m-0">
                <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-indigo-300 no-underline hover:text-indigo-200">
                  <ArrowLeft size={13} /> Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}