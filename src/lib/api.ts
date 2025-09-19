import axios from "axios";

// Detectar automáticamente el entorno y usar variables de entorno
const isDevelopment = import.meta.env.DEV || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_API_URL_PRODUCTION;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Si es FormData, remover Content-Type para que axios lo configure automáticamente
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
