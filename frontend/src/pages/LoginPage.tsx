import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login({ username, password });
      login(data.token, { userId: data.userId, username: data.username, email: data.email, fullName: data.fullName });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.heading}>Task Manager</h1>
        <h2 style={styles.subHeading}>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}
        <label style={styles.label}>Username</label>
        <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} required />
        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={styles.btn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'Inter, sans-serif',
  },
  form: { background: '#fff', padding: 32, borderRadius: 12, width: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  heading: { margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#1976d2', textAlign: 'center' as const },
  subHeading: { margin: '0 0 20px', fontSize: 16, fontWeight: 400, color: '#666', textAlign: 'center' as const },
  label: { display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500, color: '#333' },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 14, marginBottom: 14, boxSizing: 'border-box' as const,
  },
  btn: {
    width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4,
  },
  error: { background: '#ffebee', color: '#c62828', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: 13 },
  link: { textAlign: 'center' as const, fontSize: 13, marginTop: 16 },
};

export default LoginPage;
