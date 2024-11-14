// axiosInstance.ts
import axios from 'axios';

// Recuperar el token del localStorage (o sessionStorage)
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3005/api/', // Cambia esto a tu servidor backend
});

// Interceptor para agregar el token a cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Agregar el token en los encabezados de la solicitud
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas de error (por ejemplo, si el token es inválido)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token es inválido o caducado, redirigir al login
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;