'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from './auth.store';
import iconBulir from '@/assets/images/bulir.svg';
import Image from 'next/image';

// Rotas que NÃO exigem autenticação
const PUBLIC_ROUTES = [
  '/',
  '/register',
  '/forgot-password',
];

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'CLIENT' | 'PROVIDER' | 'SUPER_ADMIN';
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
      let homePath = '/client';
      if (user?.role === 'SUPER_ADMIN') homePath = '/admin';
      else if (user?.role === 'PROVIDER') homePath = '/provider';
      
      router.push(homePath);
      return;
    }

    // Cenário 2: Usuário não autenticado tentando acessar uma rota protegida.
    // Redireciona para a página de login.
    if (!authenticated && !isPublicRoute) {
      router.push('/');
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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-accent/5 via-white to-accent/10 relative overflow-hidden">
        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 text-center space-y-6">
          {/* Ícone Bulir */}
          <div className="flex justify-center mb-6">
            <Image
              src={iconBulir}
              alt="Bulir"
              width={80}
              height={80}
              className="animate-pulse"
            />
          </div>

          {/* Spinner animado */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-accent border-r-accent rounded-full animate-spin"></div>
            </div>
          </div>


          {/* Indicador de progresso */}
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
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
  requiredRole?: 'CLIENT' | 'PROVIDER' | 'SUPER_ADMIN'
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
    if (!user) return '/';
    if (user.role === 'SUPER_ADMIN') return '/admin';
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
