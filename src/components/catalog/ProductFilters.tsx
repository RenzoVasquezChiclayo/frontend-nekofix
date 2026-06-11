"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useCatalogFilterOptions } from "@/hooks/use-catalog-filter-options";
import { PRODUCT_TYPE_LABELS } from "@/lib/catalog-labels";
import type { CatalogFilterMode, CatalogFilterOptions } from "@/lib/load-catalog-filters";
import type { ProductType } from "@/types/product";

const TYPES: ProductType[] = ["NEW", "USED", "ACCESSORY"];

type Props = {
  filterOptions: CatalogFilterOptions;
  filterMode: CatalogFilterMode;
  basePath?: "/catalogo" | "/repuestos";
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

export function ProductFilters({
  filterOptions,
  filterMode,
  basePath = "/catalogo",
  onNavigate,
}: Props) {
  const isStore = filterMode === "store";
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") as ProductType | null;
  const brandId = searchParams.get("brandId") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const seriesId = searchParams.get("seriesId") ?? "";
  const modelId = searchParams.get("modelId") ?? "";
  const conditionId = searchParams.get("conditionId") ?? "";
  const gradeId = searchParams.get("gradeId") ?? "";
  const featured = searchParams.get("featured") === "true";

  const { seriesForBrand, modelsForSelection } = useCatalogFilterOptions({
    options: filterOptions,
    brandId,
    seriesId,
  });

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const storageRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  function navigate(qs: string) {
    onNavigate?.();
    router.push(`${basePath}?${qs}`);
  }

  function applyPriceRange() {
    const minPrice = minRef.current?.value.trim() ?? "";
    const maxPrice = maxRef.current?.value.trim() ?? "";
    navigate(
      mergeParams(searchParams, {
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      })
    );
  }

  function applyStorageColor() {
    const storage = storageRef.current?.value.trim() ?? "";
    const color = colorRef.current?.value.trim() ?? "";
    navigate(
      mergeParams(searchParams, {
        storage: storage || undefined,
        color: color || undefined,
      })
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-md">
      <FilterSection title="Categoría">
        <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
          <FilterLink
            href={`${basePath}?${mergeParams(searchParams, { categoryId: undefined, category: undefined })}`}
            onClick={onNavigate}
            active={!categoryId}
          >
            Todas
          </FilterLink>
          {filterOptions.categories.map((c) => (
            <FilterLink
              key={c.id}
              href={`${basePath}?${mergeParams(searchParams, { categoryId: c.id, category: undefined })}`}
              onClick={onNavigate}
              active={categoryId === c.id}
            >
              {c.name}
            </FilterLink>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Marca">
        <select
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          value={brandId}
          onChange={(e) => {
            const v = e.target.value;
            navigate(
              mergeParams(searchParams, {
                brandId: v || undefined,
                brand: undefined,
                seriesId: undefined,
                modelId: undefined,
                model: undefined,
              })
            );
          }}
        >
          <option value="">Todas</option>
          {filterOptions.brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </FilterSection>

      {isStore ? (
        <FilterSection title="Serie">
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            value={seriesId}
            disabled={!brandId && seriesForBrand.length === 0}
            onChange={(e) => {
              const v = e.target.value;
              navigate(
                mergeParams(searchParams, {
                  seriesId: v || undefined,
                  modelId: undefined,
                  model: undefined,
                })
              );
            }}
          >
            <option value="">Todas</option>
            {seriesForBrand.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </FilterSection>
      ) : null}

      <FilterSection title="Modelo">
        <select
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          value={modelId}
          onChange={(e) => {
            const v = e.target.value;
            navigate(
              mergeParams(searchParams, { modelId: v || undefined, model: undefined })
            );
          }}
        >
          <option value="">Todos</option>
          {modelsForSelection.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Condición">
        <div className="flex flex-wrap gap-2">
          <Chip
            href={`${basePath}?${mergeParams(searchParams, { conditionId: undefined, condition: undefined })}`}
            onClick={onNavigate}
            active={!conditionId}
          >
            Todas
          </Chip>
          {filterOptions.conditions.map((c) => (
            <Chip
              key={c.id}
              href={`${basePath}?${mergeParams(searchParams, { conditionId: c.id, condition: undefined })}`}
              onClick={onNavigate}
              active={conditionId === c.id}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </FilterSection>

      {isStore ? (
        <FilterSection title="Grado">
          <div className="flex flex-wrap gap-2">
            <Chip
              href={`${basePath}?${mergeParams(searchParams, { gradeId: undefined })}`}
              onClick={onNavigate}
              active={!gradeId}
            >
              Todos
            </Chip>
            {filterOptions.grades.map((g) => (
              <Chip
                key={g.id}
                href={`${basePath}?${mergeParams(searchParams, { gradeId: g.id })}`}
                onClick={onNavigate}
                active={gradeId === g.id}
              >
                {g.name}
              </Chip>
            ))}
          </div>
        </FilterSection>
      ) : null}

      {isStore ? (
        <>
          <FilterSection title="Color">
            <input
              ref={colorRef}
              placeholder="Ej. Negro, Azul"
              defaultValue={searchParams.get("color") ?? ""}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              onClick={applyStorageColor}
              className="mt-2 w-full rounded-xl border border-zinc-200 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Aplicar color
            </button>
          </FilterSection>

          <FilterSection title="Almacenamiento">
            <input
              ref={storageRef}
              placeholder="Ej. 256GB"
              defaultValue={searchParams.get("storage") ?? ""}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              onClick={applyStorageColor}
              className="mt-2 w-full rounded-xl border border-zinc-200 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Aplicar almacenamiento
            </button>
          </FilterSection>
        </>
      ) : null}

      {isStore ? (
        <FilterSection title="Tipo">
          <div className="flex flex-wrap gap-2">
            <Chip
              href={`${basePath}?${mergeParams(searchParams, { type: undefined })}`}
              onClick={onNavigate}
              active={!type}
            >
              Todos
            </Chip>
            {TYPES.map((t) => (
              <Chip
                key={t}
                href={`${basePath}?${mergeParams(searchParams, { type: t })}`}
                onClick={onNavigate}
                active={type === t}
              >
                {PRODUCT_TYPE_LABELS[t]}
              </Chip>
            ))}
          </div>
        </FilterSection>
      ) : null}

      <FilterSection title="Solo destacados">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
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
      </FilterSection>

      <FilterSection title="Precio">
        <div className="grid grid-cols-2 gap-2">
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
        <button
          type="button"
          onClick={applyPriceRange}
          className="mt-3 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Aplicar precio
        </button>
      </FilterSection>

      <Link
        href={basePath}
        onClick={onNavigate}
        className="block rounded-xl border border-zinc-200 px-4 py-2 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
      <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </summary>
      <div className="mt-3">{children}</div>
    </details>
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
