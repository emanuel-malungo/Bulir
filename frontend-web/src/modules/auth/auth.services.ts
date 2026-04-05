import axios, { AxiosError } from 'axios';
import api, { clearAccessToken } from '@/utils/api.utils';
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
   * - Backend returns accessToken in response and Authorization header
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
      console.log('🔑 [AUTH] ===== LOGIN INICIADO =====');
      console.log('📧 [AUTH] Email:', email.substring(0, 5) + '...');
      console.log('🛰️ [AUTH] Endpoint:', `${api.defaults.baseURL}auth/login`);
      
      const response = await api.post<ILoginResponse>('auth/login', {
        identifier: email,
        password,
      });
      
      console.log('✅ [AUTH] Response do login recebido');
      console.log('👤 [AUTH] Usuário:', response.data.user?.email);
      console.log('🔑 [AUTH] AccessToken na resposta:', response.data.accessToken?.substring(0, 20) + '...');
      console.log('🍪 [AUTH] Cookies sendo setados automaticamente pelo backend');
      console.log('📊 [AUTH] Dados do usuário:', {
        id: response.data.user?.id,
        email: response.data.user?.email,
        role: response.data.user?.role,
        permissions: response.data.user?.permissions?.length || 0
      });

      // ✅ Store user (accessToken will be used by axios interceptor)
      store.setUser(response.data.user);
      console.log('✅ [AUTH] Usuário armazenado no Zustand Store');
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('❌ [AUTH] ERRO NO LOGIN:', message);
      console.error('❌ [AUTH] Erro completo:', error);
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
   * - Backend returns accessToken in response and Authorization header
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
      console.log('📝 [AUTH] Iniciando registro:', data.email);
       const response = await api.post<IRegisterResponse>('auth/register', data);
      console.log('✅ [AUTH] Registro realizado com sucesso');
      
      console.log('Access Token obtido no registro:', response.data.accessToken ? 'SIM' : 'NÃO');

      // ✅ Store user (accessToken will be used by axios interceptor)
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
      await api.post('auth/logout');
    } catch {
      // Ignore errors on logout, still clear store
    } finally {
      clearAccessToken();
      useAuthStore.getState().logout();
    }
  }

  /**
   * Get all available roles (public route)
   */
  static async getRoles(): Promise<IRole[]> {
    const response = await api.get<{ roles: IRole[] }>('auth/roles');
    return response.data.roles;
  }

  /**
   * Get all available roles for admin (private route)
   */
  static async getAdminRoles(): Promise<IRole[]> {
    const response = await api.get<{ data: IRole[] }>('roles');
    return response.data.data;
  }

  /**
   * Get permissions for a specific role (public route)
   * - Used to show UI based on role before login
   */
  static async getPermissionsByRole(
    roleId: number
  ): Promise<IRolePermissionsResponse> {
    const response = await api.get<IRolePermissionsResponse>(
      `auth/role/${roleId}/permissions`
    );
    return response.data;
  }

  /**
   * Verify if current session is valid
   * - Calls refresh endpoint
   * - If successful, session is valid and access token is updated
   */
  static async verifySession(): Promise<ILoginResponse['user']> {
    try {
      console.log('� [AUTH] ===== VERIFICANDO SESSÃO =====');
      console.log('🛰️ [AUTH] Endpoint:', `${api.defaults.baseURL}auth/refresh`);
      console.log('🍪 [AUTH] RefreshToken será enviado via cookie (HttpOnly)');
      
      const response = await api.post<ILoginResponse>('auth/refresh');
      
      console.log('✅ [AUTH] Sessão válida e verificada');
      console.log('✅ [AUTH] Novo AccessToken recebido no header');
      
      // A resposta do refresh no backend atual parece retornar { accessToken }
      // Mas o login retorna { user, accessToken, refreshToken }
      // Vamos assumir que se o refresh funcionar, a sessão está ativa.
      // Se precisarmos dos dados do usuário atualizados, teríamos que implementar /auth/me
      // Por ora, vamos retornar o usuário do store se o refresh funcionar
      const currentUser = useAuthStore.getState().user;
      console.log('👤 [AUTH] Usuário atual no store:', currentUser?.email);
      
      return currentUser!;
    } catch (error) {
      console.error('❌ [AUTH] ERRO AO VERIFICAR SESSÃO:', error);
      throw error;
    }
  }
}


