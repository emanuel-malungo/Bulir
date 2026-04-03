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
  '/client',
  '/provider',
];

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROVIDER';
}

/**
 * Component to protect routes that require authentication
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isCheckingAuth, hasRole, checkAuth } = useAuthStore();

  useEffect(() => {
    // Verificar sessão apenas uma vez no mount se estiver "autenticado" no estado local
    if (isAuthenticated()) {
      checkAuth();
    } else {
      // Se já sabemos que não está autenticado, não precisamos esperar
      useAuthStore.setState({ isCheckingAuth: false });
    }
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    const authenticated = isAuthenticated();
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // 1. Not authenticated and trying to access protected route
    if (!authenticated && !isPublicRoute) {
      router.push('/auth/login');
      return;
    }

    // 2. Authenticated and trying to access public auth routes (login/register)
    if (authenticated && isPublicRoute) {
      const homePath = user?.role === 'PROVIDER' ? '/provider' : '/client';
      router.push(homePath);
      return;
    }

    // 3. Role mismatch (Provider trying to access Client routes or vice-versa)
    if (authenticated) {
      if (pathname.startsWith('/client') && !hasRole('CLIENT')) {
        router.push('/provider');
        return;
      }
      if (pathname.startsWith('/provider') && !hasRole('PROVIDER')) {
        router.push('/client');
        return;
      }
    }

    // 4. Explicit role requirement check
    if (authenticated && requiredRole && !hasRole(requiredRole)) {
      const fallbackPath = requiredRole === 'PROVIDER' ? '/client' : '/provider';
      router.push(fallbackPath);
      return;
    }
  }, [isAuthenticated, isCheckingAuth, pathname, router, user, hasRole, requiredRole]);

  // Mostrar loading apenas durante a verificação inicial de sessão
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Basic validation to prevent flickering before effect runs
  const authenticated = isAuthenticated();
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!authenticated && !isPublicRoute) return null;
  if (authenticated && isPublicRoute) return null;
  
  if (authenticated) {
    if (pathname.startsWith('/client') && !hasRole('CLIENT')) return null;
    if (pathname.startsWith('/provider') && !hasRole('PROVIDER')) return null;
    if (requiredRole && !hasRole(requiredRole)) return null;
  }

  return <>{children}</>;
}

/**
 * High-order component to protect routes that require authentication
 * Usage: export default withAuthGuard(YourComponent, 'CLIENT');
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'CLIENT' | 'PROVIDER'
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard requiredRole={requiredRole}>
        <Component {...props} />
      </AuthGuard>
    );
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

  const getHomePath = () => {
    if (!user) return '/auth/login';
    return user.role === 'PROVIDER' ? '/provider' : '/client';
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    canAccess,
    redirectIf,
    getHomePath,
    hasPermission,
    hasRole,
  };
}
