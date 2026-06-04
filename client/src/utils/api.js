import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Automatically inject JWT token into all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response error interceptor to handle token expiry / invalidation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear tokens from local storage so context updates state
    if (error.response && error.response.status === 401) {
      console.warn('[API Interceptor] 401 Unauthorized - clearing local token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
