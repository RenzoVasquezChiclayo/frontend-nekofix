"use client";

import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import type { Product } from "@/types/product";

type Row = { label: string; value: string };

export function ProductDetailSpecs({ product }: { product: Product }) {
  const rows: Row[] = [
    { label: "Stock", value: String(product.stock) },
    { label: "Tipo", value: PRODUCT_TYPE_LABELS[product.type] },
    { label: "Condición", value: PRODUCT_CONDITION_LABELS[product.condition] },
  ];
  if (product.storage) rows.push({ label: "Almacenamiento", value: product.storage });
  if (product.color) rows.push({ label: "Color", value: product.color });
  if (product.batteryHealth != null) {
    rows.push({ label: "Batería", value: `${product.batteryHealth}%` });
  }
  if (product.grade) rows.push({ label: "Grado", value: product.grade });

  return (
    <>
      <dl className="mt-8 hidden gap-3 text-sm text-zinc-600 lg:grid lg:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-zinc-400">{r.label}</dt>
            <dd className="font-medium text-zinc-800">{r.value}</dd>
          </div>
        ))}
      </dl>

      <details className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/60 lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Especificaciones
            <span className="text-zinc-400" aria-hidden>
              ▾
            </span>
          </span>
        </summary>
        <dl className="space-y-3 border-t border-zinc-200 px-4 py-4 text-sm text-zinc-600">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
              <dt className="text-zinc-400">{r.label}</dt>
              <dd className="text-right font-medium text-zinc-800">{r.value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  );
}
