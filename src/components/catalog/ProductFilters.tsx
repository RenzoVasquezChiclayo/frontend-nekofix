"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import {
  PRODUCT_KIND_LABELS,
  WEAR_GRADE_LABELS,
} from "@/lib/constants";
import type { ProductKind } from "@/types/product";
import type { DeviceWearGrade } from "@/types/product";

const KINDS: ProductKind[] = ["nuevo", "seminuevo", "accesorio"];
const WEAR: DeviceWearGrade[] = [
  "excelente",
  "muy_bueno",
  "bueno",
  "aceptable",
];

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

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") as ProductKind | null;
  const wear = searchParams.get("wearGrade") as DeviceWearGrade | null;
  const colorQ = searchParams.get("color") ?? "";
  const storageQ = searchParams.get("storageGb") ?? "";
  const colorRef = useRef<HTMLInputElement>(null);
  const storageRef = useRef<HTMLInputElement>(null);

  function applyColorStorage() {
    const color = colorRef.current?.value.trim() ?? "";
    const storageGb = storageRef.current?.value.trim() ?? "";
    const q = mergeParams(searchParams, {
      color: color || undefined,
      storageGb: storageGb || undefined,
    });
    router.push(`/catalogo?${q}`);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Tipo
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip
            href={`/catalogo?${mergeParams(searchParams, { kind: undefined })}`}
            active={!kind}
          >
            Todos
          </FilterChip>
          {KINDS.map((k) => (
            <FilterChip
              key={k}
              href={`/catalogo?${mergeParams(searchParams, { kind: k })}`}
              active={kind === k}
            >
              {PRODUCT_KIND_LABELS[k]}
            </FilterChip>
          ))}
        </div>
      </div>

      {kind === "seminuevo" || kind === null ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Estado del equipo
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterChip
              href={`/catalogo?${mergeParams(searchParams, { wearGrade: undefined })}`}
              active={!wear}
            >
              Cualquiera
            </FilterChip>
            {WEAR.map((w) => (
              <FilterChip
                key={w}
                href={`/catalogo?${mergeParams(searchParams, { wearGrade: w })}`}
                active={wear === w}
              >
                {WEAR_GRADE_LABELS[w]}
              </FilterChip>
            ))}
          </div>
        </div>
      ) : null}

      <div key={`${colorQ}|${storageQ}`} className="space-y-3">
        <div>
          <label htmlFor="color" className="text-xs font-semibold text-zinc-500">
            Color
          </label>
          <input
            id="color"
            ref={colorRef}
            defaultValue={colorQ}
            placeholder="ej. Negro"
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="storageGb" className="text-xs font-semibold text-zinc-500">
            Almacenamiento (GB)
          </label>
          <input
            id="storageGb"
            ref={storageRef}
            type="number"
            min={0}
            defaultValue={storageQ || undefined}
            placeholder="128"
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={applyColorStorage}
          className="w-full rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          Aplicar color / almacenamiento
        </button>
      </div>

      <Link
        href="/catalogo"
        className="block text-center text-sm text-zinc-600 underline hover:text-zinc-900"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-primary-900 text-white"
          : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-300"
      }`}
    >
      {children}
    </Link>
  );
}
