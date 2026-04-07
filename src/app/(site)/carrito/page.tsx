"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart-context";
import { UsedGradeBadge } from "@/components/store/UsedGradeBadge";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { lines, subtotal, setQuantity, removeLine, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-ink">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Explora la tienda y agrega productos para continuar.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          Ver tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Carrito</h1>
      <ul className="mt-8 divide-y divide-zinc-100 border-y border-zinc-100">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.condition}-${line.storage}-${line.color}`}
            className="flex flex-wrap gap-4 py-6 sm:flex-nowrap sm:items-center"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-50">
              <Image
                src={line.image ?? PRODUCT_PLACEHOLDER_IMAGE}
                alt={line.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/producto/${line.slug}`}
                  className="font-display font-bold text-ink hover:text-primary-700"
                >
                  {line.name}
                </Link>
                {line.grade ? <UsedGradeBadge type="USED" grade={line.grade} /> : null}
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                {[line.color, line.storage].filter(Boolean).join(" · ") || "—"}
              </p>
              <p className="mt-2 text-sm font-medium text-primary-800">
                {formatPrice(line.unitPrice)} c/u
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <span>Cant.</span>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity({
                      productId: line.productId,
                      color: line.color,
                      storage: line.storage,
                      condition: line.condition,
                      quantity: Number(e.target.value) || 1,
                    })
                  }
                  className="w-16 rounded-xl border border-primary-200 px-2 py-1.5 text-center text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  removeLine({
                    productId: line.productId,
                    color: line.color,
                    storage: line.storage,
                    condition: line.condition,
                  })
                }
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col items-end gap-4 border-t border-zinc-100 pt-8">
        <p className="text-lg">
          <span className="text-ink-soft">Subtotal </span>
          <span className="font-semibold text-primary-900">{formatPrice(subtotal)}</span>
        </p>
        <Link
          href="/checkout"
          className="rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Checkout WhatsApp
        </Link>
      </div>
    </div>
  );
}
