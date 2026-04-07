"use client";

import { normalizeUsedGrade } from "@/lib/used-grade";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  /** Variantes con stock &gt; 0 (solo estas son clicables). */
  selectable: Product[];
  active: Product;
  onSelect: (product: Product) => void;
};

export function UsedGradeSelector({ selectable, active, onSelect }: Props) {
  if (selectable.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="font-display text-sm font-bold text-ink">Selecciona el estado de uso</p>
      <p className="mt-1 text-xs text-ink-soft">
        Precio y disponibilidad según el grado elegido.
      </p>
      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-start [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Grado cosmético"
      >
        {selectable.map((p) => {
          const g = normalizeUsedGrade(p.grade) ?? "—";
          const isActive = p.id === active.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(p)}
              className={cn(
                "min-w-[4.5rem] shrink-0 rounded-2xl border px-4 py-3 text-center transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isActive
                  ? "border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200/60"
                  : "border-zinc-200 bg-white hover:border-primary-200 hover:bg-zinc-50/80"
              )}
            >
              <span className="block font-display text-lg font-black tracking-tight text-ink">
                {g}
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                {p.stock > 0 ? `${p.stock} disp.` : "—"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
