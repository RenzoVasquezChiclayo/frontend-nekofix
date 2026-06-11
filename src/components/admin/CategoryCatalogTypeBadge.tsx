import {
  CATEGORY_CATALOG_BADGE_CLASS,
  CATALOG_TYPE_PLURAL_LABELS,
} from "@/lib/catalog-labels";
import { resolveCategoryCatalogType } from "@/lib/product-catalog-type";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";

type Props = {
  category: Pick<Category, "catalogType" | "name" | "slug">;
  className?: string;
};

export function CategoryCatalogTypeBadge({ category, className }: Props) {
  const catalogType = resolveCategoryCatalogType(category);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        CATEGORY_CATALOG_BADGE_CLASS[catalogType],
        className
      )}
    >
      {CATALOG_TYPE_PLURAL_LABELS[catalogType]}
    </span>
  );
}
