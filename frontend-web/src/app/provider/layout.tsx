import { AuthGuard } from "@/modules/auth/auth-guard";
import Container from "@/app/components/layout/provider/Container";


export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="PROVIDER">
      <Container>
          {children}
      </Container>
    </AuthGuard>
  );
}