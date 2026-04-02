"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ProductBadges } from "@/components/store/ProductBadges";
import { isLowStock, PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function ProductCard({ product: p }: Props) {
  const low = isLowStock(p.stock, p.minStock) && p.stock > 0;
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const canAdd = p.stock > 0;

  function handleAdd() {
    if (!canAdd) return;
    addLine({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      unitPrice: p.price,
      quantity: 1,
      color: p.color,
      storage: p.storage,
      condition: p.condition,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const waText = encodeURIComponent(`Hola, quiero comprar ${p.name} (${p.slug})`);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <Link href={`/producto/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-xl bg-zinc-50">
        <Image
          src={PRODUCT_PLACEHOLDER_IMAGE}
          alt={p.name}
          fill
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]">
          <ProductBadges type={p.type} condition={p.condition} lowStock={low} />
        </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {p.brand.name}
          {p.model ? ` · ${p.model.name}` : ""}
        </p>
        <Link href={`/producto/${p.slug}`} className="mt-1">
          <h2 className="line-clamp-2 min-h-[2.8rem] text-sm font-semibold leading-snug text-zinc-900">
            {p.name}
          </h2>
        </Link>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
          {p.storage ? <span>{p.storage}</span> : null}
          {p.color ? <span>{p.color}</span> : null}
          {p.batteryHealth != null ? <span>Batería {p.batteryHealth}%</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-primary-800">{formatPrice(p.price)}</span>
          {p.comparePrice != null && p.comparePrice > p.price ? (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(p.comparePrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link
            href={`/producto/${p.slug}`}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Ver detalle
          </Link>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="rounded-xl bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canAdd ? (added ? "Agregado" : "Agregar carrito") : "Sin stock"}
          </button>
          <a
            href={`https://api.whatsapp.com/send?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
