import Container from "@/app/components/layout/client/Container";


export default function ClientLayout({
    children,
}: {    children: React.ReactNode}) {
    return (
        <Container>
            {children}
        </Container>
    )
}