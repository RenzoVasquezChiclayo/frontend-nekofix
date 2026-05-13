"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { submitWhatsAppCheckout } from "@/app/(site)/checkout/actions";
import { ProductBadges } from "@/components/store/ProductBadges";
import { UsedGradeBadge } from "@/components/store/UsedGradeBadge";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toast";
import { getProductCoverImage } from "@/lib/product-images";
import { isLowStock } from "@/lib/product-ui";
import {
  productToCartCheckoutPayload,
  productToCartLine,
  WHATSAPP_CATALOG_CONSULT_INTRO,
} from "@/lib/product-checkout";
import { ProductColorMiniSwatch } from "@/components/product/ProductColorSwatch";
import { buildWhatsAppCartMessage, formatPrice, whatsappHref } from "@/lib/utils";
import { resolveSafeWhatsAppUrl } from "@/lib/whatsapp-url";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  /** Override para `next/image` sizes (p. ej. carrusel) */
  imageSizes?: string;
};

export function FeaturedProductCard({ product: p, imageSizes }: Props) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const [waPending, startWaTransition] = useTransition();
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
      grade: p.type === "USED" ? p.grade : undefined,
      productType: p.type,
    });
    notifySuccess("Agregado al carrito");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsAppConsult(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const qty = 1;
    const line = productToCartLine(p, qty);
    const total = p.price * qty;
    startWaTransition(async () => {
      const result = await submitWhatsAppCheckout(productToCartCheckoutPayload(p, qty));
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

  const cover = getProductCoverImage(p);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md">
      <Link href={`/producto/${p.slug}`} className="relative block aspect-square bg-zinc-50">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
          sizes={
            imageSizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          }
          unoptimized
        />
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1">
          <ProductBadges type={p.type} condition={p.condition} lowStock={low} />
          <UsedGradeBadge type={p.type} grade={p.grade} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-caption">
          {p.brand.name}
          {p.model ? ` · ${p.model.name}` : ""}
        </p>
        <Link href={`/producto/${p.slug}`}>
          <h3 className="font-display mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink">
            {p.name}
          </h3>
        </Link>
        {p.color ? <ProductColorMiniSwatch color={p.color} /> : null}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-soft">
          {p.storage ? <span>{p.storage}</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-primary-800">{formatPrice(p.price)}</span>
          {p.comparePrice != null && p.comparePrice > p.price ? (
            <span className="text-sm text-ink-caption/80 line-through">
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
          <button
            type="button"
            disabled={waPending}
            onClick={handleWhatsAppConsult}
            className="w-full rounded-full border border-primary-200 py-2.5 text-center text-xs font-semibold text-primary-800 transition hover:bg-primary-50 disabled:opacity-50"
          >
            {waPending ? "Enviando…" : "Consultar por WhatsApp"}
          </button>
        </div>
      </div>
    </div>
  );
}
