import api from '@/utils/api.utils';
import {
  createServiceSchema,
  updateServiceSchema,
  serviceFiltersSchema,
} from './service.schema';
import type {
  ICreateServiceRequest,
  IUpdateServiceRequest,
  IServiceDetail,
  IServiceListResponse,
  ICreateServiceResponse,
  IUpdateServiceResponse,
  IDeleteServiceResponse,
  IServiceFilters,
} from './service.types';

/**
 * Service API calls
 * - Todas as chamadas à API passam por aqui
 * - Validação com Zod antes de enviar
 * - Tipagem forte
 */
export class ServiceAPI {
  /**
   * Get all services com filtros
   * @param filters - Págination, search, filters
   * @returns Lista paginada de serviços
   */
  static async getServices(filters: IServiceFilters = {}): Promise<IServiceListResponse> {
    const validatedFilters = serviceFiltersSchema.parse(filters);

    const response = await api.get<IServiceListResponse>('/services', {
      params: validatedFilters,
    });

    return response.data;
  }

  /**
   * Get serviço por ID
   * @param id - ID do serviço
   * @returns Detalhes completos do serviço
   */
  static async getServiceById(id: number): Promise<IServiceDetail> {
    const response = await api.get<IServiceDetail>(`/services/${id}`);
    return response.data;
  }

  /**
   * Criar novo serviço (PROVIDER only)
   * @param data - Dados do serviço
   * @returns Serviço criado
   */
  static async createService(
    data: ICreateServiceRequest
  ): Promise<ICreateServiceResponse> {
    const validatedData = createServiceSchema.parse(data);
    const response = await api.post<ICreateServiceResponse>('/services', validatedData);
    return response.data;
  }

  /**
   * Atualizar serviço (PROVIDER only)
   * @param data - Dados a atualizar (id obrigatório)
   * @returns Serviço atualizado
   */
  static async updateService(
    data: IUpdateServiceRequest
  ): Promise<IUpdateServiceResponse> {
    const validatedData = updateServiceSchema.parse(data);
    const { id, ...rest } = validatedData;

    const response = await api.patch<IUpdateServiceResponse>(
      `/services/${id}`,
      rest
    );
    return response.data;
  }

  /**
   * Deletar serviço (PROVIDER only)
   * @param id - ID do serviço
   */
  static async deleteService(id: number): Promise<IDeleteServiceResponse> {
    const response = await api.delete<IDeleteServiceResponse>(`/services/${id}`);
    return response.data;
  }

  /**
   * Ativar serviço
   * @param id - ID do serviço
   */
  static async activateService(id: number): Promise<IUpdateServiceResponse> {
    const response = await api.patch<IUpdateServiceResponse>(`/services/${id}`, {
      isActive: true,
    });
    return response.data;
  }

  /**
   * Desativar serviço
   * @param id - ID do serviço
   */
  static async deactivateService(id: number): Promise<IUpdateServiceResponse> {
    const response = await api.patch<IUpdateServiceResponse>(`/services/${id}`, {
      isActive: false,
    });
    return response.data;
  }
}
