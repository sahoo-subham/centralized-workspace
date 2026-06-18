export function useRole() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user?.role || 'member'

  return {
    role,
    isAdmin:    role === 'admin',
    isTeamLead: role === 'team_lead',
    isMember:   role === 'member',

    canEdit:   role === 'admin' || role === 'team_lead',

    canDelete: role === 'admin',

    canCreateTeam: role === 'admin',
  }
}