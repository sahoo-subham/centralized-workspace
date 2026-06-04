import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login');  
    } catch (err) {
      const msg = err.response?.data?.email?.[0]
               || err.response?.data?.message
               || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', justifyContent:'center',
                   alignItems:'center', height:'100vh' }}>
      <div style={{ width:'320px', padding:'32px',
                    border:'0.5px solid #ddd', borderRadius:'12px' }}>

        <h2 style={{ margin:'0 0 4px' }}>Create an account</h2>
        <p style={{ margin:'0 0 20px', fontSize:'14px', color:'gray' }}>
          Join your team workspace
        </p>

        {error && (
          <p style={{ color:'red', fontSize:'13px', marginBottom:'12px' }}>
            {error}
          </p>
        )}

        <label style={{ fontSize:'13px' }}>Full name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width:'100%', marginBottom:'12px', boxSizing:'border-box' }}
        />

        <label style={{ fontSize:'13px' }}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width:'100%', marginBottom:'12px', boxSizing:'border-box' }}
        />

        <label style={{ fontSize:'13px' }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width:'100%', marginBottom:'12px', boxSizing:'border-box' }}
        />

        <label style={{ fontSize:'13px' }}>Confirm password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width:'100%', marginBottom:'20px', boxSizing:'border-box' }}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width:'100%', padding:'10px', fontWeight:'500' }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ textAlign:'center', fontSize:'13px', marginTop:'16px' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>

      </div>
    </div>
  );
}