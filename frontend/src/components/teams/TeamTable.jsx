import { useState, useEffect } from 'react'
import api from '../../services/api'
import AddMemberForm from './AddMemberForm'
import {
  Folder, Users, Eye, UserPlus, Pencil, Trash2, X, Loader2,
} from 'lucide-react'

export default function TeamTable({ teams, onDelete, onRefresh, canEdit, canDelete }) {

  const [viewTeam, setViewTeam]       = useState(null)
  const [editTeam, setEditTeam]       = useState(null)
  const [addMemberTeam, setAddMemberTeam] = useState(null)
  const [removingId, setRemovingId]   = useState(null)
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (viewTeam) {
      const fresh = teams.find((t) => t.id === viewTeam.id)
      if (fresh) setViewTeam(fresh)
    }
  }, [teams])

  const handleRemoveMember = async (memberRowId) => {
    if (!window.confirm('Remove this member from the team?')) return
    setRemovingId(memberRowId)
    try {
      await api.delete(`/team-members/${memberRowId}/`)
      onRefresh()
    } catch (err) {
      console.error('Failed to remove member', err)
    } finally {
      setRemovingId(null)
    }
  }

  const iconBtn = (extra = '') =>
    `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${extra}`

  return (
    <>
      {!isMobile && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500/[0.08] via-indigo-500/[0.05] to-purple-500/[0.08]">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Team Name</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</th>
                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Members</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id}
                  className={`${i === 0 ? '' : 'border-t border-white/[0.06]'} transition-colors duration-150 hover:bg-purple-500/[0.04]`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300">
                        <Folder size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-slate-400">
                      {team.description || <span className="italic text-slate-600">No description</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3.5 py-1 text-xs font-bold text-purple-300">
                      <Users size={12} /> {team.members?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setViewTeam(team)} title="View"
                        className={iconBtn('border-transparent bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_14px_-2px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95')}
                      ><Eye size={14} /></button>

                      {canEdit && (
                        <button onClick={() => setAddMemberTeam(team)} title="Add member"
                          className={iconBtn('border-white/10 bg-white/[0.04] text-indigo-300 hover:bg-indigo-500/15 hover:border-indigo-400/30')}
                        ><UserPlus size={14} /></button>
                      )}

                      {canEdit && (
                        <button onClick={() => setEditTeam(team)} title="Edit"
                          className={iconBtn('border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white')}
                        ><Pencil size={14} /></button>
                      )}

                      {canDelete && (
                        <button onClick={() => onDelete(team.id)} title="Delete"
                          className={iconBtn('border-white/10 bg-white/[0.04] text-red-400 hover:bg-red-500/15 hover:border-red-400/30 hover:text-red-300')}
                        ><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col gap-3">
          {teams.map((team) => (
            <div key={team.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20 text-purple-300">
                    <Folder size={14} />
                  </div>
                  <span className="text-sm font-semibold text-white">{team.team_name}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-0.5 text-xs font-bold text-purple-300">
                  <Users size={12} /> {team.members?.length ?? 0}
                </span>
              </div>
              <p className="text-xs text-slate-400 m-0">{team.description || 'No description'}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setViewTeam(team)} className="flex-1 rounded-lg bg-gradient-to-b from-purple-500 to-indigo-600 py-2 text-xs font-semibold text-white">View</button>
                {canEdit && <button onClick={() => setAddMemberTeam(team)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-indigo-300">+ Member</button>}
                {canEdit && <button onClick={() => setEditTeam(team)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-slate-300">Edit</button>}
                {canDelete && <button onClick={() => onDelete(team.id)} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-red-400">Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
                  <Users size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-white">{viewTeam.team_name}</p>
                  <p className="mt-1 text-[13px] text-slate-400">{viewTeam.description || 'No description'}</p>
                </div>
              </div>
              <button onClick={() => setViewTeam(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              ><X size={16} /></button>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                  {viewTeam.created_by_detail?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 m-0">Created by</p>
                  <p className="text-[13px] font-semibold text-slate-200 m-0">{viewTeam.created_by_detail?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="border-t border-white/10 mb-5" />

              <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Members ({viewTeam.members?.length ?? 0})
              </p>

              {viewTeam.members?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {viewTeam.members.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-purple-500/15 bg-purple-500/[0.06] px-3.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                          {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-200 m-0">{m.user_detail?.name || 'Unknown'}</p>
                          <p className="truncate text-[11px] text-slate-500 m-0 mt-0.5">{m.user_detail?.email}</p>
                        </div>
                      </div>
                      {m.role && (
                        <span className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
                          {m.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-slate-500">No members yet.</p>
              )}

              <div className="flex justify-end mt-6 pt-5 border-t border-white/10">
                <button onClick={() => setViewTeam(null)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTeam && (
        <EditTeamModal
          team={editTeam}
          onClose={() => { setEditTeam(null); onRefresh() }}
          onSaved={() => { setEditTeam(null); onRefresh() }}
        />
      )}

      {addMemberTeam && (
        <AddMemberForm
          team={addMemberTeam}
          onAdded={() => { setAddMemberTeam(null); onRefresh() }}
          onCancel={() => setAddMemberTeam(null)}
        />
      )}
    </>
  )
}

function EditTeamModal({ team, onClose, onSaved }) {
  const [teamName, setTeamName] = useState(team.team_name)
  const [teamDesc, setTeamDesc] = useState(team.description || '')
  const [saving, setSaving]     = useState(false)

  const [members, setMembers]   = useState(team.members || [])
  const [roleDrafts, setRoleDrafts] = useState(
    Object.fromEntries((team.members || []).map((m) => [m.id, m.role || '']))
  )
  const [removingId, setRemovingId] = useState(null)

  const handleRemoveMember = async (memberRowId) => {
    if (!window.confirm('Remove this member from the team?')) return
    setRemovingId(memberRowId)
    try {
      await api.delete(`/team-members/${memberRowId}/`)
      setMembers((prev) => prev.filter((m) => m.id !== memberRowId))
    } catch (err) {
      console.error('Failed to remove member', err)
      alert('Could not remove this member. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  const handleSaveAll = async () => {
    if (!teamName.trim()) return
    setSaving(true)
    try {
      await api.put(`/teams/${team.id}`, {
        team_name: teamName,
        description: teamDesc,
        created_by: team.created_by,
      })

      const roleUpdates = members
        .filter((m) => roleDrafts[m.id] !== m.role)
        .map((m) =>
          api.put(`/team-members/${m.id}/`, {
            team: team.id,
            user: m.user,
            role: roleDrafts[m.id],
          })
        )
      await Promise.all(roleUpdates)

      onSaved()
    } catch (err) {
      console.error('Failed to save team changes', err)
      alert('Something went wrong while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const fieldBase = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200"
  const fieldNormal = "border-white/10 bg-white/[0.04] text-white focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[860px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111524] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-250">

        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-purple-500/25 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Pencil size={22} />
            </div>
            <div>
              <p className="text-xl font-bold text-white m-0">Edit Team</p>
              <p className="mt-1 text-[13px] text-slate-400">
                Manage members on the left, update team details on the right.
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          ><X size={16} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">

          <div className="border-b md:border-b-0 md:border-r border-white/10 p-6 max-h-[460px] overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 m-0">
              Members ({members.length})
            </p>

            {members.length === 0 ? (
              <p className="mt-3 text-[13px] text-slate-500">No members yet.</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {members.map((m) => (
                  <div key={m.id} className="rounded-xl border border-purple-500/15 bg-purple-500/[0.06] p-3">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                        {m.user_detail?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-200 m-0">{m.user_detail?.name || 'Unknown'}</p>
                        <p className="truncate text-[11px] text-slate-500 m-0 mt-0.5">{m.user_detail?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        value={roleDrafts[m.id] ?? ''}
                        onChange={(e) => setRoleDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                        placeholder="Role"
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-200 outline-none transition-colors duration-200 focus:border-purple-500/60"
                      />
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={removingId === m.id}
                        className="whitespace-nowrap rounded-lg border border-red-500/30 bg-transparent px-3 py-1.5 text-[11px] font-semibold text-red-400 transition-colors duration-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removingId === m.id ? (
                          <span className="inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Removing...</span>
                        ) : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-6">
            <div>
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={`${fieldBase} ${fieldNormal}`}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">Description</label>
                <textarea
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  rows={5}
                  className={`${fieldBase} ${fieldNormal} resize-none leading-relaxed`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-white/10">
              <button onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
              >Close</button>
              <button onClick={handleSaveAll} disabled={saving}
                className="rounded-xl bg-gradient-to-b from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_8px_20px_-4px_rgba(124,58,237,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >{saving ? 'Saving...' : 'Save All Changes →'}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}