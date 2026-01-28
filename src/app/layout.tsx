import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // <--- Importamos o Contexto

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Projeto Coletivo",
  description: "Compra comunitária direta do produtor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Envolvemos tudo com o Provedor do Carrinho */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}