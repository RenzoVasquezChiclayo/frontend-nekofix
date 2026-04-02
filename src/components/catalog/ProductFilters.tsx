"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import type {
  Brand,
  Category,
  PhoneModel,
  ProductCondition,
  ProductType,
} from "@/types/product";

const TYPES: ProductType[] = ["NEW", "USED", "ACCESSORY"];
const CONDITIONS: ProductCondition[] = [
  "NEW",
  "SEMINUEVO",
  "REFURBISHED",
  "REPAIRED",
  "FOR_PARTS",
];

type Props = {
  brands: Brand[];
  categories: Category[];
  models: PhoneModel[];
  onNavigate?: () => void;
};

function mergeParams(
  base: URLSearchParams,
  patch: Record<string, string | undefined>
): string {
  const next = new URLSearchParams(base.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === "") next.delete(k);
    else next.set(k, v);
  }
  next.set("page", "1");
  return next.toString();
}

export function ProductFilters({ brands, categories, models, onNavigate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as ProductType | null;
  const condition = searchParams.get("condition") as ProductCondition | null;
  const brandId = searchParams.get("brandId") ?? "";
  const legacyBrandSlug = searchParams.get("brand") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const legacyCategorySlug = searchParams.get("category") ?? "";
  const modelId = searchParams.get("modelId") ?? "";
  const legacyModelSlug = searchParams.get("model") ?? "";
  const featured = searchParams.get("featured") === "true";
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const storageRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  function navigate(qs: string) {
    onNavigate?.();
    router.push(`/catalogo?${qs}`);
  }

  function applyExtras() {
    const minPrice = minRef.current?.value.trim() ?? "";
    const maxPrice = maxRef.current?.value.trim() ?? "";
    const storage = storageRef.current?.value.trim() ?? "";
    const color = colorRef.current?.value.trim() ?? "";
    const q = mergeParams(searchParams, {
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      storage: storage || undefined,
      color: color || undefined,
    });
    navigate(q);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-md">
      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Categoría
        </summary>
        <div className="mt-3 flex max-h-40 flex-col gap-1 overflow-y-auto">
          <FilterLink
            href={`/catalogo?${mergeParams(searchParams, { categoryId: undefined, category: undefined })}`}
            onClick={onNavigate}
            active={!categoryId && !legacyCategorySlug}
          >
            Todas
          </FilterLink>
          {categories.map((c) => (
            <FilterLink
              key={c.id}
              href={`/catalogo?${mergeParams(searchParams, { categoryId: c.id, category: undefined })}`}
              onClick={onNavigate}
              active={categoryId === c.id}
            >
              {c.name}
            </FilterLink>
          ))}
        </div>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Marca
        </summary>
        <select
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          value={brandId}
          onChange={(e) => {
            const v = e.target.value;
            navigate(
              mergeParams(searchParams, { brandId: v || undefined, brand: undefined })
            );
          }}
        >
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Modelo
        </summary>
        <select
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          value={modelId}
          onChange={(e) => {
            const v = e.target.value;
            navigate(
              mergeParams(searchParams, { modelId: v || undefined, model: undefined })
            );
          }}
        >
          <option value="">Todos</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Tipo
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip
            href={`/catalogo?${mergeParams(searchParams, { type: undefined })}`}
            onClick={onNavigate}
            active={!type}
          >
            Todos
          </Chip>
          {TYPES.map((t) => (
            <Chip
              key={t}
              href={`/catalogo?${mergeParams(searchParams, { type: t })}`}
              onClick={onNavigate}
              active={type === t}
            >
              {PRODUCT_TYPE_LABELS[t]}
            </Chip>
          ))}
        </div>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Condición
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip
            href={`/catalogo?${mergeParams(searchParams, { condition: undefined })}`}
            onClick={onNavigate}
            active={!condition}
          >
            Todas
          </Chip>
          {CONDITIONS.map((c) => (
            <Chip
              key={c}
              href={`/catalogo?${mergeParams(searchParams, { condition: c })}`}
              onClick={onNavigate}
              active={condition === c}
            >
              {PRODUCT_CONDITION_LABELS[c]}
            </Chip>
          ))}
        </div>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Solo destacados
        </summary>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              navigate(
                mergeParams(searchParams, {
                  featured: e.target.checked ? "true" : undefined,
                })
              )
            }
            className="rounded border-zinc-300 accent-primary-600"
          />
          Mostrar destacados
        </label>
      </details>

      <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
        <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Precio
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            ref={minRef}
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <input
            ref={maxRef}
            type="number"
            min={0}
            placeholder="Máx"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <input
          ref={storageRef}
          placeholder="Almacenamiento (ej. 256GB)"
          defaultValue={searchParams.get("storage") ?? ""}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <input
          ref={colorRef}
          placeholder="Color"
          defaultValue={searchParams.get("color") ?? ""}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <button
          type="button"
          onClick={applyExtras}
          className="mt-3 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Aplicar filtros
        </button>
      </details>

      <Link
        href="/catalogo"
        onClick={onNavigate}
        className="block rounded-xl border border-zinc-200 px-4 py-2 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

function Chip({
  href,
  onClick,
  active,
  children,
}: {
  href: string;
  onClick?: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-primary-600 text-white"
          : "bg-primary-50 text-primary-800 hover:bg-primary-100"
      }`}
    >
      {children}
    </Link>
  );
}

function FilterLink({
  href,
  onClick,
  active,
  children,
}: {
  href: string;
  onClick?: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-2 py-1.5 text-sm transition ${
        active ? "bg-primary-600 font-medium text-white" : "text-primary-800 hover:bg-primary-50"
      }`}
    >
      {children}
    </Link>
  );
}
