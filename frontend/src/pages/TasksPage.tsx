import React, { useEffect, useState, useCallback } from 'react';
import { taskApi } from '../services/api';
import { Task, TaskRequest } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await taskApi.getAll();
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data: TaskRequest) => {
    await taskApi.create(data);
    setShowForm(false);
    fetchTasks();
  };

  const handleUpdate = async (data: TaskRequest) => {
    if (editingTask) {
      await taskApi.update(editingTask.id, data);
      setEditingTask(null);
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this task?')) {
      await taskApi.delete(id);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    return true;
  });

  if (loading) return <div style={styles.loading}>Loading tasks...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Tasks</h1>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ New Task</button>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select style={styles.select} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <span style={styles.count}>{filteredTasks.length} task(s)</span>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={styles.empty}>No tasks found. Create one to get started!</div>
      ) : (
        filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDelete} />
        ))
      )}

      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 24, maxWidth: 800, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { margin: 0, fontSize: 24, fontWeight: 600 },
  addBtn: {
    background: '#1976d2', color: '#fff', border: 'none', padding: '10px 20px',
    borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
  filters: { display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' },
  select: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 13 },
  count: { marginLeft: 'auto', fontSize: 13, color: '#999' },
  loading: { padding: 40, textAlign: 'center', color: '#999' },
  empty: { padding: 40, textAlign: 'center', color: '#999', fontSize: 15 },
};

export default TasksPage;
