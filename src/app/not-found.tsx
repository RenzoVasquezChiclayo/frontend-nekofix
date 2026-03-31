import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Página no encontrada</h1>
      <p className="mt-3 text-zinc-600">
        La ruta no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-500"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
