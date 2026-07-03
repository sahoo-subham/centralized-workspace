import { useState, useEffect } from "react";
import api from "../../services/api";
import { CheckSquare, X, Info } from "lucide-react";

function CreateTaskForm({ onCreated, onCancel }) {

  const [projects, setProjects]         = useState([])
  const [teamMembers, setTeamMembers]   = useState([]) 
  const [title, setTitle]               = useState('')
  const [description, setDescription]   = useState('')
  const [project, setProject]           = useState('')
  const [assignedTo, setAssignedTo]     = useState('')
  const [dueDate, setDueDate]           = useState('')
  const [error, setError]               = useState('')
  const [loadingMembers, setLoadingMembers] = useState(false)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        let allTeams = []
        let teamUrl = '/teams/?page=1'
        while (teamUrl) {
          const res = await api.get(teamUrl)
          allTeams = [...allTeams, ...(res.data?.results ?? [])]
          if (res.data?.next) {
            const next = new URL(res.data.next)
            teamUrl = `/teams/?${next.searchParams.toString()}`
          } else {
            teamUrl = null
          }
        }

        const myTeamIds = allTeams
          .filter((t) =>
            t.members?.some((m) => m.user === currentUser.id) ||
            t.created_by === currentUser.id
          )
          .map((t) => t.id)

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

        const visible = currentUser.role === 'admin'
          ? combined
          : combined.filter((p) => myTeamIds.includes(p.team))

        setProjects(visible)
      } catch (err) {
        console.error('Failed to fetch projects', err)
      }
    }
    fetchAllProjects()
  }, [])

  useEffect(() => {
    if (!project) {
      setTeamMembers([])
      setAssignedTo('')
      return
    }

    const fetchTeamMembers = async () => {
      setLoadingMembers(true)
      try {
        const selectedProject = projects.find((p) => p.id === parseInt(project))
        const teamId = selectedProject?.team

        if (!teamId) {
          setTeamMembers([])
          return
        }

        const res = await api.get(`/teams/${teamId}`)
        const members = res.data?.members ?? []
        setTeamMembers(members)
        setAssignedTo('') 
      } catch (err) {
        console.error('Failed to fetch team members', err)
        setTeamMembers([])
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchTeamMembers()
  }, [project, projects])

  const handleSubmit = async () => {
    if (!title.trim() || !project) {
      setError('Title and Project are required.')
      return
    }

    const user = JSON.parse(localStorage.getItem('user'))

    try {
      await api.post('/tasks/', {
        title,
        description,
        project,
        assigned_to: assignedTo || null,
        created_by:  user?.id,
        status:   'pending',  
        priority: 'low',      
        due_date: dueDate || null,
      })
      onCreated()
    } catch (err) {
      setError('Failed to create task. Please try again.')
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10 [color-scheme:dark]"
  const optionClass = "bg-[#111524] text-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-4 p-7 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <CheckSquare size={24} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Create New Task</p>
              <p className="mt-1 text-[13px] text-slate-400">Assign a task to a project member.</p>
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
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design login page"
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
              placeholder="What needs to be done?"
              className={`${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
            />
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Project
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={`${fieldBase} ${fieldNormal}`}
            >
              <option value="" className={optionClass}>Choose a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className={optionClass}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Assigned To
              {project && !loadingMembers && (
                <span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-slate-500">
                  ({teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} in this project's team)
                </span>
              )}
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!project || loadingMembers}
              className={`${fieldBase} ${fieldNormal} ${(!project || loadingMembers) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <option value="" className={optionClass}>
                {!project
                  ? 'Select a project first'
                  : loadingMembers
                    ? 'Loading members...'
                    : 'Unassigned'}
              </option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.user} className={optionClass}>
                  {m.user_detail?.name} — {m.user_detail?.email}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`${fieldBase} ${fieldNormal}`}
            />
          </div>

          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-500/[0.08] px-4 py-3">
            <Info size={16} className="text-indigo-300 shrink-0" />
            <p className="text-xs text-indigo-300 m-0">
              Status is set to <strong>Pending</strong> and priority to <strong>Low</strong> by default.
              You can change them after creation via the <strong>Edit</strong> button.
            </p>
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
            >Create Task →</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateTaskForm;