"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { submitWhatsAppCheckout } from "@/app/(site)/checkout/actions";
import { ProductBadges } from "@/components/store/ProductBadges";
import { UsedGradeBadge } from "@/components/store/UsedGradeBadge";
import { getProductCoverImage } from "@/lib/product-images";
import { isLowStock } from "@/lib/product-ui";
import { ProductColorMiniSwatch } from "@/components/product/ProductColorSwatch";
import {
  productToCartCheckoutPayload,
  productToCartLine,
  WHATSAPP_CATALOG_CONSULT_INTRO,
} from "@/lib/product-checkout";
import { notifyError, notifyInfo } from "@/lib/toast";
import { buildWhatsAppCartMessage, formatPrice, whatsappHref } from "@/lib/utils";
import { resolveSafeWhatsAppUrl } from "@/lib/whatsapp-url";
import { useCart } from "@/store/cart-context";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function ProductCard({ product: p }: Props) {
  const low = isLowStock(p.stock, p.minStock) && p.stock > 0;
  const { addLine } = useCart();
  const [waPending, startWaTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const canAdd = p.stock > 0;
  const cover = getProductCoverImage(p);

  function handleAdd() {
    if (!canAdd) return;
    addLine({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      unitPrice: p.price,
      quantity: 1,
      image: cover.src,
      color: p.color,
      storage: p.storage,
      condition: p.condition,
      grade: p.type === "USED" ? p.grade : undefined,
      productType: p.type,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWhatsAppConsult() {
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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <Link href={`/producto/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-xl bg-zinc-50">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1">
          <ProductBadges type={p.type} condition={p.condition} lowStock={low} />
          <UsedGradeBadge type={p.type} grade={p.grade} />
        </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-caption">
          {p.brand.name}
          {p.model ? ` · ${p.model.name}` : ""}
        </p>
        <Link href={`/producto/${p.slug}`} className="mt-1">
          <h2 className="font-display line-clamp-2 min-h-[2.8rem] text-sm font-bold leading-snug text-ink">
            {p.name}
          </h2>
        </Link>
        {p.color ? <ProductColorMiniSwatch color={p.color} /> : null}
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-soft">
          {p.storage ? <span>{p.storage}</span> : null}
          {p.batteryHealth != null ? <span>Batería {p.batteryHealth}%</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-primary-800">{formatPrice(p.price)}</span>
          {p.comparePrice != null && p.comparePrice > p.price ? (
            <span className="text-sm text-ink-caption/80 line-through">
              {formatPrice(p.comparePrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link
            href={`/producto/${p.slug}`}
            className="rounded-xl border border-primary-200/80 px-3 py-2 text-center text-sm font-medium text-ink-body transition hover:bg-primary-50/80"
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
          <button
            type="button"
            disabled={waPending}
            onClick={handleWhatsAppConsult}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
          >
            {waPending ? "Enviando…" : "Consultar por WhatsApp"}
          </button>
        </div>
      </div>
    </article>
  );
}
