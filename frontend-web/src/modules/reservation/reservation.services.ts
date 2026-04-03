import api from '@/utils/api.utils';
import {
  createReservationSchema,
  updateReservationStatusSchema,
  reservationFiltersSchema,
} from './reservation.schema';
import type {
  ICreateReservationRequest,
  IUpdateReservationStatusRequest,
  IReservation,
  IReservationListResponse,
  ICreateReservationResponse,
  IUpdateReservationStatusResponse,
  ICancelReservationResponse,
  IReservationHistoryResponse,
  IReservationFilters,
} from './reservation.types';

/**
 * Reservation API calls
 * - Chamadas autenticadas à API de reservas
 * - Validação com Zod antes de enviar
 * - Tipagem forte para reservas, status, histórico
 */
export class ReservationAPI {
  /**
   * Listar reservas do usuário autenticado
   * @param filters - Paginação e filtros
   * @returns Lista paginada de reservas
   */
  static async listReservations(
    filters: IReservationFilters = {}
  ): Promise<IReservationListResponse> {
    const validatedFilters = reservationFiltersSchema.parse(filters);

    const response = await api.get<IReservationListResponse>('/reservations', {
      params: validatedFilters,
    });

    return response.data;
  }

  /**
   * Obter detalhes de uma reserva
   * @param id - ID da reserva
   * @returns Detalhes da reserva
   */
  static async getReservationById(id: number): Promise<IReservation> {
    const response = await api.get<IReservation>(`/reservations/${id}`);
    return response.data;
  }

  /**
   * Criar nova reserva
   * @param data - Dados da reserva (serviceId, providerId, scheduledAt)
   * @returns Reserva criada
   */
  static async createReservation(
    data: ICreateReservationRequest
  ): Promise<ICreateReservationResponse> {
    const validatedData = createReservationSchema.parse(data);

    const response = await api.post<ICreateReservationResponse>(
      '/reservations',
      validatedData
    );

    return response.data;
  }

  /**
   * Atualizar status da reserva
   * @param id - ID da reserva
   * @param status - Novo status (PENDING, CONFIRMED, CANCELED)
   * @returns Reserva atualizada
   */
  static async updateReservationStatus(
    id: number,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED'
  ): Promise<IUpdateReservationStatusResponse> {
    const validatedData = updateReservationStatusSchema.parse({ status });

    const response = await api.patch<IUpdateReservationStatusResponse>(
      `/reservations/${id}/status`,
      validatedData
    );

    return response.data;
  }

  /**
   * Confirmar reserva
   * @param id - ID da reserva
   * @returns Reserva confirmada
   */
  static async confirmReservation(
    id: number
  ): Promise<IUpdateReservationStatusResponse> {
    return this.updateReservationStatus(id, 'CONFIRMED');
  }

  /**
   * Cancelar reserva
   * @param id - ID da reserva
   * @returns Mensagem de sucesso
   */
  static async cancelReservation(id: number): Promise<ICancelReservationResponse> {
    const response = await api.delete<ICancelReservationResponse>(
      `/reservations/${id}`
    );

    return response.data;
  }

  /**
   * Obter histórico de status da reserva
   * @param id - ID da reserva
   * @returns Histórico de mudanças de status
   */
  static async getReservationHistory(
    id: number
  ): Promise<IReservationHistoryResponse> {
    const response = await api.get<IReservationHistoryResponse>(
      `/reservations/${id}/history`
    );

    return response.data;
  }
}
