import { CATALOG_TYPE_BADGE_CLASS, CATALOG_TYPE_LABELS } from "@/lib/catalog-labels";
import { resolveProductCatalogType } from "@/lib/product-catalog-type";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  product: Pick<Product, "catalogType" | "category">;
  className?: string;
};

export function CatalogTypeBadge({ product, className }: Props) {
  const catalogType = resolveProductCatalogType(product);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        CATALOG_TYPE_BADGE_CLASS[catalogType],
        className
      )}
    >
      {CATALOG_TYPE_LABELS[catalogType]}
    </span>
  );
}
