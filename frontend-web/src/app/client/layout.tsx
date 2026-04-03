import Container from "@/app/components/layout/client/Container";
import { AuthGuard } from "@/modules/auth/auth-guard";

export default function ClientLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <AuthGuard requiredRole="CLIENT">
            <Container>
                {children}
            </Container>
        </AuthGuard>
    )
}