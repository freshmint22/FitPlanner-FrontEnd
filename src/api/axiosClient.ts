import axios from 'axios';
// Debug: show resolved API base URL at runtime
// eslint-disable-next-line no-console
console.log('VITE_API_BASE_URL=', import.meta.env.VITE_API_BASE_URL);

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Evita requisitos estrictos de CORS con credenciales si no usas cookies
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí luego podemos manejar 401, refresco de token, etc.
    if (error.response?.status === 401) {
      // p.ej. limpiar sesión o redirigir al login
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
