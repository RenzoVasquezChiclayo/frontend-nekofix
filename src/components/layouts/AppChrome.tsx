"use client";

import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/layouts/SiteShell";

/**
 * Un solo shell (navbar, footer, WhatsApp) para todo el sitio público.
 * Evita inconsistencias entre `/` (antes solo en route group) y el resto de rutas.
 * Admin no lleva el shell de tienda.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return <SiteShell>{children}</SiteShell>;
}
