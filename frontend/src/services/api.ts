import axios from 'axios';
import { AuthResponse, DashboardStats, LoginRequest, RegisterRequest, Task, TaskRequest } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/api/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/api/auth/register', data),
};

export const taskApi = {
  getAll: () => api.get<Task[]>('/api/tasks'),
  getById: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  create: (data: TaskRequest) => api.post<Task>('/api/tasks', data),
  update: (id: string, data: TaskRequest) => api.put<Task>(`/api/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/api/tasks/${id}`),
  getDashboardStats: () => api.get<DashboardStats>('/api/tasks/dashboard/stats'),
};

export default api;
