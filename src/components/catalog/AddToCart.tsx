"use client";

import { useState } from "react";
import { ProductColorPickerRow } from "@/components/product/ProductColorSwatch";
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

  const showSpecs =
    product.storage ||
    product.color ||
    product.batteryHealth != null ||
    (product.type === "USED" && product.grade);

  return (
    <div className="space-y-4">
      {showSpecs ? (
        <div className="space-y-3 rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-4 text-sm text-zinc-600">
          {product.type === "USED" && product.grade ? (
            <p>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Grado
              </span>
              <span className="mt-1 block font-medium text-ink">{product.grade}</span>
            </p>
          ) : null}
          {product.storage ? (
            <p>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Almacenamiento
              </span>
              <span className="mt-1 block font-medium text-ink">{product.storage}</span>
            </p>
          ) : null}
          {product.batteryHealth != null ? (
            <p>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Batería
              </span>
              <span className="mt-1 block font-medium text-ink">{product.batteryHealth}%</span>
            </p>
          ) : null}
          {product.color ? (
            <div
              className={
                product.storage ||
                product.batteryHealth != null ||
                (product.type === "USED" && product.grade)
                  ? "border-t border-primary-100/80 pt-4"
                  : ""
              }
            >
              <ProductColorPickerRow color={product.color} />
            </div>
          ) : null}
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
