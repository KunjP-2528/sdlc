import React from 'react';
import { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  CRITICAL: '#d32f2f', HIGH: '#f57c00', MEDIUM: '#1976d2', LOW: '#388e3c',
};

const statusLabels: Record<string, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done', CANCELLED: 'Cancelled',
};

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' && task.status !== 'CANCELLED';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{task.title}</h3>
        <span style={{ ...styles.priority, backgroundColor: priorityColors[task.priority] || '#999' }}>
          {task.priority}
        </span>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      <div style={styles.meta}>
        <span style={styles.status}>{statusLabels[task.status] || task.status}</span>
        {task.dueDate && (
          <span style={{ ...styles.due, color: isOverdue ? '#d32f2f' : '#666' }}>
            Due: {task.dueDate}
          </span>
        )}
      </div>
      <div style={styles.actions}>
        <button onClick={() => onEdit(task)} style={styles.editBtn}>Edit</button>
        <button onClick={() => onDelete(task.id)} style={styles.delBtn}>Delete</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 12,
    backgroundColor: '#fff', fontFamily: 'Inter, sans-serif',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { margin: 0, fontSize: 16, fontWeight: 600 },
  priority: { color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 },
  desc: { margin: '0 0 8px', fontSize: 14, color: '#555', lineHeight: 1.4 },
  meta: { display: 'flex', gap: 12, fontSize: 13, marginBottom: 8 },
  status: { backgroundColor: '#e3f2fd', padding: '2px 8px', borderRadius: 4, color: '#1565c0', fontWeight: 500 },
  due: { fontWeight: 500 },
  actions: { display: 'flex', gap: 8 },
  editBtn: {
    background: '#1976d2', color: '#fff', border: 'none', padding: '5px 12px',
    borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500,
  },
  delBtn: {
    background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', padding: '5px 12px',
    borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500,
  },
};

export default TaskCard;
