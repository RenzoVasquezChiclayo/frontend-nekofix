"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { resolveProductMediaUrl, sortProductImages } from "@/lib/product-images";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function ProductGallery({ product }: Props) {
  const items = useMemo(
    () => sortProductImages(product.productImages),
    [product.productImages]
  );

  const initial = items.find((i) => i.isPrimary) ?? items[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initial?.id ?? null);

  const selected =
    items.find((i) => i.id === selectedId) ??
    items.find((i) => i.isPrimary) ??
    items[0] ??
    null;

  const mainSrc = selected ? resolveProductMediaUrl(selected.url) : PRODUCT_PLACEHOLDER_IMAGE;
  const mainAlt = selected?.alt?.trim() || product.name;

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      {items.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:w-20 lg:flex-shrink-0 lg:flex-col lg:overflow-y-auto lg:pb-0 lg:pr-1 lg:[&::-webkit-scrollbar]:hidden lg:max-h-[min(520px,70vh)]">
          {items.map((img) => {
            const active = selected?.id === img.id;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedId(img.id)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-20 sm:w-20 lg:h-[72px] lg:w-full ${
                  active ? "border-primary-500 ring-2 ring-primary-200" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <Image
                  src={resolveProductMediaUrl(img.url)}
                  alt={img.alt?.trim() || product.name}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-3xl bg-primary-50/50 ring-1 ring-primary-100 lg:flex-1">
        <Image
          src={mainSrc}
          alt={mainAlt}
          fill
          priority
          className="object-contain p-6 transition duration-500 ease-out hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized
        />
      </div>
    </div>
  );
}
