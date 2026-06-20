import React, { useState } from "react";

const Support = () => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-3xl">
            💬
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Contact Support
          </h1>

          <p className="mt-3 text-gray-400">
            Need help? Send us your issue and our team will get back to you.
          </p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center text-green-300">
            ✅ Message sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="your@email.com"
                className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Message
              </label>

              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your problem..."
                rows="5"
                className="mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none resize-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-500 py-3 text-white font-semibold hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30"
            >
              Send Request →
            </button>

          </form>
        )}
      </div>
    </main>
  );
};

export default Support;