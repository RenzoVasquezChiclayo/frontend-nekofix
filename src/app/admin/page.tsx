import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel admin",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "Productos",
    desc: "Alta, edición, fotos y precios. Conectará con módulos del backend NestJS.",
    href: "#",
    soon: true,
  },
  {
    title: "Inventario",
    desc: "Stock por SKU y alertas básicas.",
    href: "#",
    soon: true,
  },
  {
    title: "Pedidos",
    desc: "Listado y estados de ventas web.",
    href: "#",
    soon: true,
  },
  {
    title: "Cupones",
    desc: "Códigos y reglas de descuento.",
    href: "#",
    soon: true,
  },
] as const;

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Panel administrable</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600">
        Estructura base lista para escalar: autenticación (JWT/cookies), roles y
        llamadas al API NestJS se añadirán en esta sección sin mezclar con la
        tienda pública.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <li
            key={s.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-zinc-900">{s.title}</h2>
              {s.soon ? (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                  Próximamente
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
            {s.soon ? (
              <span className="mt-4 inline-block text-sm text-zinc-400">
                Enlace cuando exista la ruta en el backend
              </span>
            ) : (
              <Link href={s.href} className="mt-4 inline-block text-sm text-primary-700">
                Abrir →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
