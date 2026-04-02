import api from '@/utils/api.utils';
import type {
  IRegisterRequest,
  ILoginResponse,
  IRegisterResponse,
  IRefreshResponse,
  IRole,
  IRolePermissionsResponse,
} from './auth.types';

export class AuthService {

  static async login(
    email: string,
    password: string,
    recaptchaToken: string
  ): Promise<ILoginResponse> {
    const response = await api.post<ILoginResponse>('/auth/login', {
      identifier: email,
      password,
      recaptchaToken,
    });
    return response.data;
  }

  static async register(
    data: Omit<IRegisterRequest, 'roleId'> & {
      roleId: number;
      recaptchaToken: string;
    }
  ): Promise<IRegisterResponse> {
    const response = await api.post<IRegisterResponse>('/auth/register', data);
    return response.data;
  }


  static async refresh(refreshToken: string): Promise<IRefreshResponse> {
    const response = await api.post<IRefreshResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  }

  static async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  }

  static async getRoles(): Promise<IRole[]> {
    const response = await api.get<IRole[]>('/auth/roles');
    return response.data;
  }

  static async getPermissionsByRole(
    roleId: number
  ): Promise<IRolePermissionsResponse> {
    const response = await api.get<IRolePermissionsResponse>(
      `/auth/permissions/role/${roleId}`
    );
    return response.data;
  }
}


