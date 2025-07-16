import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ToastContainer } from "@/components/ui/toast";
import { AuthProvider } from "../../lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Predik - Mercados de Predicción",
  description: "Plataforma de mercados de predicción para Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
