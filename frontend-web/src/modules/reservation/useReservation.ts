'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReservationAPI } from './reservation.services';
import type { IReservationFilters, ICreateReservationRequest } from './reservation.types';

/**
 * ===== QUERY KEYS =====
 */
const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters: IReservationFilters) =>
    [...reservationKeys.lists(), filters] as const,
  details: () => [...reservationKeys.all, 'detail'] as const,
  detail: (id: number) => [...reservationKeys.details(), id] as const,
  histories: () => [...reservationKeys.all, 'history'] as const,
  history: (id: number) => [...reservationKeys.histories(), id] as const,
  stats: () => [...reservationKeys.all, 'stats'] as const,
};

/**
 * ===== QUERIES =====
 */

/**
 * Hook: Listar reservas do usuário autenticado
 * - Paginação automática
 * - Filtros por status, data, serviço, provedor
 */
export function useReservations(filters: IReservationFilters = {}, options = {}) {
  return useQuery({
    queryKey: reservationKeys.list(filters),
    queryFn: () => ReservationAPI.listReservations(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    ...options,
  });
}

/**
 * Hook: Obter detalhes de uma reserva específica
 */
export function useReservation(id: number | null, options = {}) {
  return useQuery({
    queryKey: reservationKeys.detail(id!),
    queryFn: () => ReservationAPI.getReservationById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook: Obter histórico de status de uma reserva
 */
export function useReservationHistory(id: number | null, options = {}) {
  return useQuery({
    queryKey: reservationKeys.history(id!),
    queryFn: () => ReservationAPI.getReservationHistory(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook: Obter estatísticas do provider
 * - Total de reservas
 * - Ganhos mensais
 */
export function useProviderStats(options = {}) {
  return useQuery({
    queryKey: reservationKeys.stats(),
    queryFn: () => ReservationAPI.getProviderStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

/**
 * ===== MUTATIONS =====
 */

/**
 * Hook: Criar nova reserva
 * - Validação antes de enviar
 * - Invalidação automática da lista
 */
export function useCreateReservation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateReservationRequest) =>
      ReservationAPI.createReservation(data),
    onSuccess: (data) => {
      // Invalidar lista de reservas
      queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });

      // Adicionar ao cache
      queryClient.setQueryData(
        reservationKeys.detail(data.data.id),
        data.data
      );
    },
    onError: (error) => {
      console.error('Erro ao criar reserva:', error);
    },
    ...options,
  });
}

/**
 * Hook: Confirmar reserva
 * - Atualização otimista
 */
export function useConfirmReservation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReservationAPI.confirmReservation(id),
    onMutate: async (id) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: reservationKeys.detail(id),
      });

      // Snapshot
      const previousReservation = queryClient.getQueryData(
        reservationKeys.detail(id)
      );

      // Optimistic update
      queryClient.setQueryData(reservationKeys.detail(id), (old: any) => ({
        ...old,
        status: 'CONFIRMED',
      }));

      return { previousReservation };
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(reservationKeys.detail(id), data.data);
      queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationKeys.history(id),
      });
    },
    onError: (error, id, context: any) => {
      if (context?.previousReservation) {
        queryClient.setQueryData(
          reservationKeys.detail(id),
          context.previousReservation
        );
      }
      console.error('Erro ao confirmar reserva:', error);
    },
    ...options,
  });
}

/**
 * Hook: Cancelar reserva
 */
export function useCancelReservation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReservationAPI.cancelReservation(id),
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({
        queryKey: reservationKeys.detail(id),
      });

      // Invalidar lista
      queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
    },
    onError: (error) => {
      console.error('Erro ao cancelar reserva:', error);
    },
    ...options,
  });
}

/**
 * ===== UTILITIES =====
 */

/**
 * Hook: Invalidar cache manualmente
 */
export function useInvalidateReservations() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: reservationKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: reservationKeys.lists(),
      });
    },
    invalidateDetail: (id: number) => {
      queryClient.invalidateQueries({
        queryKey: reservationKeys.detail(id),
      });
    },
    invalidateHistory: (id: number) => {
      queryClient.invalidateQueries({
        queryKey: reservationKeys.history(id),
      });
    },
  };
}
