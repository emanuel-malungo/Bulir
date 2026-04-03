import Container from "@/app/components/layout/provider/Container";


export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
        {children}
    </Container>
  );
}