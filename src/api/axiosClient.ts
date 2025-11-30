import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // si usas cookies; si no, puedes quitarlo
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
