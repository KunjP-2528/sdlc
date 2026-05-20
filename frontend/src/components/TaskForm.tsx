import React, { useState, useEffect } from 'react';
import { Task, TaskRequest, TaskStatus, TaskPriority } from '../types';

interface Props {
  task?: Task | null;
  onSubmit: (data: TaskRequest) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<Props> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, dueDate: dueDate || undefined });
  };

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>{task ? 'Edit Task' : 'New Task'}</h2>

        <label style={styles.label}>Title *</label>
        <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} required />

        <label style={styles.label}>Description</label>
        <textarea style={{ ...styles.input, minHeight: 80 }} value={description} onChange={e => setDescription(e.target.value)} />

        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Priority</label>
            <select style={styles.input} value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <label style={styles.label}>Due Date</label>
        <input style={styles.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />

        <div style={styles.buttons}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" style={styles.submitBtn}>{task ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  form: {
    background: '#fff', borderRadius: 8, padding: 24, width: 480, maxWidth: '90vw',
    fontFamily: 'Inter, sans-serif',
  },
  heading: { margin: '0 0 16px', fontSize: 20, fontWeight: 600 },
  label: { display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500, color: '#333' },
  input: {
    width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const,
  },
  row: { display: 'flex', gap: 12 },
  col: { flex: 1 },
  buttons: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: {
    background: '#fff', color: '#333', border: '1px solid #ccc', padding: '8px 16px',
    borderRadius: 4, cursor: 'pointer', fontWeight: 500, fontSize: 14,
  },
  submitBtn: {
    background: '#1976d2', color: '#fff', border: 'none', padding: '8px 16px',
    borderRadius: 4, cursor: 'pointer', fontWeight: 500, fontSize: 14,
  },
};

export default TaskForm;
