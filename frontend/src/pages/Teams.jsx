import { useState, useEffect } from 'react'
import api from '../services/api'
import CreateTeamForm from '../components/CreateTeamForm'
import TeamTable      from '../components/TeamTable'
import TeamFilter     from '../components/TeamFilter'
import Register       from './Register'
import { useRole }    from '../hooks/useRole'

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
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Teams</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Manage all teams' : 'Your teams'}
          </p>
        </div>

        <div className="flex gap-3">
          {canCreateTeam && (
            <button
              onClick={() => { setShowForm(!showForm); setRegisterMember(false) }}
              style={{ background: '#4f46e5', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
              onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
            >+ New Team</button>
          )}


          {isAdmin && (
            <button
              onClick={() => { setRegisterMember(!registerMember); setShowForm(false) }}
              style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#374151'}
              onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
            >+ Register New Member</button>
          )}
        </div>
      </div>

      <div className="mb-6">
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
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading teams...</p>
        </div>

      ) : visibleTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <span className="text-4xl mb-3">👥</span>
          <p className="text-gray-300 font-medium">No teams found</p>
          <p className="text-gray-500 text-sm mt-1">
            {selectedTeam
              ? 'Try a different team'
              : isAdmin
                ? 'Click "+ New Team" to get started'
                : "You haven't been added to any team yet"}
          </p>
        </div>

      ) : (
        <>
          <TeamTable
            teams={pagedTeams}
            onDelete={handleDelete}
            onRefresh={fetchAllTeams}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: page === 1 ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === 1 ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >← Prev</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{ background: p === page ? '#4f46e5' : '#2d3348', border: '1px solid #3f4659', color: p === page ? '#fff' : '#cbd5e1', fontSize: '14px', fontWeight: '600', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}
                >{p}</button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ background: page === totalPages ? '#1f2330' : '#2d3348', border: '1px solid #3f4659', color: page === totalPages ? '#4b5563' : '#cbd5e1', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >Next →</button>
            </div>
          )}
        </>
      )}

    </div>
  )
}