"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddToCart } from "@/components/catalog/AddToCart";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { RelatedProducts } from "@/components/catalog/RelatedProducts";
import { UsedGradeExplainer } from "@/components/catalog/UsedGradeExplainer";
import { UsedGradeSelector } from "@/components/catalog/UsedGradeSelector";
import { ProductTechnicalSpecsAccordion } from "@/components/product/ProductTechnicalSpecsAccordion";
import { ProductBadges } from "@/components/store/ProductBadges";
import { UsedGradeBadge } from "@/components/store/UsedGradeBadge";
import { isLowStock } from "@/lib/product-ui";
import { formatPrice, whatsappHref } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  variants: Product[];
  related: Product[];
};

export function UsedProductDetailClient({ product, variants, related }: Props) {
  const selectable = useMemo(
    () => variants.filter((v) => v.stock > 0),
    [variants]
  );

  const [active, setActive] = useState<Product>(product);

  useEffect(() => {
    setActive(product);
  }, [product.id, product.slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = `/producto/${active.slug}`;
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  }, [active.slug]);

  const low = isLowStock(active.stock, active.minStock) && active.stock > 0;
  const waMsg = `Hola, consulto por: ${active.name} (SKU ${active.sku}) — ${formatPrice(active.price)}`;
  const showGradePicker = selectable.length > 1;

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-ink-soft">
          <Link href="/catalogo" className="text-primary-600 transition hover:text-primary-800">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/catalogo?categoryId=${encodeURIComponent(active.category.id)}`}
            className="text-primary-600 transition hover:text-primary-800"
          >
            {active.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary-900">{active.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 sm:mt-8 sm:gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductGallery key={active.id} product={active} />

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ProductBadges type={active.type} condition={active.condition} lowStock={low} />
              <UsedGradeBadge type={active.type} grade={active.grade} size="md" />
            </div>
            <p className="text-sm text-ink-soft">
              {active.brand.name}
              {active.model ? ` · ${active.model.name}` : ""}
            </p>
            <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl">
              {active.name}
            </h1>
            <p className="mt-2 text-xs text-ink-caption">SKU {active.sku}</p>

            {active.stock <= 0 ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                Sin stock en este grado. Elige otro estado de uso si está disponible.
              </p>
            ) : null}

            {showGradePicker ? (
              <UsedGradeSelector
                selectable={selectable}
                active={active}
                onSelect={(p) => setActive(p)}
              />
            ) : null}

            <div className="mt-6 flex flex-wrap items-baseline gap-3 sm:mt-8">
              <span className="text-2xl font-semibold text-primary-800 sm:text-3xl">
                {formatPrice(active.price)}
              </span>
              {active.comparePrice != null && active.comparePrice > active.price ? (
                <span className="text-lg text-ink-caption/80 line-through">
                  {formatPrice(active.comparePrice)}
                </span>
              ) : null}
            </div>

            <div className="mt-6 space-y-3 sm:mt-8">
              <AddToCart key={active.id} product={active} />
              <a
                href={whatsappHref(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary-200 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
              >
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {active.description ? (
          <section className="mt-16 border-t border-primary-100 pt-14">
            <h2 className="font-display text-lg font-bold text-ink">Descripción</h2>
            <div className="prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-ink-muted prose-headings:font-display prose-strong:text-ink">
              <p className="whitespace-pre-wrap">{active.description}</p>
            </div>
          </section>
        ) : null}

        <div
          className={
            active.description
              ? "mt-10 border-t border-primary-100 pt-10 sm:pt-12"
              : "mt-16 border-t border-primary-100 pt-10 sm:pt-12"
          }
        >
          <ProductTechnicalSpecsAccordion product={active} />
        </div>

        <UsedGradeExplainer />

        <RelatedProducts products={related} />
      </div>
    </>
  );
}
