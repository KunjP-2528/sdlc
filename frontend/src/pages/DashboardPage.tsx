import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../services/api';
import { DashboardStats } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskApi.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome back, {user?.fullName}</h1>

      <div style={styles.grid}>
        <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} color="#1976d2" />
        <StatCard label="Completed" value={stats?.completedTasks ?? 0} color="#388e3c" />
        <StatCard label="Pending" value={stats?.pendingTasks ?? 0} color="#f57c00" />
        <StatCard label="Overdue" value={stats?.overdueTasks ?? 0} color="#d32f2f" />
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Tasks by Status</h3>
          {stats?.tasksByStatus && Object.entries(stats.tasksByStatus).map(([key, val]) => (
            <BarRow key={key} label={key} value={val} total={stats.totalTasks} color="#1976d2" />
          ))}
          {(!stats?.tasksByStatus || Object.keys(stats.tasksByStatus).length === 0) && (
            <p style={styles.empty}>No data yet</p>
          )}
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Tasks by Priority</h3>
          {stats?.tasksByPriority && Object.entries(stats.tasksByPriority).map(([key, val]) => {
            const colors: Record<string, string> = { CRITICAL: '#d32f2f', HIGH: '#f57c00', MEDIUM: '#1976d2', LOW: '#388e3c' };
            return <BarRow key={key} label={key} value={val} total={stats.totalTasks} color={colors[key] || '#999'} />;
          })}
          {(!stats?.tasksByPriority || Object.keys(stats.tasksByPriority).length === 0) && (
            <p style={styles.empty}>No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
    <div style={{ ...styles.statValue, color }}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const BarRow: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => (
  <div style={styles.barRow}>
    <span style={styles.barLabel}>{label}</span>
    <div style={styles.barTrack}>
      <div style={{ ...styles.barFill, width: `${total > 0 ? (value / total) * 100 : 0}%`, backgroundColor: color }} />
    </div>
    <span style={styles.barValue}>{value}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  heading: { margin: '0 0 24px', fontSize: 24, fontWeight: 600, color: '#333' },
  loading: { padding: 40, textAlign: 'center', color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  statCard: {
    backgroundColor: '#fff', padding: 20, borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  statValue: { fontSize: 36, fontWeight: 700 },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  chartCard: { backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  chartTitle: { margin: '0 0 12px', fontSize: 16, fontWeight: 600 },
  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  barLabel: { width: 90, fontSize: 12, fontWeight: 500, textTransform: 'capitalize' as const },
  barTrack: { flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.3s' },
  barValue: { width: 24, textAlign: 'right', fontSize: 13, fontWeight: 600 },
  empty: { color: '#999', fontSize: 13 },
};

export default DashboardPage;
