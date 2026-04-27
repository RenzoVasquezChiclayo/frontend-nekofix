import type { NextConfig } from "next";

/** Misma regla que `env.mediaBaseUrl`: solo para `images.remotePatterns`, sin tocar el cliente en runtime. */
// function mediaOriginForImageConfig(): string {
//   const explicit = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
//   if (explicit) return explicit.replace(/\/$/, "");
//   const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005/api";
//   const trimmed = api.replace(/\/$/, "");
//   return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
// }
function mediaOriginForImageConfig(): string {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const api = process.env.NEXT_PUBLIC_API_URL;

  if (!api) {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3005";
    }
    return "";
  }

  const trimmed = api.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}
/**
 * Orígenes para `next/image`: medios del backend (`/uploads/**`), CDNs extra y servicios de placeholder.
 * - Origen de medios: `NEXT_PUBLIC_MEDIA_URL` o, si falta, mismo host que el API sin sufijo `/api` (`NEXT_PUBLIC_API_URL`).
 */
function imageRemotePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
  const seen = new Set<string>();

  function pushUrl(href: string, pathname: string) {
    try {
      const u = new URL(href);
      const port = u.port || "";
      const key = `${u.protocol}//${u.hostname}:${port}:${pathname}`;
      if (seen.has(key)) return;
      seen.add(key);
      patterns.push({
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        ...(port ? { port } : {}),
        pathname,
      });
    } catch {
      /* vacío */
    }
  }

  pushUrl(mediaOriginForImageConfig(), "/uploads/**");
  pushUrl("https://placehold.co", "/**");

  const extra = process.env.NEXT_PUBLIC_IMAGE_HOSTS;
  if (extra) {
    for (const part of extra.split(",")) {
      const t = part.trim();
      if (!t) continue;
      const href = t.includes("://") ? t : `https://${t}`;
      try {
        if (new URL(href).hostname === "placehold.co") continue;
      } catch {
        continue;
      }
      pushUrl(href, "/uploads/**");
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_IMAGE_ALLOW_LOCAL_IP === "true",
  },
  async redirects() {
    return [
      { source: "/admin/productos", destination: "/admin/products", permanent: true },
      { source: "/admin/productos/nuevo", destination: "/admin/products/new", permanent: true },
      {
        source: "/admin/productos/:id/editar",
        destination: "/admin/products/:id/edit",
        permanent: true,
      },
      { source: "/admin/categorias", destination: "/admin/categories", permanent: true },
      { source: "/admin/marcas", destination: "/admin/brands", permanent: true },
      { source: "/admin/inventario", destination: "/admin/inventory", permanent: true },
      { source: "/admin/clientes", destination: "/admin/clients", permanent: true },
      { source: "/admin/configuracion", destination: "/admin/settings", permanent: true },
    ];
  },
};

export default nextConfig;
