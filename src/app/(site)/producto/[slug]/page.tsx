import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/catalog/AddToCart";
import { RelatedProducts } from "@/components/catalog/RelatedProducts";
import { ProductBadges } from "@/components/store/ProductBadges";
import { isLowStock, PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { getProductBySlug, getRelatedProducts } from "@/services/product.service";
import { ApiError } from "@/services/api";
import { formatPrice, whatsappHref } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    const title = product.seoTitle ?? product.name;
    const description = product.seoDescription ?? product.description ?? undefined;
    return {
      title,
      description: description ?? undefined,
      openGraph: {
        title: product.name,
        description: description ?? undefined,
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

  const related = await getRelatedProducts(product, 6);
  const low = isLowStock(product.stock, product.minStock) && product.stock > 0;
  const waMsg = `Hola, consulto por: ${product.name} (SKU ${product.sku}) — ${formatPrice(product.price)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-xs font-medium text-zinc-500">
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

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-primary-50/50 ring-1 ring-primary-100">
          <Image
            src={PRODUCT_PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-contain p-10"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <ProductBadges
            type={product.type}
            condition={product.condition}
            lowStock={low}
            className="mb-4"
          />
          <p className="text-sm text-zinc-500">
            {product.brand.name}
            {product.model ? ` · ${product.model.name}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs text-zinc-400">SKU {product.sku}</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-primary-800">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice != null && product.comparePrice > product.price ? (
              <span className="text-lg text-zinc-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>

          <dl className="mt-8 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            <div>
              <dt className="text-zinc-400">Stock</dt>
              <dd className="font-medium text-zinc-800">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Tipo</dt>
              <dd className="font-medium text-zinc-800">
                {PRODUCT_TYPE_LABELS[product.type]}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Condición</dt>
              <dd className="font-medium text-zinc-800">
                {PRODUCT_CONDITION_LABELS[product.condition]}
              </dd>
            </div>
            {product.storage ? (
              <div>
                <dt className="text-zinc-400">Almacenamiento</dt>
                <dd className="font-medium text-zinc-800">{product.storage}</dd>
              </div>
            ) : null}
            {product.color ? (
              <div>
                <dt className="text-zinc-400">Color</dt>
                <dd className="font-medium text-zinc-800">{product.color}</dd>
              </div>
            ) : null}
            {product.batteryHealth != null ? (
              <div>
                <dt className="text-zinc-400">Batería</dt>
                <dd className="font-medium text-zinc-800">{product.batteryHealth}%</dd>
              </div>
            ) : null}
            {product.grade ? (
              <div>
                <dt className="text-zinc-400">Grado</dt>
                <dd className="font-medium text-zinc-800">{product.grade}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 space-y-3">
            <AddToCart product={product} />
            <a
              href={whatsappHref(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full border border-primary-200 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
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

      <RelatedProducts products={related} />
    </div>
  );
}
