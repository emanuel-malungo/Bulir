'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceAPI } from './service.services';
import type {
  IServiceFilters,
  ICreateServiceRequest,
  IUpdateServiceRequest,
  IServiceDetail,
  IServiceListResponse,
} from './service.types';

/**
 * ===== QUERY KEYS =====
 * Organização hierárquica das query keys para fácil invalidação
 */
const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters: IServiceFilters) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: number) => [...serviceKeys.details(), id] as const,
};

/**
 * ===== QUERIES =====
 */

/**
 * Hook: Obter lista de serviços com filtros
 * - Cache automático
 * - Refeth em intervalos
 * - Infinity query ready
 */
export function useServices(filters: IServiceFilters = {}, options = {}) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => ServiceAPI.getServices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)
    ...options,
  });
}

/**
 * Hook: Obter detalhes de um serviço
 */
export function useService(id: number | null, options = {}) {
  return useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: () => ServiceAPI.getServiceById(id!),
    enabled: !!id, // Só executa se id existe
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * ===== MUTATIONS =====
 */

/**
 * Hook: Criar novo serviço
 * - Invalidação automática da lista
 * - Erro handling
 * - Loading/success/error states
 */
export function useCreateService(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateServiceRequest) => ServiceAPI.createService(data),
    onSuccess: (data) => {
      // Invalidar cache da lista para refetch
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });

      // Adicionar novo serviço ao cache
      queryClient.setQueryData(
        serviceKeys.detail(data.service.id),
        data.service
      );
    },
    onError: (error) => {
      console.error('Erro ao criar serviço:', error);
    },
    ...options,
  });
}

/**
 * Hook: Atualizar serviço
 * - Atualização otimista
 * - Rollback automático em caso de erro
 */
export function useUpdateService(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateServiceRequest) => ServiceAPI.updateService(data),
    onMutate: async (newData) => {
      // Cancel queries para evitar overwrite
      await queryClient.cancelQueries({
        queryKey: serviceKeys.detail(newData.id),
      });

      // Snapshot do dado antigo
      const previousService = queryClient.getQueryData(
        serviceKeys.detail(newData.id)
      );

      // Atualização otimista
      queryClient.setQueryData(
        serviceKeys.detail(newData.id),
        (old: IServiceDetail) => ({
          ...old,
          ...newData,
        })
      );

      return { previousService };
    },
    onSuccess: (data) => {
      // Invalidar lista após sucesso
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });

      // Atualizar cache do detalhe
      queryClient.setQueryData(
        serviceKeys.detail(data.service.id),
        data.service
      );
    },
    onError: (error, newData, context: any) => {
      // Rollback em caso de erro
      if (context?.previousService) {
        queryClient.setQueryData(
          serviceKeys.detail(newData.id),
          context.previousService
        );
      }
      console.error('Erro ao atualizar serviço:', error);
    },
    ...options,
  });
}

/**
 * Hook: Deletar serviço
 * - Remove do cache imediatamente
 * - Invalidação da lista
 */
export function useDeleteService(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ServiceAPI.deleteService(id),
    onSuccess: (_, deletedId) => {
      // Remover do cache
      queryClient.removeQueries({
        queryKey: serviceKeys.detail(deletedId),
      });

      // Invalidar lista
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar serviço:', error);
    },
    ...options,
  });
}

/**
 * Hook: Ativar serviço
 */
export function useActivateService(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ServiceAPI.activateService(id),
    onSuccess: (data) => {
      queryClient.setQueryData(
        serviceKeys.detail(data.service.id),
        data.service
      );
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
    },
    ...options,
  });
}

/**
 * Hook: Desativar serviço
 */
export function useDeactivateService(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ServiceAPI.deactivateService(id),
    onSuccess: (data) => {
      queryClient.setQueryData(
        serviceKeys.detail(data.service.id),
        data.service
      );
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
    },
    ...options,
  });
}

/**
 * ===== UTILITIES =====
 */

/**
 * Hook: Prefetch de serviço por ID
 * Útil para prefetch em links antes do usuário clicar
 */
export function usePrefetchService() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: serviceKeys.detail(id),
      queryFn: () => ServiceAPI.getServiceById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Hook: Invalidar cache manual
 * Para casos especiais onde precisa forçar refetch
 */
export function useInvalidateServices() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: serviceKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: serviceKeys.lists(),
      });
    },
    invalidateDetail: (id: number) => {
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(id),
      });
    },
  };
}
