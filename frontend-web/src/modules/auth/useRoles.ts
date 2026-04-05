'use client';

import { useEffect, useState } from 'react';
import { AuthService } from './auth.services';
import type { IRole } from './auth.types';

/**
 * Hook para carregar a lista de roles disponíveis
 * Rota pública - não requer autenticação
 */
export function useRoles() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await AuthService.getRoles();
        setRoles(data);
      } catch (err) {
        console.error('Erro ao carregar roles:', err);
        setError('Erro ao carregar tipos de conta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    error,
  };
}

/**
 * Hook para carregar a lista completa de roles (Admin)
 * Rota privada - requer autenticação e papel de admin
 */
export function useAdminRoles() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await AuthService.getAdminRoles();
        setRoles(data);
      } catch (err) {
        console.error('Erro ao carregar admin roles:', err);
        setError('Erro ao carregar tipos de conta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    error,
  };
}
