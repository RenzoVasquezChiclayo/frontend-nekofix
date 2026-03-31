import Link from "next/link";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CheckoutExitoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const id = sp.id;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-cool/25 text-2xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-zinc-900">Pedido registrado</h1>
      <p className="mt-3 text-zinc-600">
        {id
          ? `Referencia: ${id}`
          : "Recibirás confirmación por WhatsApp o correo cuando el backend esté conectado."}
      </p>
      <Link
        href="/catalogo"
        className="mt-10 inline-block rounded-full bg-primary-800 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-900"
      >
        Seguir comprando
      </Link>
    </div>
  );
}
