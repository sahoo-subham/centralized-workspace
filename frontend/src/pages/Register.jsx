import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register({ onSuccess, onCancel }) {
  const navigate = useNavigate()

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]       = useState('member')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    setError('')
    setSuccess('')

    if (!name || !email || !password) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password, role)
      setSuccess('User created successfully!')

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000)
      }
    } catch (err) {
      const msg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#232938',
    border: '1px solid #3f4659',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    padding: '13px 16px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const formContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div>
        <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          Full Name
        </label>
        <input
          type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe" style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        />
      </div>

      <div>
        <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          Email
        </label>
        <input
          type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        />
      </div>

      <div>
        <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          Password
        </label>
        <input
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        />
      </div>

      <div>
        <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#3f4659'}
        >
          <option value="member">Member</option>
          <option value="team_lead">Team Lead</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#86efac', fontSize: '13px' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: onSuccess ? 'flex-end' : 'stretch', gap: '12px', marginTop: '4px' }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{ background: '#2d3348', border: '1px solid #3f4659', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#374151'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d3348'}
          >Cancel</button>
        )}
        <button
          onClick={handleRegister} disabled={loading}
          style={{
            flex: onSuccess ? 'none' : 1,
            background: loading ? '#4338ca' : '#4f46e5',
            border: 'none', color: '#fff',
            fontSize: '14px', fontWeight: '600',
            padding: '11px 24px', borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4338ca' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4f46e5' }}
        >
          {loading ? 'Creating...' : 'Create Account →'}
        </button>
      </div>

    </div>
  )

  if (onSuccess) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', padding: '24px',
      }}>
        <div style={{
          width: '100%', maxWidth: '460px',
          borderRadius: '24px', border: '1px solid #2d3348',
          background: '#1a1f2e', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden',
        }}>

          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)',
            borderBottom: '1px solid #2d3348', padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              }}>👤</div>
              <div>
                <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px', margin: 0 }}>Register New Member</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Create a new user account.</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' }}
            >✕</button>
          </div>

          <div style={{ padding: '28px 32px' }}>{formContent}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#1a1f2e', border: '1px solid #2d3348', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>

        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(99,102,241,0.25) 100%)', borderBottom: '1px solid #2d3348', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>⚡</div>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '22px', margin: 0 }}>Register New User</p>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>Admin access only</p>
        </div>

        <div style={{ padding: '32px' }}>{formContent}</div>
      </div>
    </div>
  )
}