import axios, { AxiosError } from 'axios';
import ENV from './env.utils';
import { useAuthStore } from '@/modules/auth/auth.store';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // ✅ Envia cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if refresh is in progress to avoid multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// ===== Response Interceptor - Handle 401 and refresh token =====
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Se 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Se já está fazendo refresh, espera e tenta novamente
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Refresh token em cookie é enviado automaticamente
        const response = await api.post('/auth/refresh');
        
        // Access token é retornado no header Authorization
        const accessToken = response.headers['authorization']?.split(' ')[1];
        
        isRefreshing = false;
        onRefreshed(accessToken || '');
        
        // Retry a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - logout
        isRefreshing = false;
        useAuthStore.getState().logout();
        
        // Redireciona para login se não estiver em ambiente SSR
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;