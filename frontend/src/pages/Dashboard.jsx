import { logout } from '../services/authService';

function Dashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>Dashboard</h2>
      <p>You are logged in!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard