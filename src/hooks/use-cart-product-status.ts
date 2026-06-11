"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { isProductOutOfStock, resolveProductStatus } from "@/lib/product-status";
import { getProductBySlug } from "@/services/product.service";
import type { CartLine } from "@/types/order";
import type { ProductStatus } from "@/types/product";

type StatusMap = Record<string, ProductStatus>;

/**
 * Revalida el status actual de los productos del carrito contra el API.
 */
export function useCartProductStatus(lines: CartLine[]) {
  const slugsKey = useMemo(
    () =>
      [...new Set(lines.map((l) => l.slug))]
        .sort()
        .join("|"),
    [lines]
  );

  const [statusByProductId, setStatusByProductId] = useState<StatusMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugsKey) {
      setStatusByProductId({});
      return;
    }

    const slugs = slugsKey.split("|").filter(Boolean);
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          slugs.map(async (slug) => {
            try {
              const product = await getProductBySlug(slug);
              return { slug, productId: product.id, status: resolveProductStatus(product) };
            } catch {
              return null;
            }
          })
        );

        if (cancelled) return;

        const next: StatusMap = {};
        for (const line of lines) {
          if (line.productStatus) {
            next[line.productId] = line.productStatus;
          }
        }
        for (const row of results) {
          if (row) next[row.productId] = row.status;
        }
        setStatusByProductId(next);
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slugsKey, lines]);

  const outOfStockLines = useMemo(
    () =>
      lines.filter((line) => {
        const status = statusByProductId[line.productId] ?? line.productStatus;
        return status != null && isProductOutOfStock({ status });
      }),
    [lines, statusByProductId]
  );

  return { statusByProductId, outOfStockLines, loading, error };
}
