'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from './auth.store';

// Rotas que NÃO exigem autenticação
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROVIDER';
}

/**
 * Componente para proteger rotas que exigem autenticação.
 * Ele gerencia o estado de autenticação e redireciona o usuário conforme necessário.
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isCheckingAuth, checkAuth, hasRole } = useAuthStore();

  useEffect(() => {
    // A verificação de autenticação só deve ocorrer se não estivermos em uma rota pública
    // e se houver um token (isAuthenticated), ou se o estado de verificação ainda não foi iniciado.
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    if (!isPublicRoute) {
      checkAuth();
    } else {
      // Em rotas públicas, garantimos que o loading não seja exibido desnecessariamente
      useAuthStore.setState({ isCheckingAuth: false });
    }
  }, [pathname, checkAuth]);

  useEffect(() => {
    // Não faz nada enquanto a autenticação está sendo verificada
    if (isCheckingAuth) return;

    const authenticated = isAuthenticated();
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // Cenário 1: Usuário autenticado tentando acessar uma rota pública (login/registro)
    // Redireciona para a página principal baseada na sua role.
    if (authenticated && isPublicRoute) {
      const homePath = user?.role === 'PROVIDER' ? '/provider' : '/client';
      router.push(homePath);
      return;
    }

    // Cenário 2: Usuário não autenticado tentando acessar uma rota protegida.
    // Redireciona para a página de login.
    if (!authenticated && !isPublicRoute) {
      router.push('/auth/login');
      return;
    }

    // Cenário 3: Verificação de role para rotas específicas de cliente/provedor
    if (authenticated) {
      // Se um requiredRole foi fornecido, valida contra ele
      if (requiredRole && !hasRole(requiredRole)) {
        const fallbackPath = requiredRole === 'PROVIDER' ? '/client' : '/provider';
        router.push(fallbackPath);
        return;
      }

      // Caso contrário, valida baseado na rota
      const isClientRoute = pathname.startsWith('/client');
      const isProviderRoute = pathname.startsWith('/provider');

      if (isClientRoute && !hasRole('CLIENT')) {
        router.push('/provider');
        return;
      }
      if (isProviderRoute && !hasRole('PROVIDER')) {
        router.push('/client');
        return;
      }
    }
  }, [isAuthenticated, isCheckingAuth, pathname, router, user, hasRole, requiredRole]);

  // Exibe um loader apenas se a verificação estiver em andamento em uma rota protegida.
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isCheckingAuth && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // Prevenção de "flickering": não renderiza o conteúdo se o redirecionamento for iminente.
  const authenticated = isAuthenticated();
  if (!authenticated && !isPublicRoute) return null;
  if (authenticated && isPublicRoute) return null;

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
