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
    password: string,
    recaptchaToken?: string
  ): Promise<void> {
    const store = useAuthStore.getState();
    store.setLoading(true);
    store.setError(null);

    try {
      const response = await api.post<ILoginResponse>('/auth/login', {
        identifier: email,
        password,
        recaptchaToken,
      });

      // ✅ Store user (tokens are in HttpOnly cookie)
      store.setUser(response.data.user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao fazer login';
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
      const response = await api.post<IRegisterResponse>('/auth/register', data);

      // ✅ Store user (tokens are in HttpOnly cookie)
      store.setUser(response.data.user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao registrar';
      store.setError(message);
      throw error;
    } finally {
      store.setLoading(false);
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


