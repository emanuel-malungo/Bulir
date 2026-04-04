import { AuthGuard } from './auth-guard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'CLIENT' | 'PROVIDER';
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * Renders children only if user is authenticated and has required permissions/role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  return (
    <AuthGuard requiredRole={requiredRole}>
      {children}
    </AuthGuard>
  );
}
