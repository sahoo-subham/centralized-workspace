import { useState } from "react";
import { register } from "../services/authService";

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

  const form = (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Full Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
        >
          <option value="member">Member</option>
          <option value="team_lead">Team Lead</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account →"}
        </button>
      </div>
    </div>
  );

  if (onSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
        <div className="w-full max-w-lg rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-7 border-b border-gray-700 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-indigo-500/20">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Register New Member
                </h2>

                <p className="text-sm text-gray-400">
                  Create a new user account.
                </p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="h-9 w-9 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="p-7">{form}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-indigo-500/20 border-b border-gray-700">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
            ⚡
          </div>

          <h1 className="mt-5 text-2xl font-bold text-white">
            Register New User
          </h1>
          <p className="mt-2 text-sm text-gray-400">Admin access only</p>
        </div>
        <div className="p-8">{form}</div>
      </div>
    </div>
  );
}
