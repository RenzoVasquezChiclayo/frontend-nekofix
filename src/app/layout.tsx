import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layouts/AppChrome";
import { AdminAuthProvider } from "@/store/admin-auth-context";
import { AuthProvider } from "@/store/auth-context";
import { CartProvider } from "@/store/cart-context";
import { SITE_NAME } from "@/lib/constants";
import { env } from "@/config/env";

const siteUrl = env.siteUrl || "http://localhost:3000";

/** Geométrica similar a Azo Sans Black; pesos para títulos de marca. */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} · Reparación y venta de smartphones`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Especialistas en iPhone y Android. Reparación, equipos nuevos y seminuevos, accesorios. Cotiza por WhatsApp.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${outfit.variable}`}>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <AppChrome>{children}</AppChrome>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
