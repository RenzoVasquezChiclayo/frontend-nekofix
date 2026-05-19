"use client";

import { useEffect, useId, useState } from "react";
import {
  PRODUCT_COLOR_OPTIONS,
  getPresetProductColorHex,
  isValidColorHex,
  matchCatalogPresetName,
  normalizeColorHex,
  resolveProductColorHex,
} from "@/lib/product-color-map";
import { cn } from "@/lib/utils";

type Props = {
  color: string;
  colorHex: string;
  /** Cambia al cargar otro producto en edición. */
  resetKey?: string;
  onChange: (color: string, colorHex: string | null) => void;
};

type PickerMode = "none" | "preset" | "custom";

export function AdminProductColorPicker({
  color,
  colorHex,
  resetKey = "default",
  onChange,
}: Props) {
  const customNameId = useId();
  const customHexId = useId();
  const [mode, setMode] = useState<PickerMode>("none");
  const [customName, setCustomName] = useState("");
  const [customHex, setCustomHex] = useState("#3b82f6");

  useEffect(() => {
    const trimmed = color.trim();
    if (!trimmed) {
      setMode("none");
      return;
    }
    const preset = matchCatalogPresetName(trimmed);
    if (preset) {
      setMode("preset");
      return;
    }
    setMode("custom");
    setCustomName(trimmed);
    setCustomHex(
      normalizeColorHex(colorHex) ?? resolveProductColorHex(trimmed, null)
    );
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al cambiar producto

  const activePreset = matchCatalogPresetName(color);
  const previewHex =
    mode === "custom"
      ? normalizeColorHex(customHex) ?? resolveProductColorHex(customName, null)
      : color.trim()
        ? resolveProductColorHex(color, colorHex)
        : "#e5e7eb";

  function selectPreset(name: (typeof PRODUCT_COLOR_OPTIONS)[number]) {
    setMode("preset");
    onChange(name, getPresetProductColorHex(name));
  }

  function selectCustomMode() {
    setMode("custom");
    const name = customName.trim() || color.trim() || "";
    const hex =
      normalizeColorHex(customHex) ??
      normalizeColorHex(colorHex) ??
      getPresetProductColorHex("Blue");
    setCustomName(name);
    setCustomHex(hex);
    if (name) onChange(name, hex);
  }

  function updateCustom(name: string, hex: string) {
    setCustomName(name);
    setCustomHex(hex);
    const normalized = normalizeColorHex(hex);
    if (name.trim() && normalized) {
      onChange(name.trim(), normalized);
    }
  }

  function clearColor() {
    setMode("none");
    setCustomName("");
    onChange("", null);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
        {PRODUCT_COLOR_OPTIONS.map((name) => {
          const hex = getPresetProductColorHex(name);
          const isSelected = mode === "preset" && activePreset === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => selectPreset(name)}
              title={name}
              className={cn(
                "group flex flex-col items-center gap-1 rounded-xl p-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary-50 ring-2 ring-primary-500 ring-offset-2"
                  : "hover:bg-zinc-50"
              )}
            >
              <span
                className={cn(
                  "h-9 w-9 rounded-full border border-black/10 shadow-inner",
                  isSelected ? "ring-2 ring-primary-600 ring-offset-2" : "ring-1 ring-zinc-200"
                )}
                style={{ backgroundColor: hex }}
                aria-hidden
              />
              <span className="max-w-[4.25rem] text-center text-[9px] font-medium leading-tight text-zinc-600 group-hover:text-zinc-900 sm:text-[10px]">
                {name}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={selectCustomMode}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          mode === "custom"
            ? "border-primary-300 bg-primary-50/60 ring-1 ring-primary-200"
            : "border-dashed border-zinc-300 bg-zinc-50/50 hover:border-primary-200 hover:bg-white"
        )}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-light text-zinc-500"
          aria-hidden
        >
          +
        </span>
        <span>
          <span className="font-semibold text-zinc-900">Otro color personalizado</span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            Nombre libre y color visual (se guarda en el producto).
          </span>
        </span>
      </button>

      {mode === "custom" ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor={customNameId} className="block">
              <span className="text-sm font-medium text-zinc-700">Nombre del color</span>
              <input
                id={customNameId}
                type="text"
                value={customName}
                onChange={(e) => updateCustom(e.target.value, customHex)}
                placeholder="Ej. Azul Marino, Titanio Azul, Coral"
                className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </label>
            <label htmlFor={customHexId} className="block">
              <span className="text-sm font-medium text-zinc-700">Color visual</span>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  id={customHexId}
                  type="color"
                  value={
                    normalizeColorHex(customHex)?.slice(0, 7) ??
                    "#3b82f6"
                  }
                  onChange={(e) => updateCustom(customName, e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-zinc-200 bg-white p-0.5"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => updateCustom(customName, e.target.value)}
                  placeholder="#1E3A8A"
                  spellCheck={false}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm uppercase focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </label>
          </div>
          {!isValidColorHex(customHex) && customHex.trim() ? (
            <p className="mt-3 text-xs text-amber-800">
              Usa un HEX válido (#RGB o #RRGGBB), por ejemplo #1E3A8A.
            </p>
          ) : null}
          <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4">
            <span
              className="h-10 w-10 shrink-0 rounded-full border border-black/10 shadow-inner"
              style={{ backgroundColor: previewHex }}
              aria-hidden
            />
            <p className="text-xs text-zinc-600">
              Vista previa
              {customName.trim() ? (
                <>
                  : <strong className="text-zinc-900">{customName.trim()}</strong>
                </>
              ) : (
                " — escribe un nombre"
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={clearColor}
          className="text-xs font-medium text-zinc-500 underline-offset-2 transition hover:text-primary-700 hover:underline"
        >
          Sin color
        </button>
        {color.trim() ? (
          <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
            <span
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ backgroundColor: previewHex }}
              aria-hidden
            />
            Guardado: <strong className="text-zinc-900">{color.trim()}</strong>
            {normalizeColorHex(colorHex) ? (
              <span className="font-mono text-zinc-500">{normalizeColorHex(colorHex)}</span>
            ) : null}
          </span>
        ) : (
          <span className="text-xs text-zinc-500">Ningún color seleccionado</span>
        )}
      </div>
    </div>
  );
}
