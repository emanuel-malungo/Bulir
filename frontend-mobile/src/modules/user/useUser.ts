'use client';

import { useAuthStore } from '@/modules/auth/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserAPI } from './user.services';
import type { IChangePasswordRequest, IUpdateUserRequest, IUserFilters } from './user.types';

/**
 * ===== QUERY KEYS =====
 */
const userKeys = {
  all: ['users'] as const,
  currentUser: () => [...userKeys.all, 'current'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: IUserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...userKeys.details(), id] as const,
  sessions: () => [...userKeys.all, 'sessions'] as const,
  session: (userId: number | string) => [...userKeys.sessions(), userId] as const,
};

/**
 * ===== QUERIES =====
 */

/**
 * Hook: Obter usuário logado (perfil atual)
 * - Cache de 10 minutos
 * - Refetch ao voltar tab
 */
export function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: userKeys.currentUser(),
    queryFn: () => UserAPI.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
    ...options,
  });
}

/**
 * Hook: Obter detalhes de usuário por ID
 */
export function useUser(id: number | string | null, options = {}) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => UserAPI.getUserById(id as number),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook: Listar usuários (admin)
 */
export function useUsers(filters: IUserFilters = {}, options = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => UserAPI.listUsers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook: Obter sessões ativas
 */
export function useSessions(userId: number | string | null, options = {}) {
  return useQuery({
    queryKey: userKeys.session(userId!),
    queryFn: () => UserAPI.getSessions(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos (sessões mudam mais frequentemente)
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * ===== MUTATIONS =====
 */

/**
 * Hook: Atualizar dados do usuário
 * - Atualização otimista
 * - Sincroniza com auth store
 */
export function useUpdateUser(options = {}) {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number | string;
      data: IUpdateUserRequest;
    }) => UserAPI.updateUser(userId, data),
    onMutate: async ({ userId, data }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(userId),
      });

      // Snapshot old data
      const previousUser = queryClient.getQueryData(userKeys.detail(userId));

      // Optimistic update
      queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousUser, userId };
    },
    onSuccess: (data, { userId }) => {
      queryClient.setQueryData(userKeys.detail(userId), data.user);

      // Atualizar auth store se for usuário logado
      const currentUser = queryClient.getQueryData(userKeys.currentUser());
      if (currentUser && (currentUser as any).id === userId) {
        authStore.setUser(data.user);
      }
    },
    onError: (error, { userId }, context: any) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(userId), context.previousUser);
      }
    },
    ...options,
  });
}

/**
 * Hook: Mudar senha
 */
export function useChangePassword(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number | string;
      data: IChangePasswordRequest;
    }) => UserAPI.changePassword(userId, data),
    onSuccess: () => {
      // Invalidar sessões após mudar senha (sessão atual mantém, outras revogadas)
      queryClient.invalidateQueries({
        queryKey: userKeys.sessions(),
      });
    },
    onError: (error) => {
      // Error is handled by React Query and UI
    },
    ...options,
  });
}

/**
 * Hook: Revogar uma sessão
 */
export function useRevokeSession(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      sessionId,
    }: {
      userId: number | string;
      sessionId: number;
    }) => UserAPI.revokeSession(userId, sessionId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.session(userId),
      });
    },
    ...options,
  });
}

/**
 * Hook: Revogar todas as sessões
 */
export function useRevokeAllSessions(options = {}) {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: (userId: number | string) =>
      UserAPI.revokeAllSessions(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.session(userId),
      });

      // Logout após revogar todas sessões
      authStore.logout();
      // Nota: No mobile, a navegação é feita automaticamente por protected-route-mobile.tsx
    },
    ...options,
  });
}

/**
 * Hook: Deletar usuário
 */
export function useDeleteUser(options = {}) {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: (userId: number | string) => UserAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: userKeys.all,
      });

      // Logout after deletion
      authStore.logout();
      // Nota: No mobile, a navegação é feita automaticamente por protected-route-mobile.tsx
    },
    ...options,
  });
}

/**
 * ===== UTILITIES =====
 */

/**
 * Hook: Invalidar cache do usuário
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
    invalidateCurrent: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.currentUser(),
      });
    },
    invalidateDetail: (id: number | string) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
      });
    },
    invalidateSessions: (userId: number | string) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.session(userId),
      });
    },
  };
}
