"use client";

import { useMemo, useState, useTransition } from "react";
import { submitWhatsAppCheckout } from "@/app/(site)/checkout/actions";
import { AddToCart } from "@/components/catalog/AddToCart";
import {
  productToCartCheckoutPayload,
  productToCartLine,
  WHATSAPP_CATALOG_CONSULT_INTRO,
} from "@/lib/product-checkout";
import { notifyError, notifyInfo } from "@/lib/toast";
import { buildWhatsAppCartMessage, formatPrice, whatsappHref } from "@/lib/utils";
import { resolveSafeWhatsAppUrl } from "@/lib/whatsapp-url";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export function ProductDetailActions({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [waPending, startWaTransition] = useTransition();

  const total = useMemo(() => product.price * quantity, [product.price, quantity]);

  function handleWhatsAppConsult() {
    startWaTransition(async () => {
      const line = productToCartLine(product, quantity);
      const result = await submitWhatsAppCheckout(
        productToCartCheckoutPayload(product, quantity)
      );
      if (result.ok) {
        notifyInfo("Abriendo WhatsApp…");
        const fallbackUrl = whatsappHref(
          buildWhatsAppCartMessage([line], total, { intro: WHATSAPP_CATALOG_CONSULT_INTRO })
        );
        window.location.href = resolveSafeWhatsAppUrl(result.whatsappUrl, fallbackUrl);
        return;
      }
      notifyError(
        result.error ??
          "No se pudo registrar la consulta. Intenta de nuevo o escríbenos por WhatsApp."
      );
    });
  }

  return (
    <div className="mt-6 space-y-3 sm:mt-8">
      <AddToCart product={product} quantity={quantity} onQuantityChange={setQuantity} />
      <button
        type="button"
        disabled={waPending}
        onClick={handleWhatsAppConsult}
        className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary-200 py-3.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50 disabled:opacity-50"
      >
        {waPending ? "Enviando…" : `Consultar por WhatsApp (${formatPrice(total)})`}
      </button>
    </div>
  );
}
