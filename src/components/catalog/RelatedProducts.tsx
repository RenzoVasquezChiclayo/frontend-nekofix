"use client";

import Link from "next/link";
import { FeaturedProductCard } from "@/components/store/FeaturedProductCard";
import { ProductCarousel, ProductCarouselItem } from "@/components/store/ProductCarousel";
import { RELATED_PRODUCTS_DISPLAY_LIMIT } from "@/lib/constants";
import type { Product } from "@/types/product";

const CAROUSEL_IMAGE_SIZES =
  "(max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1280px) 22vw, 18vw";

type Props = { products: Product[] };

export function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  const display = products.slice(0, RELATED_PRODUCTS_DISPLAY_LIMIT);

  return (
    <section className="mt-16 border-t border-primary-100/80 pt-12 sm:mt-20 sm:pt-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 className="text-base font-semibold tracking-tight text-primary-950 sm:text-lg">
          Productos relacionados
        </h2>
        <Link
          href="/catalogo"
          className="hidden shrink-0 text-sm font-semibold text-primary-700 transition hover:text-primary-900 sm:inline-flex sm:items-center sm:gap-1"
        >
          Ver más en catálogo
          <span aria-hidden className="text-primary-500">
            →
          </span>
        </Link>
      </div>

      <div className="mt-8">
        <ProductCarousel aria-label="Productos relacionados">
          {display.map((p) => (
            <ProductCarouselItem key={p.id}>
              <FeaturedProductCard
                product={p}
                imageSizes={CAROUSEL_IMAGE_SIZES}
              />
            </ProductCarouselItem>
          ))}
        </ProductCarousel>
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/catalogo"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
        >
          Ver más en catálogo
        </Link>
      </div>
    </section>
  );
}
