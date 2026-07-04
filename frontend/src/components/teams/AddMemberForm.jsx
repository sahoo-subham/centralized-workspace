import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Users, X, Search, CheckCircle2 } from 'lucide-react'

const roleSuggestions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Team Lead',
  'QA Tester',
]

export default function AddMemberForm({ team, teams, onAdded, onCancel }) {

  const isLocked = !!team

  const [users, setUsers]               = useState([])
  const [selectedTeam, setSelectedTeam] = useState(team?.id || '')
  const [selectedUser, setSelectedUser] = useState('')
  const [role, setRole]                 = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const [userSearch, setUserSearch]   = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [success, setSuccess]           = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let allUsers = []
        let url = '/users/?page=1'
        while (url) {
          const res = await api.get(url)
          allUsers = [...allUsers, ...(res.data?.results ?? res.data ?? [])]
          if (res.data?.next) {
            const nextUrl = new URL(res.data.next)
            url = `/users/?${nextUrl.searchParams.toString()}`
          } else {
            url = null
          }
        }
        setUsers(allUsers.filter((u) => u.role !== 'admin'))
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
    }
    fetchUsers()
  }, [])

  const existingMemberIds = isLocked
    ? (team.members?.map((m) => m.user) ?? [])
    : []

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  const selectedUserObj = users.find((u) => u.id === parseInt(selectedUser))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTeam || !selectedUser) {
      setError('Please select a member.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/team-members/', {
        team: selectedTeam,
        user: selectedUser,
        role: role,
      })
      setSuccess('Member added successfully!')
      setSelectedUser('')
      setRole('')
      onAdded()
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        'This user is already a member of this team.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const fieldLocked = "border-white/10 bg-white/[0.02] text-slate-500 cursor-not-allowed"
  const optionClass = "bg-[#111524] text-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">

      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Add Team Member</p>
              <p className="mt-1 text-[13px] text-slate-400">
                {isLocked
                  ? `Adding a member to ${team.team_name}`
                  : 'Assign a registered user to a team with a role.'}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-7">

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Team
            </label>

            {isLocked ? (
              <div className={`${fieldBase} ${fieldLocked}`}>{team.team_name}</div>
            ) : (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className={`${fieldBase} ${fieldNormal}`}
              >
                <option value="" className={optionClass}>Choose a team</option>
                {teams?.map((t) => (
                  <option key={t.id} value={t.id} className={optionClass}>{t.team_name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-5 relative">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Select Member
            </label>

            <div
              onClick={() => setDropdownOpen(true)}
              className={`flex items-center gap-2.5 cursor-pointer ${fieldBase} ${
                dropdownOpen ? 'border-purple-500/60 ring-4 ring-purple-500/10' : fieldNormal
              }`}
            >
              {selectedUserObj && !dropdownOpen ? (
                <>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[12px] font-bold text-purple-300">
                    {selectedUserObj.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-white truncate">
                    {selectedUserObj.name} — {selectedUserObj.email}
                  </span>
                  <span className="text-slate-500 text-xs">▾</span>
                </>
              ) : (
                <>
                  <Search size={15} className="text-slate-500 shrink-0" />
                  <input
                    autoFocus={dropdownOpen}
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setDropdownOpen(true) }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search by name or email..."
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
                  />
                </>
              )}
            </div>

            {dropdownOpen && (
              <>
                <div
                  onClick={() => setDropdownOpen(false)}
                  className="fixed inset-0 z-[60]"
                />
                <div className="absolute z-[61] left-0 right-0 top-[calc(100%+6px)] max-h-[260px] overflow-y-auto rounded-2xl border border-white/10 bg-[#161b2c]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {filteredUsers.length === 0 ? (
                    <p className="py-4 text-center text-[13px] text-slate-500 m-0">No users found.</p>
                  ) : (
                    filteredUsers.map((u) => {
                      const alreadyMember = existingMemberIds.includes(u.id)
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            if (alreadyMember) return
                            setSelectedUser(String(u.id))
                            setUserSearch('')
                            setDropdownOpen(false)
                          }}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-150 ${
                            alreadyMember ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-purple-500/10'
                          } ${parseInt(selectedUser) === u.id ? 'bg-purple-500/15' : ''}`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[12px] font-bold text-purple-300">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-slate-200 m-0">{u.name}</p>
                            <p className="truncate text-[11px] text-slate-500 m-0 mt-0.5">{u.email}</p>
                          </div>
                          {alreadyMember && (
                            <span className="whitespace-nowrap rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                              Already in team
                            </span>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mb-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Assign a role or pick one below"
              className={`${fieldBase} ${fieldNormal}`}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {roleSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border ${
                    role === item
                      ? 'border-purple-500/60 bg-purple-500/30 text-purple-200'
                      : 'border-purple-500/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                  }`}
                >{item}</button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
              <CheckCircle2 size={15} /> {success}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-7 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >{loading ? 'Adding Member...' : 'Add Member →'}</button>
          </div>

        </form>
      </div>
    </div>
  )
}