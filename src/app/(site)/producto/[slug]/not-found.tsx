import Link from "next/link";

export default function ProductoNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-primary-950">Producto no encontrado</h1>
      <p className="mt-3 text-sm text-zinc-500">
        Es posible que ya no esté publicado o el enlace sea incorrecto.
      </p>
      <Link
        href="/catalogo"
        className="mt-8 inline-block rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        Ir a la tienda
      </Link>
    </div>
  );
}
