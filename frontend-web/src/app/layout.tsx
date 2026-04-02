import type { Metadata } from "next";
import "@/assets/styles/globals.css";

export const metadata: Metadata = {
  title: "Bulir - Plataforma de Serviços",
  description: "Encontre e contrate serviços de forma fácil e rápida com a Bulir. Conectamos clientes a prestadores de serviços confiáveis em diversas categorias, garantindo qualidade e satisfação. Explore nossa plataforma e descubra como podemos ajudar você a encontrar o serviço perfeito para suas necessidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
