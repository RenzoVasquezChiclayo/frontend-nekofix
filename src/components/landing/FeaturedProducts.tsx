import Link from "next/link";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { FeaturedProductCard } from "@/components/store/FeaturedProductCard";
import { ProductCarousel, ProductCarouselItem } from "@/components/store/ProductCarousel";
import type { Product } from "@/types/product";

/** Máximo de destacados mostrados en home; el resto se descubre en el catálogo. */
export const HOME_FEATURED_LIMIT = 12;

type Props = {
  products: Product[];
};

export function FeaturedProducts({ products }: Props) {
  const display = products.slice(0, HOME_FEATURED_LIMIT);
  const hasMore = products.length > HOME_FEATURED_LIMIT;

  return (
    <section className="border-t border-primary-100/60 bg-primary-50/30 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:gap-8 md:text-left">
          <SectionTitle
            className="md:mx-0 md:max-w-xl md:text-left"
            align="center"
            eyebrow="Tienda"
            title="Destacados"
            subtitle="Selección curada de nuestro catálogo. Desliza para ver más o entra al catálogo completo."
          />
          <Link
            href="/catalogo?featured=true"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-white"
          >
            Ver todos
            <span aria-hidden className="text-primary-600">
              →
            </span>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-500">
            Pronto habrá productos destacados.
          </p>
        ) : (
          <div className="mt-10">
            <ProductCarousel aria-label="Productos destacados">
              {display.map((p) => (
                <ProductCarouselItem key={p.id}>
                  <FeaturedProductCard
                    product={p}
                    imageSizes="(max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1280px) 22vw, 18vw"
                  />
                </ProductCarouselItem>
              ))}
            </ProductCarousel>
          </div>
        )}

        {products.length > 0 ? (
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/catalogo?featured=true"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Ver catálogo completo
              {hasMore ? (
                <span className="ml-1.5 hidden text-xs font-medium text-primary-100 sm:inline">
                  · más en el catálogo
                </span>
              ) : null}
            </Link>
            <Link
              href="/categorias"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              Categorías
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
