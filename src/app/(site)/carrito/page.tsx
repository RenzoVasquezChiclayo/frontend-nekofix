"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart-context";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { lines, subtotal, setQuantity, removeLine, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-primary-950">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Explora la tienda y agrega productos para continuar.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Ver tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-primary-950">Carrito</h1>
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
              <Link
                href={`/producto/${line.slug}`}
                className="font-semibold text-primary-950 hover:text-primary-700"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-xs text-zinc-500">
                {[line.color, line.storage].filter(Boolean).join(" · ") || "—"}
              </p>
              <p className="mt-2 text-sm font-medium text-primary-800">
                {formatPrice(line.unitPrice)} c/u
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <label className="flex items-center gap-2 text-sm text-zinc-600">
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
          <span className="text-zinc-500">Subtotal </span>
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
