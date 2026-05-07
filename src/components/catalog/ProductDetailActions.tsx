"use client";

import { useMemo, useState } from "react";
import { AddToCart } from "@/components/catalog/AddToCart";
import { formatPrice, whatsappHref } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export function ProductDetailActions({ product }: Props) {
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => product.price * quantity, [product.price, quantity]);
  const waMsg = useMemo(
    () => buildDetailWhatsAppMessage(product, quantity),
    [product, quantity]
  );

  return (
    <div className="mt-6 space-y-3 sm:mt-8">
      <AddToCart product={product} quantity={quantity} onQuantityChange={setQuantity} />
      <a
        href={whatsappHref(waMsg)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary-200 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
      >
        Comprar por WhatsApp ({formatPrice(total)})
      </a>
    </div>
  );
}

function buildDetailWhatsAppMessage(product: Product, quantity: number): string {
  const total = product.price * quantity;
  const details = [product.name];
  if (product.color) details.push(product.color);
  if (product.storage) details.push(product.storage);
  details.push(`×${quantity}`);
  details.push(formatPrice(total));

  return `Hola, quiero confirmar este pedido:\n• ${details.join(" · ")}\n\nTotal: ${formatPrice(total)}`;
}
