import Container from "@/app/components/layout/Container";


export default function ClientLayout({
    children,
}: {    children: React.ReactNode}) {
    return (
        <Container>
            {children}
        </Container>
    )
}