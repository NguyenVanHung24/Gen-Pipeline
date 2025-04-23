import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACK_END_URL,
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/users/refresh-token', {}, {
          withCredentials: true
        });
        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('accessToken');
        alert('Refresh token failed, redirecting to login');
        window.location.href = '/blog/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 