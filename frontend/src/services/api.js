import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Sweets API
export const sweetsAPI = {
  getAll: (page = 0, size = 12) => api.get(`/sweets?page=${page}&size=${size}`),
  getById: (id) => api.get(`/sweets/${id}`),
  search: (params) => api.get('/sweets/search', { params }),
  create: (data) => api.post('/sweets', data),
  update: (id, data) => api.put(`/sweets/${id}`, data),
  delete: (id) => api.delete(`/sweets/${id}`),
  purchase: (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity }),
};

export default api;

