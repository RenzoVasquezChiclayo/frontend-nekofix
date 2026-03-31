import Link from "next/link";
import Image from "next/image";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { PRODUCT_KIND_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  products: Product[];
};

export function FeaturedProducts({ products }: Props) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Tienda"
          title="Catálogo destacado"
          subtitle="Nuevos, seminuevos y accesorios. Filtra por marca, estado, color y almacenamiento."
        />
        {products.length === 0 ? (
          <p className="mt-12 text-center text-zinc-500">
            No hay productos destacados por ahora.
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/producto/${p.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="relative aspect-square bg-zinc-100">
                    <Image
                      src={p.images[0] ?? "/placeholder-phone.svg"}
                      alt={p.name}
                      fill
                      className="object-contain p-4 transition group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-zinc-900/80 px-2 py-0.5 text-xs text-white">
                      {PRODUCT_KIND_LABELS[p.kind]}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-zinc-500">{p.brand}</p>
                    <h3 className="mt-1 font-semibold text-zinc-900 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-primary-700">
                      {formatPrice(p.price, p.currency)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12 text-center">
          <Link
            href="/catalogo"
            className="inline-flex rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-800 transition hover:border-primary-500 hover:text-primary-800"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
