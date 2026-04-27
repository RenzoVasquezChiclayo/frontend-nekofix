"use client";

import { useId, useState } from "react";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export type Props = {
  product: Product;
};

/** Filas solo con valor útil para mostrar. */
function buildSpecCards(product: Product): { label: string; value: string }[] {
  const cards: { label: string; value: string }[] = [];

  const brand = product.brand?.name?.trim();
  if (brand) cards.push({ label: "Marca", value: brand });

  const category = product.category?.name?.trim();
  if (category) cards.push({ label: "Categoría", value: category });

  const modelName = product.model?.name?.trim();
  if (modelName) cards.push({ label: "Modelo", value: modelName });

  const sku = product.sku?.trim();
  if (sku) cards.push({ label: "SKU", value: sku });

  cards.push({ label: "Stock", value: String(product.stock) });
  cards.push({ label: "Tipo", value: PRODUCT_TYPE_LABELS[product.type] });
  cards.push({ label: "Condición", value: PRODUCT_CONDITION_LABELS[product.condition] });

  const storage = product.storage?.trim();
  if (storage) cards.push({ label: "Almacenamiento", value: storage });

  const color = product.color?.trim();
  if (color) cards.push({ label: "Color", value: color });

  if (product.batteryHealth != null && Number.isFinite(product.batteryHealth)) {
    cards.push({ label: "Batería", value: `${product.batteryHealth}%` });
  }

  const grade = product.grade?.trim();
  if (grade) cards.push({ label: "Grado", value: grade });

  return cards;
}

/**
 * Especificaciones técnicas en acordeón (debajo de la descripción en PDP).
 */
export function ProductTechnicalSpecsAccordion({ product }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();
  const cards = buildSpecCards(product);

  if (cards.length === 0) return null;

  return (
    <div className="w-full" aria-labelledby={buttonId}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white px-4 py-4 text-left shadow-sm transition hover:border-primary-200 hover:bg-zinc-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:px-5 sm:py-4"
      >
        <span className="text-base font-semibold tracking-tight text-primary-950 sm:text-lg">
          Características técnicas
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition-transform duration-300 ease-in-out",
            open && "rotate-180"
          )}
          aria-hidden
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-all duration-300 ease-in-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-100/80"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{c.label}</p>
                  <p className="mt-1 font-medium text-ink">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
