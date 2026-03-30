import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layouts/AppChrome";
import { AuthProvider } from "@/store/auth-context";
import { CartProvider } from "@/store/cart-context";
import { SITE_NAME } from "@/lib/constants";
import { env } from "@/config/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = env.siteUrl || "http://localhost:3000";

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
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <CartProvider>
            <AppChrome>{children}</AppChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
