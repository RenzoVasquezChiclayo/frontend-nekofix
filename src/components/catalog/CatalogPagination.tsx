"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PaginationMeta } from "@/types/api";
import { cn } from "@/lib/utils";

type Props = {
  meta: PaginationMeta;
  className?: string;
};

export function catalogPageHref(searchParams: URLSearchParams, page: number): string {
  const next = new URLSearchParams(searchParams.toString());
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}

function visiblePageItems(current: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set<number>();
  set.add(1);
  set.add(totalPages);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= totalPages) set.add(p);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("gap");
    out.push(sorted[i]);
  }
  return out;
}

export function CatalogPagination({ meta, className }: Props) {
  const searchParams = useSearchParams();
  const { page, totalPages, total, limit } = meta;

  if (totalPages <= 1 || total === 0) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const items = visiblePageItems(page, totalPages);

  const linkClass =
    "touch-manipulation inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:min-h-10 sm:min-w-10";
  const activeClass = "border-primary-500 bg-primary-50 font-semibold text-primary-900";
  const disabledClass = "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400";

  return (
    <nav
      className={cn(
        "flex flex-col items-stretch gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      aria-label="Paginación del catálogo"
    >
      <p className="text-center text-sm text-zinc-500 sm:text-left">
        Página {page} de {totalPages}
        {total > 0 ? (
          <span className="text-zinc-400">
            {" "}
            · {total} producto{total === 1 ? "" : "s"}
          </span>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        {canPrev ? (
          <Link href={catalogPageHref(searchParams, page - 1)} scroll prefetch={false} className={linkClass}>
            Anterior
          </Link>
        ) : (
          <span className={cn(linkClass, disabledClass)} aria-disabled>
            Anterior
          </span>
        )}

        <ul className="hidden max-w-full flex-wrap items-center justify-center gap-1 sm:flex">
          {items.map((item, i) =>
            item === "gap" ? (
              <li key={`gap-${i}`} className="px-1 text-zinc-400" aria-hidden>
                …
              </li>
            ) : (
              <li key={item}>
                <Link
                  href={catalogPageHref(searchParams, item)}
                  scroll
                  prefetch={false}
                  className={cn(linkClass, item === page && activeClass)}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
        <p className="text-center text-sm font-medium text-zinc-600 sm:hidden" aria-hidden>
          {page} / {totalPages}
        </p>

        {canNext ? (
          <Link href={catalogPageHref(searchParams, page + 1)} scroll prefetch={false} className={linkClass}>
            Siguiente
          </Link>
        ) : (
          <span className={cn(linkClass, disabledClass)} aria-disabled>
            Siguiente
          </span>
        )}
      </div>

      {limit > 0 ? (
        <p className="text-center text-xs text-zinc-400 sm:hidden">{limit} por página</p>
      ) : null}
    </nav>
  );
}
