import Link from "next/link";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { FeaturedProductCard } from "@/components/store/FeaturedProductCard";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
};

export function FeaturedProducts({ products }: Props) {
  return (
    <section className="border-t border-primary-100/60 bg-primary-50/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Tienda"
          title="Destacados"
          subtitle="Selección curada de nuestro catálogo. Precios y condición según inventario real."
        />
        {products.length === 0 ? (
          <p className="mt-14 text-center text-sm text-zinc-500">
            Pronto habrá productos destacados.
          </p>
        ) : (
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <FeaturedProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/catalogo"
            className="inline-flex rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Ver catálogo completo
          </Link>
          <Link
            href="/categorias"
            className="inline-flex rounded-full border border-primary-200 bg-white px-8 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            Categorías
          </Link>
        </div>
      </div>
    </section>
  );
}
