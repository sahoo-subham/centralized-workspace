
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import StatCard from "./StatCard";
import { useRole } from "../../hooks/useRole";

const STATUS_COLORS = {
  pending:     { bg: 'rgba(156,163,175,0.15)', text: '#d1d5db' },
  active:      { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc' },
  completed:   { bg: 'rgba(16,185,129,0.15)',  text: '#6ee7b7' },
  on_hold:     { bg: 'rgba(239,68,68,0.15)',   text: '#fca5a5' },
  in_progress: { bg: 'rgba(245,158,11,0.15)',  text: '#fcd34d' },
}

const PRIORITY_COLORS = {
  low:    { bg: 'rgba(16,185,129,0.15)',  text: '#6ee7b7' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d' },
  high:   { bg: 'rgba(239,68,68,0.15)',  text: '#fca5a5' },
}

export default function DashboardHome() {
  const navigate   = useNavigate()
  const { isAdmin, isMember } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [stats, setStats]         = useState({ teams: 0, projects: 0, tasks: 0, documents: 0 })
  const [recentProjects, setRecentProjects] = useState([])
  const [recentTasks, setRecentTasks]       = useState([])
  const [loading, setLoading]     = useState(true)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [teamsRes, projectsRes, tasksRes, docsRes] = await Promise.all([
        api.get('/teams/?page=1'),
        api.get('/projects/?page=1'),
        api.get('/tasks/?page=1'),
        api.get('/documents/?page=1'),
      ])

      setStats({
        teams:     teamsRes.data?.count     ?? 0,
        projects:  projectsRes.data?.count  ?? 0,
        tasks:     tasksRes.data?.count     ?? 0,
        documents: docsRes.data?.count      ?? 0,
      })

      // recent 5 projects
      setRecentProjects((projectsRes.data?.results ?? []).slice(0, 5))

      // recent 5 tasks
      setRecentTasks((tasksRes.data?.results ?? []).slice(0, 5))

    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* ── GREETING ──────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
          {greeting()}, {currentUser?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}
          <span style={{ color: '#94a3b8' }}>
            {isAdmin ? 'Administrator' : isMember ? 'Team Member' : 'Team Lead'}
          </span>
        </p>
      </div>

      {/* ── STAT CARDS ────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard icon="👥" label="Teams"     value={stats.teams}     color="indigo"  loading={loading} />
        <StatCard icon="📁" label="Projects"  value={stats.projects}  color="emerald" loading={loading} />
        <StatCard icon="✅" label="Tasks"     value={stats.tasks}     color="amber"   loading={loading} />
        <StatCard icon="📄" label="Documents" value={stats.documents} color="rose"    loading={loading} />
      </div>

      {/* ── TWO COLUMN SECTION ────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
      }}>

        {/* Recent Projects */}
        <div style={{
          background: 'rgba(17,21,36,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>📁</span>
              <p style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '15px', margin: 0 }}>Recent Projects</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >View all →</button>
          </div>

          <div style={{ padding: '8px' }}>
            {loading ? (
              [1,2,3].map((i) => (
                <div key={i} style={{ height: '52px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', margin: '4px', animation: 'pulse 1.5s infinite' }} />
              ))
            ) : recentProjects.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                No projects yet
              </div>
            ) : (
              recentProjects.map((p) => {
                const s = STATUS_COLORS[p.status] || STATUS_COLORS.pending
                return (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '10px',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate('/dashboard/projects')}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>
                        {p.team_detail?.team_name || '—'}
                      </p>
                    </div>
                    <span style={{
                      background: s.bg, color: s.text,
                      fontSize: '10px', fontWeight: '700',
                      padding: '3px 9px', borderRadius: '999px',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '10px',
                    }}>{p.status?.replace('_', ' ')}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div style={{
          background: 'rgba(17,21,36,0.7)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>✅</span>
              <p style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '15px', margin: 0 }}>Recent Tasks</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/tasks')}
              style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >View all →</button>
          </div>

          <div style={{ padding: '8px' }}>
            {loading ? (
              [1,2,3].map((i) => (
                <div key={i} style={{ height: '52px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', margin: '4px', animation: 'pulse 1.5s infinite' }} />
              ))
            ) : recentTasks.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                No tasks yet
              </div>
            ) : (
              recentTasks.map((t) => {
                const s = STATUS_COLORS[t.status]   || STATUS_COLORS.pending
                const p = PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.low
                return (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '10px',
                    transition: 'background 0.15s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate('/dashboard/tasks')}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>
                        {t.project_detail?.title || '—'}
                        {t.due_date && ` · Due ${t.due_date}`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '10px' }}>
                      <span style={{
                        background: p.bg, color: p.text,
                        fontSize: '10px', fontWeight: '700',
                        padding: '3px 9px', borderRadius: '999px', whiteSpace: 'nowrap',
                      }}>{t.priority}</span>
                      <span style={{
                        background: s.bg, color: s.text,
                        fontSize: '10px', fontWeight: '700',
                        padding: '3px 9px', borderRadius: '999px',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>{t.status?.replace('_', ' ')}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1;   }
        }
      `}</style>
    </div>
  )
}