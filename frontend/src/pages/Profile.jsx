import { useState } from 'react'

const ROLE_STYLES = {
  admin:     { bg: 'bg-red-500/15',    text: 'text-red-300',    label: 'Admin' },
  team_lead: { bg: 'bg-amber-500/15',  text: 'text-amber-300',  label: 'Team Lead' },
  member:    { bg: 'bg-indigo-500/15', text: 'text-indigo-300', label: 'Member' },
}

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const roleStyle = ROLE_STYLES[currentUser?.role] || ROLE_STYLES.member
  const initial = currentUser?.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 md:px-10 py-10">

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8">
        Your Profile
      </h1>

      <div className="max-w-2xl">

        <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">

          <div className="h-24 bg-gradient-to-r from-indigo-600/30 to-violet-600/20 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-4 border-slate-900 flex items-center justify-center text-2xl font-extrabold text-white">
                {initial}
              </div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold text-white">{currentUser?.name || 'Unnamed User'}</h2>
                <p className="text-slate-400 text-sm mt-1">{currentUser?.email}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${roleStyle.bg} ${roleStyle.text}`}>
                {roleStyle.label}
              </span>
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Full Name</p>
                <p className="text-slate-200 text-sm">{currentUser?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Email Address</p>
                <p className="text-slate-200 text-sm">{currentUser?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Role</p>
                <p className="text-slate-200 text-sm capitalize">{currentUser?.role?.replace('_', ' ') || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">User ID</p>
                <p className="text-slate-200 text-sm">#{currentUser?.id ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile;