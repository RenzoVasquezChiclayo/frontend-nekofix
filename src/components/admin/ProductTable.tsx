"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { getProductCoverImage } from "@/lib/product-images";
import { cn, formatPrice } from "@/lib/utils";
import { normalizeUsedGrade } from "@/lib/used-grade";
import type { Product } from "@/types/product";

function formatGradeCell(grade: string | null | undefined): string | null {
  const g = normalizeUsedGrade(grade);
  return g && g.length > 0 ? g : null;
}

type Props = {
  products: Product[];
  onDelete: (id: string) => void;
  onTogglePublished: (p: Product) => void;
  onToggleFeatured: (p: Product) => void;
  onOpenInventory: (p: Product) => void;
};

export function ProductTable({
  products,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
  onOpenInventory,
}: Props) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center text-sm text-zinc-500">
        No hay productos con estos criterios.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-3 lg:hidden">
        {products.map((p) => {
          const low = p.stock <= p.minStock;
          const cover = getProductCoverImage(p);
          const gradeLabel = formatGradeCell(p.grade);
          return (
            <li
              key={p.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-zinc-900 line-clamp-2">{p.name}</p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-500">{p.sku}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2 text-sm">
                    <span className="font-semibold text-primary-800">{formatPrice(p.price)}</span>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                        low ? "bg-amber-100 text-amber-900" : "bg-emerald-50 text-emerald-800"
                      )}
                    >
                      Stock {p.stock}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {p.brand?.name ?? "—"} · {PRODUCT_CONDITION_LABELS[p.condition]}
                    {gradeLabel ? (
                      <span className="text-zinc-600"> · Grado {gradeLabel}</span>
                    ) : null}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="touch-manipulation rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-800"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenInventory(p)}
                  className="touch-manipulation rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
                >
                  Stock
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFeatured(p)}
                  className="touch-manipulation rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
                >
                  Dest. {p.isFeatured ? "✓" : "—"}
                </button>
                <button
                  type="button"
                  onClick={() => onTogglePublished(p)}
                  className="touch-manipulation rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
                >
                  Pub. {p.isPublished ? "✓" : "—"}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  className="touch-manipulation rounded-lg px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-3 py-3">Producto</th>
                <th className="px-3 py-3">SKU</th>
                <th className="px-3 py-3">Marca</th>
                <th className="px-3 py-3">Categoría</th>
                <th className="px-3 py-3">Modelo</th>
                <th className="px-3 py-3">Precio</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Cond.</th>
                <th className="px-3 py-3">Grado</th>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Dest.</th>
                <th className="px-3 py-3">Pub.</th>
                <th className="px-3 py-3">Creado</th>
                <th className="px-3 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => {
                const low = p.stock <= p.minStock;
                const gradeLabel = formatGradeCell(p.grade);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/60">
                    <td className="max-w-[200px] px-3 py-3">
                      <span className="font-medium text-zinc-900 line-clamp-2">{p.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-zinc-600">
                      {p.sku}
                    </td>
                    <td className="px-3 py-3 text-zinc-700">{p.brand?.name ?? "—"}</td>
                    <td className="px-3 py-3 text-zinc-700">{p.category?.name ?? "—"}</td>
                    <td className="px-3 py-3 text-zinc-600">{p.model?.name ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-primary-800">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                          low
                            ? "bg-amber-100 text-amber-900"
                            : "bg-emerald-50 text-emerald-800"
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {PRODUCT_CONDITION_LABELS[p.condition]}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {gradeLabel ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {PRODUCT_TYPE_LABELS[p.type]}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(p)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          p.isFeatured
                            ? "bg-primary-100 text-primary-800"
                            : "bg-zinc-100 text-zinc-500"
                        )}
                      >
                        {p.isFeatured ? "Sí" : "No"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => onTogglePublished(p)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          p.isPublished
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-100 text-zinc-500"
                        )}
                      >
                        {p.isPublished ? "Sí" : "No"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-zinc-500">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("es-PE")
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => onOpenInventory(p)}
                          className="text-xs font-semibold text-zinc-600 hover:text-primary-700"
                        >
                          Stock
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
