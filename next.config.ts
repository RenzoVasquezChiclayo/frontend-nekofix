import type { NextConfig } from "next";

/** Misma regla que `env.mediaBaseUrl`: solo para `images.remotePatterns`, sin tocar el cliente en runtime. */
function mediaOriginForImageConfig(): string {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005/api";
  const trimmed = api.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}

/**
 * Orígenes desde los que `next/image` puede cargar `/uploads/**`.
 * No usa `NEXT_PUBLIC_API_URL` directamente (el API es `/api/*`; los estáticos no).
 */
function imageRemotePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const patterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];
  const pushOrigin = (href: string) => {
    try {
      const u = new URL(href);
      patterns.push({
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/uploads/**",
      });
    } catch {
      /* vacío */
    }
  };
  pushOrigin(mediaOriginForImageConfig());
  const extra = process.env.NEXT_PUBLIC_IMAGE_HOSTS;
  if (extra) {
    for (const part of extra.split(",")) {
      const t = part.trim();
      if (t) pushOrigin(t.includes("://") ? t : `https://${t}`);
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
