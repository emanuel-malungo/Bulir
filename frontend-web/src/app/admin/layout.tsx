
import Container from "@/components/layout/admin/Container";
import { AuthGuard } from "@/modules/auth/auth-guard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bulir',
  description: 'Painel administrativo da plataforma Bulir.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="SUPER_ADMIN">
      <Container>{children}</Container>
    </AuthGuard>
  );
}
