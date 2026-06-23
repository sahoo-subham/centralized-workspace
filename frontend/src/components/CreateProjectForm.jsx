import { useState, useEffect } from 'react'
import api from '../services/api'

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

  const folderIconStyle = {
    width: '28px', height: '28px', borderRadius: '8px',
    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', flexShrink: 0,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '620px', borderRadius: '24px',
        border: '1px solid #2d3348', background: '#1a1f2e',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)',
          borderBottom: '1px solid #2d3348', padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📁</div>
            <div>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Create New Project</p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Set up a new project for a team.</p>
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
            <label style={labelStyle}>Project Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Website" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="What is this project about?"
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
          </div>

          <div style={{ marginBottom: '20px' }}>

            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Team</label>
              <div
                onClick={() => setTeamDropdownOpen(true)}
                style={{
                  ...inputStyle,
                  display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: 'pointer', padding: '12px 16px',
                  borderColor: teamDropdownOpen ? '#6366f1' : '#3f4659',
                }}
              >
                {selectedTeamObj && !teamDropdownOpen ? (
                  <>
                    <div style={folderIconStyle}>📁</div>
                    <span style={{ color: '#fff', flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedTeamObj.team_name}
                    </span>
                    {teamsWithProjects.has(selectedTeamObj.id) && (
                      <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                        Has project
                      </span>
                    )}
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
                  </>
                ) : !teamDropdownOpen ? (
                  <>
                    <span style={{ color: '#6b7280' }}>📁</span>
                    <span style={{ color: '#9ca3af', flex: 1 }}>Choose a team</span>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>▾</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#6b7280' }}>🔍</span>
                    <input
                      autoFocus
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      placeholder="Search teams..."
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', fontFamily: 'inherit' }}
                    />
                  </>
                )}
              </div>

              {teamDropdownOpen && (
                <>
                  <div onClick={() => setTeamDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 61,
                    background: '#1f2433', border: '1px solid #3f4659',
                    borderRadius: '14px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    maxHeight: '220px', overflowY: 'auto', padding: '6px',
                  }}>
                    {filteredTeams.length === 0 ? (
                      <p style={{ color: '#6b7280', fontSize: '13px', padding: '14px', textAlign: 'center', margin: 0 }}>No teams found.</p>
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
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', borderRadius: '10px',
                              cursor: hasProject ? 'not-allowed' : 'pointer',
                              background: parseInt(team) === t.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                              opacity: hasProject ? 0.5 : 1,
                            }}
                            onMouseEnter={e => { if (!hasProject) e.currentTarget.style.background = 'rgba(99,102,241,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = parseInt(team) === t.id ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                          >
                            <div style={folderIconStyle}>📁</div>
                            <p style={{ color: hasProject ? '#6b7280' : '#e5e7eb', fontSize: '13px', fontWeight: '600', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {t.team_name}
                            </p>
                            {hasProject && (
                              <span style={{
                                background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
                                fontSize: '10px', fontWeight: '700',
                                padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap',
                              }}>Project assigned</span>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#3f4659'} />
            </div>
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
            >Create Project →</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateProjectForm