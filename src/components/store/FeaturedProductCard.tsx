"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductBadges } from "@/components/store/ProductBadges";
import { getProductCoverImage } from "@/lib/product-images";
import { isLowStock } from "@/lib/product-ui";
import { formatPrice, whatsappHref } from "@/lib/utils";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function FeaturedProductCard({ product: p }: Props) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const low = isLowStock(p.stock, p.minStock) && p.stock > 0;
  const canBuy = p.stock > 0;

  function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!canBuy) return;
    addLine({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      unitPrice: p.price,
      quantity: 1,
      image: getProductCoverImage(p).src,
      color: p.color,
      storage: p.storage,
      condition: p.condition,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waMsg = `Hola, consulto por: ${p.name} (SKU ${p.sku}) — ${formatPrice(p.price)}`;
  const cover = getProductCoverImage(p);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md">
      <Link href={`/producto/${p.slug}`} className="relative block aspect-square bg-zinc-50">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 25vw"
          unoptimized
        />
        <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]">
          <ProductBadges type={p.type} condition={p.condition} lowStock={low} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {p.brand.name}
          {p.model ? ` · ${p.model.name}` : ""}
        </p>
        <Link href={`/producto/${p.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
            {p.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
          {p.storage ? <span>{p.storage}</span> : null}
          {p.color ? <span>{p.color}</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-primary-800">{formatPrice(p.price)}</span>
          {p.comparePrice != null && p.comparePrice > p.price ? (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(p.comparePrice)}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            disabled={!canBuy}
            onClick={handleCart}
            className="w-full rounded-full bg-primary-600 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!canBuy ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
          </button>
          <a
            href={whatsappHref(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-full border border-primary-200 py-2.5 text-center text-xs font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
