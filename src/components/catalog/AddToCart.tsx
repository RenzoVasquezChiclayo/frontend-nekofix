"use client";

import { useState } from "react";
import { notifySuccess } from "@/lib/toast";
import { getProductCoverImage } from "@/lib/product-images";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function AddToCart({ product }: Props) {
  const { addLine } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const canBuy = product.stock > 0;

  function handleAdd() {
    if (!canBuy) return;
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      image: getProductCoverImage(product).src,
      color: product.color,
      storage: product.storage,
      condition: product.condition,
      grade: product.type === "USED" ? product.grade : undefined,
      productType: product.type,
    });
    notifySuccess("Producto agregado al carrito");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {(product.color || product.storage || (product.type === "USED" && product.grade)) && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-3 text-sm text-zinc-600">
          {product.storage ? (
            <p>
              <span className="font-medium text-zinc-800">Almacenamiento: </span>
              {product.storage}
            </p>
          ) : null}
          {product.color ? (
            <p className={product.storage ? "mt-1" : ""}>
              <span className="font-medium text-zinc-800">Color: </span>
              {product.color}
            </p>
          ) : null}
          {product.type === "USED" && product.grade ? (
            <p className={product.storage || product.color ? "mt-1" : ""}>
              <span className="font-medium text-zinc-800">Grado: </span>
              {product.grade}
            </p>
          ) : null}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-700">
          Cantidad
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) =>
              setQty(
                Math.max(1, Math.min(product.stock, Number(e.target.value) || 1))
              )
            }
            className="ml-2 w-20 rounded-lg border border-zinc-200 px-2 py-1.5 text-center text-sm"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canBuy}
        onClick={handleAdd}
        className="w-full rounded-full bg-primary-600 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {canBuy ? (added ? "Agregado al carrito" : "Agregar al carrito") : "Sin stock"}
      </button>
    </div>
  );
}
