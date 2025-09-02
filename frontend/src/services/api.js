import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор: добавляет Bearer токен ко всем запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор: если access токен истёк — обновим его
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh,
        });

        localStorage.setItem('access', response.data.access);
        api.defaults.headers.Authorization = `Bearer ${response.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (err) {
        // Если и refresh не помог — выходим
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login'; // или куда надо
      }
    }

    return Promise.reject(error);
  }
);

export default api;
