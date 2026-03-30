import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/catalog/AddToCart";
import { getProductBySlugWithFallback } from "@/services/product.service";
import { PRODUCT_KIND_LABELS, WEAR_GRADE_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugWithFallback(slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugWithFallback(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-zinc-500">
        <Link href="/catalogo" className="hover:text-zinc-800">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
          <Image
            src={product.images[0] ?? "/placeholder-phone.svg"}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {PRODUCT_KIND_LABELS[product.kind]}
            {product.wearGrade
              ? ` · ${WEAR_GRADE_LABELS[product.wearGrade]}`
              : ""}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{product.brand}</p>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-zinc-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-lg text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            ) : null}
          </div>
          {product.description ? (
            <p className="mt-6 text-zinc-600">{product.description}</p>
          ) : null}
          <p className="mt-4 text-sm text-zinc-500">
            Stock: {product.stock} · SKU: {product.sku ?? "—"}
          </p>
          <div className="mt-8 border-t border-zinc-200 pt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
