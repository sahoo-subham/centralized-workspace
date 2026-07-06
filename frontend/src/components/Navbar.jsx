import { useState, useEffect, useRef } from 'react'
import {
  Zap, Bell, Menu, X, ChevronDown, User, LogOut,
  Home, Users, Folder, CheckSquare, FileText, Calendar,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', icon: Home },
  { name: 'Teams',     icon: Users },
  { name: 'Projects',  icon: Folder },
  { name: 'Tasks',     icon: CheckSquare },
  { name: 'Calendar',  icon: Calendar },
  { name: 'Documents', icon: FileText },
]

const ROLE_STYLES = {
  admin:     { classes: 'bg-rose-500/15 text-rose-300',    label: 'Admin' },
  team_lead: { classes: 'bg-amber-500/15 text-amber-300',  label: 'Team Lead' },
  member:    { classes: 'bg-indigo-500/15 text-indigo-300', label: 'Member' },
}

function Navbar({ activePage, onNavigate, onLogout }) {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const profileRef = useRef(null)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userInitial = currentUser?.name?.charAt(0).toUpperCase() || '?'
  const roleStyle   = ROLE_STYLES[currentUser?.role] || ROLE_STYLES.member

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavigate = (page) => {
    onNavigate(page)
    setMobileOpen(false)
    setProfileOpen(false)
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/[0.07] bg-[#0A0D16]/85 px-5 backdrop-blur-2xl transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.5)]' : ''
        }`}
      >
        <div className="flex items-center gap-1.5">

          <button
            onClick={() => handleNavigate('Dashboard')}
            className="mr-2 flex items-center gap-2.5 bg-transparent py-1 pr-2"
          >
            <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl border border-purple-500/35 bg-linear-to-br from-purple-500/30 to-indigo-500/20 text-purple-200 shadow-[0_0_16px_rgba(124,58,237,0.35)]">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="hidden whitespace-nowrap text-[15px] font-bold tracking-tight text-white sm:block">
              Workspace
            </span>
          </button>

          <div className="hidden items-center gap-0.5 md:flex">
            {navigation.map((item) => {
              const active = activePage === item.name
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.name)}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-purple-500/18 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]'
                      : 'text-slate-400 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0.75 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/5 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white">
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full border border-[#0A0D16] bg-red-500" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] transition-all duration-200 md:hidden ${
              mobileOpen ? 'bg-purple-500/20 text-indigo-300' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors duration-200 ${
                profileOpen ? 'bg-white/8' : 'hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border-2 border-purple-500/35 bg-linear-to-br from-indigo-600 to-purple-600 text-[13px] font-bold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.15)]">
                {userInitial}
              </div>

              <div className="hidden text-left sm:block">
                <p className="m-0 text-xs font-semibold leading-tight text-slate-100">
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </p>
                <span className={`inline-block rounded-full px-1.5 py-px text-[10px] font-semibold leading-normal ${roleStyle.classes}`}>
                  {roleStyle.label}
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-500 transition-transform duration-200 sm:block ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-60 w-57.5 rounded-2xl border border-white/8 bg-[#111524]/97 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-150">

                <div className="mb-1.5 border-b border-white/6 p-3 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-sm font-bold text-white">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="m-0 truncate text-[13px] font-semibold text-slate-100">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="m-0 mb-1 mt-px truncate text-[11px] text-slate-500">
                        {currentUser?.email}
                      </p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${roleStyle.classes}`}>
                        {roleStyle.label}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate('Profile')}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-slate-300 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white"
                >
                  <User size={15} /> Your Profile
                </button>

                <div className="my-1 h-px bg-white/5" />

                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-slate-300 transition-colors duration-150 hover:bg-red-500/12 hover:text-red-300"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-49 animate-in fade-in duration-150">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative z-1 border-b border-white/[0.07] bg-[#0A0D16]/98 px-4 pb-5 pt-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">

            <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-purple-500/15 bg-purple-500/8 px-3.5 py-3">
              <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-sm font-bold text-white">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-[13px] font-semibold text-slate-100">
                  {currentUser?.name}
                </p>
                <span className={`inline-block rounded-full px-1.5 py-px text-[10px] font-bold ${roleStyle.classes}`}>
                  {roleStyle.label}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              {navigation.map((item) => {
                const active = activePage === item.name
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.name)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-purple-500/18 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]'
                        : 'text-slate-400 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <Icon size={17} className="w-5.5 text-center" />
                    {item.name}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-2.5 border-t border-white/6 pt-2.5">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-colors duration-150 hover:bg-red-500/10"
              >
                <LogOut size={17} className="w-5.5 text-center" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar