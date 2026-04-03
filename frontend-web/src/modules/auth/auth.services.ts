import axios, { AxiosError } from 'axios';
import api from '@/utils/api.utils';
import { useAuthStore } from './auth.store';
import type {
  IRegisterRequest,
  ILoginResponse,
  IRegisterResponse,
  IRefreshResponse,
  IRole,
  IRolePermissionsResponse,
} from './auth.types';

// Helper para extrair mensagem de erro do axios
const extractErrorMessage = (error: unknown): string => {
  console.log('Extratando erro:', error);
  
  if (axios.isAxiosError(error)) {
    console.log('Erro do axios - status:', error.response?.status);
    console.log('Erro do axios - data:', error.response?.data);
    
    // Tentar extrair mensagem do response data
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    // Usar a mensagem de status se disponível
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    
    // Usar o texto do erro se disponível
    if (error.message) {
      return error.message;
    }
  }
  
  return error instanceof Error ? error.message : 'Erro desconhecido';
};

export class AuthService {
  /**
   * Login user
   * - Sends credentials to backend
   * - Backend sets refreshToken in HttpOnly cookie
   * - Backend returns user data
   * - Store user in Zustand
   */
  static async login(
    email: string,
    password: string
  ): Promise<void> {
    const store = useAuthStore.getState();
    store.setLoading(true);
    store.setError(null);

    try {
      console.log('Chamando API:', {
        url: '/auth/login',
        baseURL: api.defaults.baseURL,
        fullURL: `${api.defaults.baseURL}auth/login`,
        identifier: email,
      });
      
      const response = await api.post<ILoginResponse>('/auth/login', {
        identifier: email,
        password,
      });
      
      console.log('Resposta da API:', response.data);

      // ✅ Store user (tokens are in HttpOnly cookie)
      store.setUser(response.data.user);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Erro no login:', message, error);
      store.setError(message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }

  /**
   * Register new user
   * - Sends registration data to backend
   * - Backend sets refreshToken in HttpOnly cookie
   * - Backend returns user data
   * - Auto-login after registration
   */
  static async register(
    data: Omit<IRegisterRequest, 'roleId'> & {
      roleId: number;
      recaptchaToken?: string;
    }
  ): Promise<void> {
    const store = useAuthStore.getState();
    store.setLoading(true);
    store.setError(null);

    try {
      console.log('📤 Enviando registro para API...');
      const response = await api.post<IRegisterResponse>('/auth/register', data);
      console.log('✅ Resposta do registro:', response.data);

      // ✅ Store user (tokens are in HttpOnly cookie)
      store.setUser(response.data.user);
      store.setLoading(false);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('❌ Erro no registro:', message, error);
      store.setError(message);
      store.setLoading(false);
      throw error;
    }
  }

  /**
   * Logout user
   * - Calls backend to invalidate session
   * - Backend clears HttpOnly cookie
   * - Clear user from store
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout, still clear store
    } finally {
      useAuthStore.getState().logout();
    }
  }

  /**
   * Get all available roles (public route)
   */
  static async getRoles(): Promise<IRole[]> {
    const response = await api.get<{ roles: IRole[] }>('/auth/roles');
    return response.data.roles;
  }

  /**
   * Get permissions for a specific role (public route)
   * - Used to show UI based on role before login
   */
  static async getPermissionsByRole(
    roleId: number
  ): Promise<IRolePermissionsResponse> {
    const response = await api.get<IRolePermissionsResponse>(
      `/auth/role/${roleId}/permissions`
    );
    return response.data;
  }
}


