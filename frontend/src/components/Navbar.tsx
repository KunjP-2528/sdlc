import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/dashboard" style={styles.brandLink}>TaskManager</Link>
      </div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/tasks" style={styles.link}>Tasks</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.userName}>{user?.fullName}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: 56, backgroundColor: '#1976d2', color: '#fff',
    fontFamily: 'Inter, sans-serif',
  },
  brand: { fontWeight: 700, fontSize: 20 },
  brandLink: { color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', gap: 16 },
  link: { color: '#e3f2fd', textDecoration: 'none', fontWeight: 500, fontSize: 14 },
  user: { display: 'flex', alignItems: 'center', gap: 12 },
  userName: { fontSize: 14, fontWeight: 500 },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontWeight: 500, fontSize: 13,
  },
};

export default Navbar;
