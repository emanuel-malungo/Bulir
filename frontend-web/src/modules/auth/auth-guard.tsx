'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from './auth.store';

const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/reservations',
  '/services',
  '/wallet',
];

/**
 * High-order component to protect routes that require authentication
 * Usage: export default withAuthGuard(YourComponent);
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
      const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
      );

      if (isLoading) return;

      // Se rota é protegida e não está autenticado
      if (isProtectedRoute && !isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      // Se rota é pública (login/register) e está autenticado
      if (isPublicRoute && isAuthenticated() && pathname.startsWith('/auth/login')) {
        router.push('/dashboard');
        return;
      }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Route Guard Hook - Use inside components to check authentication
 * Usage:
 * const { isAuthenticated, canAccess } = useRouteGuard();
 * if (!canAccess) return <Redirect />;
 */
export function useRouteGuard() {
  const { user, isAuthenticated, hasPermission, hasRole } = useAuthStore();
  const router = useRouter();

  const canAccess = (requiredPermission?: string, requiredRole?: string) => {
    if (!isAuthenticated()) {
      return false;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return false;
    }

    return true;
  };

  const redirectIf = (condition: boolean, path: string) => {
    if (condition) {
      router.push(path);
    }
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    canAccess,
    redirectIf,
    hasPermission,
    hasRole,
  };
}
