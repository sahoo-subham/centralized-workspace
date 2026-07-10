import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useRole } from '../../hooks/useRole'
import StatCard from './StatCard'
import RecentProjects from './RecentProjects'
import RecentTasks from './RecentTasks'
import TaskCompletionChart from './TaskCompletionChart'
import ProjectStatusChart from './ProjectStatusChart'

export default function DashboardHome() {
  const navigate = useNavigate()
  const { isAdmin, isTeamLead } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentProjects, setRecentProjects] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [allVisibleProjects, setAllVisibleProjects] = useState([])
  const [allVisibleTasks, setAllVisibleTasks]       = useState([])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const roleLabel = isAdmin ? 'Administrator' : isTeamLead ? 'Team Lead' : 'Team Member'
  const roleColor = isAdmin ? 'text-red-400' : isTeamLead ? 'text-amber-400' : 'text-indigo-400'

  useEffect(() => { fetchData() }, [])

  const fetchAll = async (baseUrl) => {
    let combined = []
    let url = `${baseUrl}?page=1`
    while (url) {
      const res = await api.get(url)
      combined = [...combined, ...(res.data?.results ?? [])]
      if (res.data?.next) {
        const next = new URL(res.data.next)
        url = `${baseUrl}?${next.searchParams.toString()}`
      } else {
        url = null
      }
    }
    return combined
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [allTeams, allProjects, allTasks, allDocs] = await Promise.all([
        fetchAll('/teams/'),
        fetchAll('/projects/'),
        fetchAll('/tasks/'),
        fetchAll('/documents/'),
      ])

      const myTeamIds = allTeams
        .filter((t) =>
          t.members?.some((m) => m.user === currentUser.id) ||
          t.created_by === currentUser.id
        )
        .map((t) => t.id)

      const visibleTeams = isAdmin ? allTeams : allTeams.filter((t) => myTeamIds.includes(t.id))

      const visibleProjects = isAdmin
        ? allProjects
        : allProjects.filter((p) => myTeamIds.includes(p.team))

      const myProjectIds = visibleProjects.map((p) => p.id)

      const visibleTasks = isAdmin
        ? allTasks
        : allTasks.filter((t) => t.created_by === currentUser.id || t.assigned_to === currentUser.id)

      const visibleDocs = isAdmin
        ? allDocs
        : allDocs.filter((d) => myProjectIds.includes(d.project))

      setStats({
        teams: visibleTeams.length,
        projects: visibleProjects.length,
        tasks: visibleTasks.length,
        documents: visibleDocs.length,
      })

      setRecentProjects(visibleProjects.slice(0, 5))
      setRecentTasks(visibleTasks.slice(0, 5))
      setAllVisibleProjects(visibleProjects)
      setAllVisibleTasks(visibleTasks)

    } catch (err) {
      console.error('Dashboard fetch failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 right-0 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="relative px-6 md:px-10 pt-10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
            Overview
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {greeting()},{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {currentUser?.name?.split(' ')[0] || 'there'}
                </span>{' '}
                👋
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="mx-2 text-slate-600">·</span>
                <span className={`font-semibold ${roleColor}`}>{roleLabel}</span>
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard/projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 self-start sm:self-auto"
            >
              <span>📁</span> View Projects
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-10 space-y-8 mt-5">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="👥" label="Teams" value={stats?.teams}
            color="indigo" loading={loading}
            onClick={() => navigate('/dashboard/teams')}
          />
          <StatCard
            icon="📁" label="Projects" value={stats?.projects}
            color="emerald" loading={loading}
            onClick={() => navigate('/dashboard/projects')}
          />
          <StatCard
            icon="✅" label="Tasks" value={stats?.tasks}
            color="amber" loading={loading}
            onClick={() => navigate('/dashboard/tasks')}
          />
          <StatCard
            icon="📄" label="Documents" value={stats?.documents}
            color="rose" loading={loading}
            onClick={() => navigate('/dashboard/documents')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectStatusChart projects={allVisibleProjects} loading={loading} />
          <TaskCompletionChart tasks={allVisibleTasks} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentProjects
            projects={recentProjects}
            loading={loading}
            onViewAll={() => navigate('/dashboard/projects')}
          />
          <RecentTasks
            tasks={recentTasks}
            loading={loading}
            onViewAll={() => navigate('/dashboard/tasks')}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Manage Teams',  icon: '👥', path: '/dashboard/teams',     color: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/50' },
              { label: 'View Projects', icon: '📁', path: '/dashboard/projects',  color: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/50' },
              { label: 'My Tasks',      icon: '✅', path: '/dashboard/tasks',     color: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/50' },
              { label: 'Documents',     icon: '📄', path: '/dashboard/documents', color: 'from-rose-600/20 to-rose-600/5 border-rose-500/20 hover:border-rose-500/50' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${item.color}`}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}