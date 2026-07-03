import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Folder, FolderOpen, Search, X } from 'lucide-react'

function CreateProjectForm({ onCreated, onCancel }) {
  const [teams, setTeams]             = useState([])
  const [projects, setProjects]       = useState([])
  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [team, setTeam]               = useState('')
  const [startDate, setStartDate]     = useState('')
  const [endDate, setEndDate]         = useState('')
  const [error, setError]             = useState('')

  const [teamSearch, setTeamSearch]       = useState('')
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false)

  useEffect(() => {
    fetchAllTeams()
    fetchAllProjects()
  }, [])

  const fetchAllTeams = async () => {
    try {
      let combined = []
      let url = '/teams/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/teams/?${next.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setTeams(combined)
    } catch (err) {
      console.error('Failed to fetch teams', err)
    }
  }

  const fetchAllProjects = async () => {
    try {
      let combined = []
      let url = '/projects/?page=1'
      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]
        if (res.data?.next) {
          const next = new URL(res.data.next)
          url = `/projects/?${next.searchParams.toString()}`
        } else {
          url = null
        }
      }
      setProjects(combined)
    } catch (err) {
      console.error('Failed to fetch projects', err)
    }
  }

  const teamsWithProjects = new Set(projects.map((p) => p.team))

  const filteredTeams = teams.filter((t) =>
    t.team_name?.toLowerCase().includes(teamSearch.toLowerCase())
  )

  const selectedTeamObj = teams.find((t) => t.id === parseInt(team))

  const handleSubmit = async () => {
    if (!title.trim() || !team) {
      setError('Title and Team are required.')
      return
    }
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      await api.post('/projects/', {
        title,
        description,
        team,
        status: 'pending', 
        start_date: startDate || null,
        end_date:   endDate   || null,
        created_by: user?.id,
      })
      onCreated()
    } catch (err) {
      const apiError = err.response?.data?.end_date?.[0]
      setError(apiError || 'Failed to create project. Please try again.')
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-4 p-7 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Folder size={24} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Create New Project</p>
              <p className="mt-1 text-[13px] text-slate-400">Set up a new project for a team.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="p-7">

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Website"
              className={`${fieldBase} ${fieldNormal}`}
            />
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this project about?"
              className={`${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
            />
          </div>

          <div className="mb-5 relative">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Team
            </label>

            <div
              onClick={() => setTeamDropdownOpen(true)}
              className={`flex items-center gap-2.5 cursor-pointer ${fieldBase} ${
                teamDropdownOpen ? 'border-purple-500/60 ring-4 ring-purple-500/10' : fieldNormal
              }`}
            >
              {selectedTeamObj && !teamDropdownOpen ? (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                    <Folder size={12} />
                  </span>
                  <span className="text-white flex-1 truncate">{selectedTeamObj.team_name}</span>
                  {teamsWithProjects.has(selectedTeamObj.id) && (
                    <span className="whitespace-nowrap rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                      Has project
                    </span>
                  )}
                  <span className="text-slate-500 text-xs">▾</span>
                </>
              ) : !teamDropdownOpen ? (
                <>
                  <Folder size={16} className="text-slate-500" />
                  <span className="flex-1 text-slate-400">Choose a team</span>
                  <span className="text-slate-500 text-xs">▾</span>
                </>
              ) : (
                <>
                  <Search size={15} className="text-slate-500 shrink-0" />
                  <input
                    autoFocus
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder="Search teams..."
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
                  />
                </>
              )}
            </div>

            {teamDropdownOpen && (
              <>
                <div onClick={() => setTeamDropdownOpen(false)} className="fixed inset-0 z-[60]" />
                <div className="absolute z-[61] left-0 right-0 top-[calc(100%+6px)] max-h-[240px] overflow-y-auto rounded-2xl border border-white/10 bg-[#161b2c]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {filteredTeams.length === 0 ? (
                    <p className="py-4 text-center text-[13px] text-slate-500 m-0">No teams found.</p>
                  ) : (
                    filteredTeams.map((t) => {
                      const hasProject = teamsWithProjects.has(t.id)
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (hasProject) return
                            setTeam(String(t.id)); setTeamSearch(''); setTeamDropdownOpen(false)
                          }}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-150 ${
                            hasProject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-purple-500/10'
                          } ${parseInt(team) === t.id ? 'bg-purple-500/15' : ''}`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-300">
                            <Folder size={12} />
                          </span>
                          <p className={`flex-1 min-w-0 truncate text-[13px] font-semibold ${hasProject ? 'text-slate-500' : 'text-slate-200'}`}>
                            {t.team_name}
                          </p>
                          {hasProject && (
                            <span className="whitespace-nowrap rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-300">
                              Project assigned
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${fieldBase} ${fieldNormal} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`${fieldBase} ${fieldNormal} [color-scheme:dark]`}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >Cancel</button>
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >Create Project →</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateProjectForm