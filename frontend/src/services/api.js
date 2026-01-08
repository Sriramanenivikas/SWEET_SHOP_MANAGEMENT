import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// SECURE: Tokens are stored in HttpOnly cookies, NOT in localStorage
// JavaScript cannot access HttpOnly cookies - protects against XSS attacks
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Send cookies with every request
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// No request interceptor needed - cookies are sent automatically by browser

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint - cookies sent automatically
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Refresh successful - new cookies are set automatically by backend
        processQueue(null);
        
        // Retry original request - new cookies will be sent
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user must login again
        processQueue(refreshError);
        localStorage.removeItem('user'); // Only remove user info, not tokens
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  refresh: () => api.post('/auth/refresh', {}), // No need to send refresh token - it's in cookie
  logout: () => api.post('/auth/logout', {}),   // No need to send refresh token - it's in cookie
  logoutAll: () => api.post('/auth/logout-all'),
};

export const sweetsAPI = {
  getAll: (page = 0, size = 20) => api.get(`/sweets?page=${page}&size=${size}`),
  search: (params) => api.get('/sweets/search', { params }),
  getById: (id) => api.get(`/sweets/${id}`),
  create: (data) => api.post('/sweets', data),
  update: (id, data) => api.put(`/sweets/${id}`, data),
  delete: (id) => api.delete(`/sweets/${id}`),
  purchase: (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity: parseInt(quantity) }),
};

export default api;
