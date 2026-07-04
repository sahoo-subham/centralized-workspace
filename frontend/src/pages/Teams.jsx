import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateTeamForm from '../components/teams/CreateTeamForm'
import TeamTable      from '../components/teams/TeamTable'
import TeamFilter     from '../components/teams/TeamFilter'
import Register       from './Register'
import { useRole }    from '../hooks/useRole'
import { Users, Plus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Teams() {

  const { canCreateTeam, canEdit, canDelete, isAdmin } = useRole()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [allTeams, setAllTeams]             = useState([]) 
  const [loading, setLoading]               = useState(true)
  const [showForm, setShowForm]             = useState(false)
  const [registerMember, setRegisterMember] = useState(false)
  const [selectedTeam, setSelectedTeam]     = useState('') 

  const [page, setPage]     = useState(1)
  const [pageSize] = useState(6)

  useEffect(() => { fetchAllTeams() }, [])

  const fetchAllTeams = async () => {
    setLoading(true)
    try {
      let combined = []
      let url = '/teams/?page=1'

      while (url) {
        const res = await api.get(url)
        combined = [...combined, ...(res.data?.results ?? [])]

        if (res.data?.next) {
          const nextUrl = new URL(res.data.next)
          url = `/teams/?${nextUrl.searchParams.toString()}`
        } else {
          url = null
        }
      }

      setAllTeams(combined)
    } catch (err) {
      console.error('Failed to fetch teams', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return
    try {
      await api.delete(`/teams/${id}`)
      fetchAllTeams()
    } catch (err) {
      console.error('Failed to delete team', err)
    }
  }

  const myTeams = isAdmin
    ? allTeams
    : allTeams.filter((team) =>
        team.members?.some((m) => m.user === currentUser.id) ||
        team.created_by === currentUser.id
      )

  const visibleTeams = selectedTeam
    ? myTeams.filter((t) => t.id === parseInt(selectedTeam))
    : myTeams

  const totalPages = Math.ceil(visibleTeams.length / pageSize)
  const pagedTeams  = visibleTeams.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
    if (totalPages === 0) setPage(1)
  }, [totalPages])

  useEffect(() => { setPage(1) }, [selectedTeam])

  return (
    <div className="relative w-full min-h-screen bg-[#0A0D16] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-600/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>

      <div className="relative w-full px-6 md:px-10 py-10 max-w-[1400px] mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Teams</h1>
            <p className="text-slate-400 text-sm mt-1.5">
              {isAdmin ? 'Manage all teams across your organization' : 'Your teams'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {canCreateTeam && (
              <button
                onClick={() => { setShowForm(!showForm); setRegisterMember(false) }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.5),0_10px_28px_-4px_rgba(124,58,237,0.65)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} strokeWidth={2.5} />
                New Team
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => { setRegisterMember(!registerMember); setShowForm(false) }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20 hover:text-white"
              >
                <UserPlus size={16} strokeWidth={2.5} />
                Register Member
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
          <TeamFilter
            teams={myTeams}
            selectedTeam={selectedTeam}
            onFilterChange={(val) => setSelectedTeam(val)}
          />
        </div>

        {showForm && (
          <CreateTeamForm
            onCreated={() => { setShowForm(false); fetchAllTeams() }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {registerMember && (
          <Register
            onSuccess={() => setRegisterMember(false)}
            onCancel={() => setRegisterMember(false)}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="h-4 w-4 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
              Loading teams...
            </div>
          </div>

        ) : visibleTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-xl animate-in fade-in duration-300">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Users size={24} className="text-indigo-400" strokeWidth={1.75} />
            </div>
            <p className="text-slate-200 font-semibold">No teams found</p>
            <p className="text-slate-500 text-sm mt-1.5">
              {selectedTeam
                ? 'Try a different team'
                : isAdmin
                  ? 'Click "New Team" to get started'
                  : "You haven't been added to any team yet"}
            </p>
          </div>

        ) : (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
              <TeamTable
                teams={pagedTeams}
                onDelete={handleDelete}
                onRefresh={fetchAllTeams}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === 1
                      ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <ChevronLeft size={15} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      p === page
                        ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_4px_14px_-2px_rgba(124,58,237,0.5)]'
                        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >{p}</button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    page === totalPages
                      ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}