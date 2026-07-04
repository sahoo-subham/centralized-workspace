import { useState, useEffect, useRef } from 'react'
import { BellIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', icon: '🏠' },
  { name: 'Teams',     icon: '👥' },
  { name: 'Projects',  icon: '📁' },
  { name: 'Tasks',     icon: '✅' },
  { name: 'Documents', icon: '📄' },
]

const ROLE_STYLES = {
  admin:     { bg: 'rgba(239,68,68,0.15)',  color: '#fca5a5', label: 'Admin' },
  team_lead: { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', label: 'Team Lead' },
  member:    { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', label: 'Member' },
}

export default function Navbar({ activePage, onNavigate, onLogout }) {
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
      <style>{`
        @keyframes navGlow {
          0%,100% { box-shadow: 0 0 12px rgba(99,102,241,0.25); }
          50%      { box-shadow: 0 0 28px rgba(99,102,241,0.6);  }
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1);   opacity: 1;   }
          50%      { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .nav-link-hover:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
        .profile-item:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
        .profile-logout:hover {
          background: rgba(239,68,68,0.12) !important;
          color: #fca5a5 !important;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          color: #fff !important;
        }
        .mobile-nav-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #fff !important;
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        width: '100%', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(13,15,26,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled
          ? '0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)'
          : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

          {/* Logo */}
          <button
            onClick={() => handleNavigate('Dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px 8px 4px 0', marginRight: '8px',
            }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
              border: '1px solid rgba(99,102,241,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
              animation: 'navGlow 3.5s ease-in-out infinite',
            }}>⚡</div>
            <span style={{
              color: '#fff', fontWeight: '700', fontSize: '15px',
              letterSpacing: '-0.3px', whiteSpace: 'nowrap',
              display: 'none',
            }} className="sm-show">Workspace</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
            className="desktop-nav">
            {navigation.map((item) => {
              const active = activePage === item.name
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.name)}
                  className="nav-link-hover"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 13px', borderRadius: '9px', border: 'none',
                    background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                    color: active ? '#e0e7ff' : '#94a3b8',
                    fontSize: '13px', fontWeight: active ? '600' : '500',
                    cursor: 'pointer', transition: 'all 0.18s ease',
                    position: 'relative', boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.3)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '14px', lineHeight: 1 }}>{item.icon}</span>
                  {item.name}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: '3px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px', height: '2px', borderRadius: '2px',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          <button className="icon-btn" style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#94a3b8', cursor: 'pointer', position: 'relative',
            transition: 'all 0.18s ease',
          }}>
            <BellIcon style={{ width: '17px', height: '17px' }} />
            <span style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#ef4444', border: '1px solid rgba(13,15,26,0.8)',
              animation: 'dotPulse 2s ease-in-out infinite',
            }} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-only icon-btn"
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: mobileOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              color: mobileOpen ? '#a5b4fc' : '#94a3b8', cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            {mobileOpen
              ? <XMarkIcon style={{ width: '17px', height: '17px' }} />
              : <Bars3Icon style={{ width: '17px', height: '17px' }} />
            }
          </button>

          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 8px 4px 4px', borderRadius: '12px', border: 'none',
                background: profileOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: '700',
                border: '2px solid rgba(99,102,241,0.35)',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.15)',
              }}>{userInitial}</div>

              <div style={{ textAlign: 'left' }} className="sm-show">
                <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: '600', margin: 0, lineHeight: 1.3 }}>
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </p>
                <span style={{
                  fontSize: '10px', fontWeight: '600', padding: '1px 6px',
                  borderRadius: '999px', lineHeight: 1.5,
                  background: roleStyle.bg, color: roleStyle.color,
                }}>{roleStyle.label}</span>
              </div>

              <ChevronDownIcon style={{
                width: '14px', height: '14px', color: '#64748b',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease',
              }} className="sm-show" />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                width: '230px', borderRadius: '16px',
                background: 'rgba(17,21,36,0.97)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
                padding: '8px', zIndex: 60,
                animation: 'slideDown 0.18s ease',
              }}>
                {/* Header */}
                <div style={{
                  padding: '12px 12px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '6px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '14px', fontWeight: '700',
                    }}>{userInitial}</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser?.name || 'User'}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '11px', margin: '1px 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser?.email}
                      </p>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                        borderRadius: '999px', background: roleStyle.bg, color: roleStyle.color,
                      }}>{roleStyle.label}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate('Profile')}
                  className="profile-item"
                  style={{
                    width: '100%', textAlign: 'left', padding: '9px 12px',
                    borderRadius: '10px', border: 'none',
                    background: 'transparent', color: '#cbd5e1',
                    fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>👤</span> Your Profile
                </button>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                <button
                  onClick={onLogout}
                  className="profile-logout"
                  style={{
                    width: '100%', textAlign: 'left', padding: '9px 12px',
                    borderRadius: '10px', border: 'none',
                    background: 'transparent', color: '#cbd5e1',
                    fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🚪</span> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 49,
          top: '64px',
          animation: 'fadeIn 0.18s ease',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <div style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(13,15,26,0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 16px 20px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            animation: 'slideDown 0.2s ease',
          }}>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', marginBottom: '10px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '12px',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '14px', fontWeight: '700',
              }}>{userInitial}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.name}
                </p>
                <span style={{
                  fontSize: '10px', fontWeight: '700', padding: '1px 7px',
                  borderRadius: '999px', background: roleStyle.bg, color: roleStyle.color,
                }}>{roleStyle.label}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {navigation.map((item) => {
                const active = activePage === item.name
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.name)}
                    className="mobile-nav-item"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: '11px', border: 'none',
                      background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                      color: active ? '#e0e7ff' : '#94a3b8',
                      fontSize: '14px', fontWeight: active ? '600' : '500',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.25)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '17px', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                    {item.name}
                    {active && (
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'block' }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '10px', paddingTop: '10px' }}>
              <button
                onClick={onLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '11px', border: 'none',
                  background: 'transparent', color: '#f87171',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '17px', width: '22px', textAlign: 'center' }}>🚪</span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sm-show { display: block; }
        .desktop-nav { display: flex !important; }
        .mobile-only { display: none !important; }

        @media (max-width: 879px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (max-width: 639px) {
          .sm-show { display: none !important; }
        }
      `}</style>
    </>
  )
}