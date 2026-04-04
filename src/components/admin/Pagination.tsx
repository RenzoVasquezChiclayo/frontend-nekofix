"use client";

import type { PaginationMeta } from "@/types/api";
import { cn } from "@/lib/utils";

type Props = {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
  className?: string;
  /** Muestra texto "Página X de Y · Z ítems" */
  showSummary?: boolean;
};

export function Pagination({
  meta,
  onPageChange,
  className,
  showSummary = true,
}: Props) {
  const { page, totalPages, total, limit } = meta;
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-4 sm:flex-row",
        className
      )}
    >
      {showSummary ? (
        <p className="text-sm text-zinc-500">
          Página {page} de {Math.max(totalPages, 1)}
          {total > 0 ? ` · ${total} resultado${total === 1 ? "" : "s"}` : null}
          {limit > 0 ? (
            <span className="text-zinc-400"> · {limit} por página</span>
          ) : null}
        </p>
      ) : null}
      {onPageChange ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  );
}
