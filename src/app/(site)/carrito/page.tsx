"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { lines, subtotal, setQuantity, removeLine, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Tu carrito está vacío</h1>
        <p className="mt-3 text-zinc-600">
          Explora el catálogo y agrega productos para continuar.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Carrito</h1>
      <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.color}-${line.storageGb}`}
            className="flex flex-wrap gap-4 py-6 sm:flex-nowrap sm:items-center"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={line.image ?? "/placeholder-phone.svg"}
                alt={line.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/producto/${line.slug}`}
                className="font-semibold text-zinc-900 hover:text-emerald-700"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-zinc-500">
                {[line.color, line.storageGb ? `${line.storageGb} GB` : null]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                {formatPrice(line.unitPrice)} c/u
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500">Cant.</span>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity({
                      productId: line.productId,
                      color: line.color,
                      storageGb: line.storageGb,
                      quantity: Number(e.target.value) || 1,
                    })
                  }
                  className="w-16 rounded border border-zinc-200 px-2 py-1 text-center"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  removeLine({
                    productId: line.productId,
                    color: line.color,
                    storageGb: line.storageGb,
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
      <div className="mt-8 flex flex-col items-end gap-4 border-t border-zinc-200 pt-8">
        <p className="text-lg">
          <span className="text-zinc-600">Subtotal: </span>
          <span className="font-bold text-zinc-900">{formatPrice(subtotal)}</span>
        </p>
        <Link
          href="/checkout"
          className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Ir al checkout
        </Link>
      </div>
    </div>
  );
}
