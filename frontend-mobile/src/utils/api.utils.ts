import { useAuthStore } from '@/modules/auth/auth.store';
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import ENV from './env.utils';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  // withCredentials NÃO se aplica em React Native
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if refresh is in progress to avoid multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let lastAccessToken: string = '';

const onRefreshed = (token: string) => {
  lastAccessToken = token;
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper para fazer logout e redirecionar
const handleLogout = async () => {
  isRefreshing = false;
  useAuthStore.getState().logout();
  
  // Limpar token do secure store
  try {
    await SecureStore.deleteItemAsync('accessToken');
  } catch (error) {
    // Silently handle cleanup errors
  }
  
  // Nota: A navegação será feita automaticamente pelo protected-route-mobile.tsx
  // quando detectar que o usuário não está mais autenticado
};

// ===== Request Interceptor - Add Access Token to headers =====
api.interceptors.request.use(
  (config) => {
    // Add the last received access token to the request
    if (lastAccessToken) {
      config.headers.Authorization = `Bearer ${lastAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== Response Interceptor - Handle 401 and refresh token =====
api.interceptors.response.use(
  (response) => {
    // Capture access token from response header if present
    const authHeader = response.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      lastAccessToken = authHeader.slice(7); // Remove 'Bearer ' prefix
      // Opcionalmente, salvar token em secure store
      SecureStore.setItemAsync('accessToken', lastAccessToken).catch(() => {
        // Silently handle token save errors
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Se 401 e ainda não tentou refresh
    // NÃO fazer refresh em rotas de auth (login, register, refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const urlPath = originalRequest.url || '';
      const isAuthRoute = urlPath.includes('/auth/login') || 
                          urlPath.includes('/auth/register') || 
                          urlPath.includes('/auth/refresh');
      
      // Se é rota de auth, apenas rejeitar o erro
      if (isAuthRoute) {
        return Promise.reject(error);
      }

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
        // Refresh token em cookie é enviado automaticamente pelo backend
        const response = await api.post('/auth/refresh');
        
        // Access token é retornado no header Authorization
        const accessToken = response.headers['authorization']?.split(' ')[1];
        
        isRefreshing = false;
        onRefreshed(accessToken || '');
        
        // Retry a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - logout
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;