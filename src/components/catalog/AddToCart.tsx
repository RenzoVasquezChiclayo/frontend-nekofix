"use client";

import { useState } from "react";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

type Props = { product: Product };

export function AddToCart({ product }: Props) {
  const { addLine } = useCart();
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [storageGb, setStorageGb] = useState(product.storageOptionsGb[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const canBuy = product.stock > 0;
  const needsColor = product.colors.length > 0;
  const needsStorage = product.storageOptionsGb.length > 0;

  function handleAdd() {
    if (!canBuy) return;
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      image: product.images[0],
      color: needsColor ? color : undefined,
      storageGb: needsStorage ? storageGb : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {needsColor ? (
        <div>
          <p className="text-sm font-medium text-zinc-700">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  color === c
                    ? "bg-primary-900 text-white ring-primary-900"
                    : "bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-400"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {needsStorage ? (
        <div>
          <p className="text-sm font-medium text-zinc-700">Almacenamiento</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.storageOptionsGb.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setStorageGb(g)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  storageGb === g
                    ? "bg-primary-900 text-white ring-primary-900"
                    : "bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-400"
                )}
              >
                {g} GB
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-700">
          Cantidad
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
            }
            className="ml-2 w-20 rounded-lg border border-zinc-200 px-2 py-1 text-center"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canBuy}
        onClick={handleAdd}
        className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {canBuy ? (added ? "¡Agregado!" : "Agregar al carrito") : "Sin stock"}
      </button>
    </div>
  );
}
