import { useState, useEffect } from "react";
import api from "../../services/api";

export default function CreateTaskForm({ onCreated, onCancel }) {

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

  const inputStyle = {
    width: '100%', background: '#232938', border: '1px solid #3f4659',
    borderRadius: '14px', color: '#fff', fontSize: '14px',
    padding: '14px 16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const labelStyle = {
    color: '#94a3b8', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    display: 'block', marginBottom: '10px',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '580px',
        borderRadius: '24px', border: '1px solid #2d3348',
        background: '#1a1f2e', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
      }}>

        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)',
          borderBottom: '1px solid #2d3348', padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✅</div>
            <div>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Create New Task</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Assign a task to a project member.</p>
            </div>
          </div>
          <button onClick={onCancel}
            style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
          >✕</button>
        </div>

        <div style={{ padding: '28px 32px' }}>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Task Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design login page" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="What needs to be done?"
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}>
              <option value="">Choose a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Assigned To
              {project && !loadingMembers && (
                <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                  ({teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} in this project's team)
                </span>
              )}
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!project || loadingMembers}
              style={{
                ...inputStyle,
                opacity: (!project || loadingMembers) ? 0.5 : 1,
                cursor: (!project || loadingMembers) ? 'not-allowed' : 'pointer',
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'}
            >
              <option value="">
                {!project
                  ? 'Select a project first'
                  : loadingMembers
                    ? 'Loading members...'
                    : 'Unassigned'}
              </option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.user}>
                  {m.user_detail?.name} — {m.user_detail?.email}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>ℹ️</span>
            <p style={{ color: '#a5b4fc', fontSize: '12px', margin: 0 }}>
              Status is set to <strong>Pending</strong> and priority to <strong>Low</strong> by default.
              You can change them after creation via the <strong>Edit</strong> button.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#fca5a5', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #2d3348' }}>
            <button onClick={onCancel}
              style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
            >Cancel</button>
            <button onClick={handleSubmit}
              style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 24px', borderRadius: '12px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4338ca'} onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
            >Create Task →</button>
          </div>

        </div>
      </div>
    </div>
  )
}