'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antigo cacheTime)
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider wrapper
 * Adicione em seu app/layout.tsx como:
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <QueryProvider>
 *       {...children}
 *     </QueryProvider>
 *   );
 * }
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default queryClient;
