import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
