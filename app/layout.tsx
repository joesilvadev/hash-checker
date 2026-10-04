import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hash Checker - Análisis de Malware",
  description: "Verifica si un archivo es malware consultando múltiples servicios de seguridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
