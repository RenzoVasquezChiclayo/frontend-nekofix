import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Producto no encontrado</h1>
      <p className="mt-3 text-zinc-600">
        El enlace puede estar desactualizado o el producto ya no está disponible.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 inline-block rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Ir al catálogo
      </Link>
    </div>
  );
}
