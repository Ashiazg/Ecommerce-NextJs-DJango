import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "EcommerceApp",
  description: "Tienda online con Next.js + Django",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto p-4 sm:p-6">{children}</main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
