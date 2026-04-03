'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * Renders children only if user is authenticated and has required permissions/role
 * 
 * Usage:
 * <ProtectedRoute requiredRole="PROVIDER">
 *   <YourComponent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const authenticated = isAuthenticated();
    if (!authenticated) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/dashboard');
      return;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, hasPermission, hasRole, requiredPermission, requiredRole, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      )
    );
  }

  const authenticated = isAuthenticated();
  if (!authenticated) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
