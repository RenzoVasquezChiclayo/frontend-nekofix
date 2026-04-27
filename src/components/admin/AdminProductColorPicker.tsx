"use client";

import {
  PRODUCT_COLOR_OPTIONS,
  getProductColorHex,
  isCatalogProductColor,
  resolveProductColorLabel,
} from "@/lib/product-color-map";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

/**
 * Grid de swatches para el campo `color` (nombre comercial guardado en API).
 */
export function AdminProductColorPicker({ value, onChange }: Props) {
  const selectedLabel = value.trim() ? resolveProductColorLabel(value) : null;
  const legacyUnknown = value.trim() && !isCatalogProductColor(value);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-3 sm:grid-cols-5 md:grid-cols-10">
        {PRODUCT_COLOR_OPTIONS.map((name) => {
          const hex = getProductColorHex(name);
          const isSelected = resolveProductColorLabel(value) === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={name}
              className={cn(
                "group flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isSelected ? "bg-primary-50 ring-2 ring-primary-500 ring-offset-2" : "hover:bg-zinc-50"
              )}
            >
              <span
                className={cn(
                  "h-10 w-10 rounded-full border border-black/10 shadow-inner transition",
                  isSelected ? "ring-2 ring-primary-600 ring-offset-2" : "ring-1 ring-zinc-200"
                )}
                style={{ backgroundColor: hex }}
                aria-hidden
              />
              <span className="max-w-[4.5rem] text-center text-[10px] font-medium leading-tight text-zinc-600 group-hover:text-zinc-900">
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {legacyUnknown ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
          Color actual en base de datos:{" "}
          <strong className="font-mono">{value.trim()}</strong>. Elige un swatch de arriba para
          reemplazarlo por un nombre de catálogo.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs font-medium text-zinc-500 underline-offset-2 transition hover:text-primary-700 hover:underline"
        >
          Sin color
        </button>
        {selectedLabel ? (
          <span className="text-xs text-zinc-600">
            Seleccionado: <strong className="text-zinc-900">{selectedLabel}</strong>
          </span>
        ) : (
          <span className="text-xs text-zinc-500">Ningún color seleccionado</span>
        )}
      </div>
    </div>
  );
}
