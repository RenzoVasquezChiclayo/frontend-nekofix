import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UsedProductDetailClient } from "@/components/catalog/UsedProductDetailClient";
import { AddToCart } from "@/components/catalog/AddToCart";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { RelatedProducts } from "@/components/catalog/RelatedProducts";
import { ProductTechnicalSpecsAccordion } from "@/components/product/ProductTechnicalSpecsAccordion";
import { ProductBadges } from "@/components/store/ProductBadges";
import { UsedGradeBadge } from "@/components/store/UsedGradeBadge";
import { env } from "@/config/env";
import { RELATED_PRODUCTS_DISPLAY_LIMIT } from "@/lib/constants";
import { getProductCoverImage } from "@/lib/product-images";
import { isLowStock } from "@/lib/product-ui";
import {
  getProductBySlug,
  getRelatedProducts,
  getUsedGradeVariants,
} from "@/services/product.service";
import { ApiError } from "@/services/api";
import { formatPrice, whatsappHref } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

function absoluteOgImageUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = env.siteUrl.replace(/\/$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${base}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    const title = product.seoTitle ?? product.name;
    const description = product.seoDescription ?? product.description ?? undefined;
    const cover = getProductCoverImage(product);
    const ogUrl = absoluteOgImageUrl(cover.src);
    return {
      title,
      description: description ?? undefined,
      openGraph: {
        title: product.name,
        description: description ?? undefined,
        images: [{ url: ogUrl, alt: cover.alt }],
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const related = await getRelatedProducts(product, RELATED_PRODUCTS_DISPLAY_LIMIT);

  if (product.type === "USED") {
    const variants = await getUsedGradeVariants(product);
    return (
      <UsedProductDetailClient product={product} variants={variants} related={related} />
    );
  }

  const low = isLowStock(product.stock, product.minStock) && product.stock > 0;
  const waMsg = `Hola, consulto por: ${product.name} (SKU ${product.sku}) — ${formatPrice(product.price)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-zinc-500">
        <Link href="/catalogo" className="text-primary-600 transition hover:text-primary-800">
          Tienda
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalogo?categoryId=${encodeURIComponent(product.category.id)}`}
          className="text-primary-600 transition hover:text-primary-800"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 sm:mt-8 sm:gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <ProductGallery product={product} />

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <ProductBadges
              type={product.type}
              condition={product.condition}
              lowStock={low}
            />
            <UsedGradeBadge type={product.type} grade={product.grade} size="md" />
          </div>
          <p className="text-sm text-zinc-500">
            {product.brand.name}
            {product.model ? ` · ${product.model.name}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs text-zinc-400">SKU {product.sku}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 sm:mt-8">
            <span className="text-2xl font-semibold text-primary-800 sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice != null && product.comparePrice > product.price ? (
              <span className="text-lg text-zinc-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>

          <div className="mt-6 space-y-3 sm:mt-8">
            <AddToCart product={product} />
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

      {product.description ? (
        <section className="mt-16 border-t border-primary-100 pt-14">
          <h2 className="text-lg font-semibold text-primary-950">Descripción</h2>
          <div className="prose prose-zinc mt-4 max-w-none text-sm leading-relaxed text-zinc-600">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
        </section>
      ) : null}

      <div
        className={
          product.description
            ? "mt-10 border-t border-primary-100 pt-10 sm:pt-12"
            : "mt-16 border-t border-primary-100 pt-10 sm:pt-12"
        }
      >
        <ProductTechnicalSpecsAccordion product={product} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
