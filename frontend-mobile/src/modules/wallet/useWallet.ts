'use client';

import { useAuthStore } from '@/modules/auth/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { WalletAPI } from './wallet.services';
import type { IReceivePaymentRequest, ITransactionFilters } from './wallet.types';

/**
 * ===== QUERY KEYS =====
 */
const walletKeys = {
  all: ['wallet'] as const,
  detail: () => [...walletKeys.all, 'detail'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
  transactionsList: (filters: ITransactionFilters) =>
    [...walletKeys.transactions(), 'list', filters] as const,
  transactionDetail: (id: number) =>
    [...walletKeys.transactions(), 'detail', id] as const,
};

/**
 * ===== QUERIES =====
 */

/**
 * Hook: Obter saldo atual
 * - Refresca automaticamente
 * - Sincroniza com auth store
 */
export function useWallet(options = {}) {
  const { user, syncWalletBalance } = useAuthStore();

  const query = useQuery({
    queryKey: walletKeys.detail(),
    queryFn: () => WalletAPI.getWallet(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000,    // 5 minutos
    refetchOnWindowFocus: true,
    ...options,
  });

  // Sincronizar com auth store quando dados carregarem
  React.useEffect(() => {
    if (query.data) {
      syncWalletBalance?.(query.data.balance);
    }
  }, [query.data, syncWalletBalance]);

  return query;
}

/**
 * Hook: Obter apenas o saldo
 * Versão leve para usar em vários lugares
 */
export function useWalletBalance(options = {}) {
  const { data: wallet } = useWallet();
  return wallet?.balance ?? 0;
}

/**
 * Hook: Listar transações
 */
export function useTransactions(
  filters: ITransactionFilters = {},
  options = {}
) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: walletKeys.transactionsList(filters),
    queryFn: () => WalletAPI.listTransactions(filters),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook: Obter detalhes de uma transação
 */
export function useTransaction(id: number | null, options = {}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: walletKeys.transactionDetail(id!),
    queryFn: () => WalletAPI.getTransaction(id!),
    enabled: !!user && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * ===== MUTATIONS =====
 */

/**
 * Hook: Carregar saldo
 */
export function useLoadBalance(options = {}) {
  const queryClient = useQueryClient();
  const { syncWalletBalance } = useAuthStore();

  return useMutation({
    mutationFn: (amount: number) => WalletAPI.loadBalance(amount),
    onSuccess: (data: any) => {
      if (!data) {
        return;
      }

      const newBalance = data?.newBalance;

      if (newBalance !== undefined && newBalance !== null) {
        // Atualizar cache da carteira
        queryClient.setQueryData(walletKeys.detail(), (old: any) => ({
          ...old,
          balance: newBalance,
        }));

        // Sincronizar com store
        syncWalletBalance?.(newBalance);
      }

      // Invalidar transações
      queryClient.invalidateQueries({
        queryKey: walletKeys.transactions(),
      });
    },
    onError: (error) => {
      // Error is handled by React Query and UI
    },
    ...options,
  });
}

/**
 * Hook: Receber pagamento (provedores)
 */
export function useReceivePayment(options = {}) {
  const queryClient = useQueryClient();
  const { syncWalletBalance } = useAuthStore();

  return useMutation({
    mutationFn: (data: IReceivePaymentRequest) =>
      WalletAPI.receivePayment(data),
    onSuccess: (data) => {
      // Atualizar cache
      queryClient.setQueryData(walletKeys.detail(), (old: any) => ({
        ...old,
        balance: data.data.newBalance,
      }));

      syncWalletBalance?.(data.data.newBalance);

      queryClient.invalidateQueries({
        queryKey: walletKeys.transactions(),
      });
    },
    onError: (error) => {
      // Error is handled by React Query and UI
    },
    ...options,
  });
}

/**
 * ===== UTILITIES =====
 */

/**
 * Hook: Validar saldo suficiente
 */
export function useHasEnoughBalance(amount: number) {
  const { data: wallet, isLoading } = useWallet();

  return {
    hasEnough: (wallet?.balance ?? 0) >= amount,
    currentBalance: wallet?.balance ?? 0,
    isLoading,
  };
}

/**
 * Hook: Invalidar cache manualmente
 */
export function useInvalidateWallet() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.all,
      });
    },
    invalidateWallet: () => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.detail(),
      });
    },
    invalidateTransactions: () => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.transactions(),
      });
    },
    invalidateBalance: () => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.balance(),
      });
    },
  };
}
