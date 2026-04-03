import api from '@/utils/api.utils';
import {
  updateUserSchema,
  changePasswordSchema,
  userFiltersSchema,
} from './user.schema';
import type {
  IUpdateUserRequest,
  IChangePasswordRequest,
  IUserDetail,
  IUserListResponse,
  IUpdateUserResponse,
  IChangePasswordResponse,
  ISessionsResponse,
  ILogoutSessionResponse,
  ILogoutAllSessionsResponse,
  IUserFilters,
} from './user.types';

/**
 * User API calls
 * - Chamadas autenticadas à API de usuários
 * - Validação com Zod antes de enviar
 * - Tipagem forte para perfil, senha, sessões
 */
export class UserAPI {
  /**
   * Obter usuário logado (perfil)
   * @returns Detalhes do usuário autenticado
   */
  static async getCurrentUser(): Promise<IUserDetail> {
    const response = await api.get<IUserDetail>('/users/me');
    return response.data;
  }

  /**
   * Obter detalhes de um usuário por ID
   * @param id - ID do usuário
   * @returns Detalhes do usuário
   */
  static async getUserById(id: number): Promise<IUserDetail> {
    const response = await api.get<IUserDetail>(`/users/${id}`);
    return response.data;
  }

  /**
   * Listar usuários (admin only)
   * @param filters - Paginação e filtros
   * @returns Lista paginada de usuários
   */
  static async listUsers(filters: IUserFilters = {}): Promise<IUserListResponse> {
    const validatedFilters = userFiltersSchema.parse(filters);

    const response = await api.get<IUserListResponse>('/users', {
      params: validatedFilters,
    });

    return response.data;
  }

  /**
   * Atualizar dados do usuário
   * @param userId - ID do usuário (pode ser "me" para usuário logado)
   * @param data - Dados a atualizar
   * @returns Usuário atualizado
   */
  static async updateUser(
    userId: number | string,
    data: IUpdateUserRequest
  ): Promise<IUpdateUserResponse> {
    const validatedData = updateUserSchema.parse(data);

    const response = await api.put<IUpdateUserResponse>(
      `/users/${userId}`,
      validatedData
    );

    return response.data;
  }

  /**
   * Mudar senha
   * @param userId - ID do usuário
   * @param data - Senhas atual e nova
   * @returns Mensagem de sucesso
   */
  static async changePassword(
    userId: number | string,
    data: IChangePasswordRequest
  ): Promise<IChangePasswordResponse> {
    const validatedData = changePasswordSchema.parse(data);

    const response = await api.patch<IChangePasswordResponse>(
      `/users/${userId}/password`,
      validatedData
    );

    return response.data;
  }

  /**
   * Obter sessões ativas do usuário
   * @param userId - ID do usuário
   * @returns Lista de sessões
   */
  static async getSessions(userId: number | string): Promise<ISessionsResponse> {
    const response = await api.get<ISessionsResponse>(`/users/${userId}/sessions`);
    return response.data;
  }

  /**
   * Revogar uma sessão específica
   * @param userId - ID do usuário
   * @param sessionId - ID da sessão
   * @returns Mensagem de sucesso
   */
  static async revokeSession(
    userId: number | string,
    sessionId: number
  ): Promise<ILogoutSessionResponse> {
    const response = await api.delete<ILogoutSessionResponse>(
      `/users/${userId}/sessions/${sessionId}`
    );

    return response.data;
  }

  /**
   * Revogar todas as sessões do usuário
   * @param userId - ID do usuário
   * @returns Mensagem com número de sessões encerradas
   */
  static async revokeAllSessions(
    userId: number | string
  ): Promise<ILogoutAllSessionsResponse> {
    const response = await api.post<ILogoutAllSessionsResponse>(
      `/users/${userId}/sessions/logout-all`
    );

    return response.data;
  }

  /**
   * Deletar conta de usuário
   * @param userId - ID do usuário
   * @returns Mensagem de sucesso
   */
  static async deleteUser(userId: number | string) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }
}
