import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ResetPassword() {
  const { uid, token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirm) {
      setError('Please fill in both fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password/', { uid, token, password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'This reset link is invalid or has expired.')
    } finally {
      setLoading(false)
    }
  }

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
            <Lock size={24} strokeWidth={1.75} />
          </div>
          <p className="text-[22px] font-bold text-white m-0">Reset Password</p>
          <p className="mt-1.5 text-[13px] text-slate-400">
            Enter a new password for your account.
          </p>
        </div>

        <div className="p-8">

          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
                <CheckCircle2 size={26} />
              </div>
              <p className="text-base font-semibold text-white m-0 mb-2">Password reset successful</p>
              <p className="text-[13px] text-slate-400 m-0 mb-6">
                You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-2xl bg-linear-to-b from-purple-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Login →
              </button>
            </div>

          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div>
                <label className={label}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${fieldBase} ${fieldNormal}`}
                />
              </div>

              <div>
                <label className={label}>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? 'Resetting...' : 'Reset Password →'}
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
  )
}