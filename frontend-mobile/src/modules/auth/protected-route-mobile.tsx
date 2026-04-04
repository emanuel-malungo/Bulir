import Splash from '@/components/layout/Splash';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from './auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Componente para proteger rotas que exigem autenticação no mobile (Expo).
 * Gerencia o estado de autenticação e redireciona o usuário conforme necessário.
 * 
 * Fluxo:
 * 1. Ao montar, inicia checkAuth() para restaurar usuário do AsyncStorage
 * 2. Mostra Splash enquanto verifica autenticação
 * 3. Redireciona baseado em: autenticação + rota (pública/protegida) + role
 * 
 * Redirecionamentos:
 * - Usuário não autenticado + rota protegida → /(auth)
 * - Usuário autenticado + rota pública → /(tabs)/(client | provider)
 * - Usuário com role diferente → /(tabs)/(client | provider)
 */
export function ProtectedRouteMobile({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const { user, isAuthenticated, isCheckingAuth, checkAuth, hasRole, onboardingCompleted } = useAuthStore();
  const [showSplashMinTime, setShowSplashMinTime] = useState(true); // Mostrar Splash por no mínimo 2.5 segundos

  // Rotas públicas (onboarding + auth)
  const publicSegments = ['(auth)', 'index'];

  // Verificar se está em uma rota pública
  const isPublicRoute = useMemo(() => {
    return segments.length > 0 && publicSegments.includes(segments[0]);
  }, [segments]);

  // 🔄 PASSO 1: Inicializar autenticação quando componente monta
  // Restaurar usuário do AsyncStorage se existir
  useEffect(() => {
    checkAuth();
    
    // ⏱️ Definir tempo mínimo para exibir Splash (2.5 segundos)
    const splashTimer = setTimeout(() => {
      setShowSplashMinTime(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  // 🛣️ PASSO 2: Gerenciar redirecionamentos baseado em estado de auth + rota
  useEffect(() => {
    // Não fazer nada enquanto está verificando autenticação
    if (isCheckingAuth) return;

    const isUserAuthenticated = !!user; // Usar user diretamente
    const isOnboardingRoute = pathname === '/' || pathname === '/index'; // Rota raiz (tela index/onboarding)
    
    // ❌ Usuário não autenticado tentando acessar rota protegida
    if (!isPublicRoute && !isUserAuthenticated) {
      router.replace('/(auth)');
      return;
    }

    // ✅ Usuário autenticado tentando acessar onboarding/auth → enviar para tabs
    if (isPublicRoute && isUserAuthenticated && user) {
      const destination = user.role === 'PROVIDER' 
        ? '/(tabs)/(provider)' 
        : '/(tabs)/(client)';
      router.replace(destination as any);
      return;
    }

    // 📋 Usuário não autenticado já fez onboarding → enviar para login
    if (!isUserAuthenticated && onboardingCompleted && isOnboardingRoute) {
      router.replace('/(auth)');
      return;
    }

    // 👤 Verificar role se necessário (ex: PROVIDER tentando acessar rota CLIENT)
    if (requiredRole && isUserAuthenticated && !hasRole(requiredRole)) {
      const destination = user?.role === 'PROVIDER' 
        ? '/(tabs)/(provider)' 
        : '/(tabs)/(client)';
      router.replace(destination as any);
      return;
    }
  }, [isCheckingAuth, user, isPublicRoute, onboardingCompleted, requiredRole, pathname]);

  // Mostrar loading enquanto verifica autenticação OU enquanto time mínimo não passou
  if (isCheckingAuth || showSplashMinTime) {
    return <Splash />;
  }

  return <>{children}</>;
}
