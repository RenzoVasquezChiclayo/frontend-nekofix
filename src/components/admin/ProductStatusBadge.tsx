import {
  PRODUCT_STATUS_LABELS,
  resolveProductStatus,
} from "@/lib/product-status";
import { cn } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/product";

const STATUS_BADGE_CLASS: Record<ProductStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
  HIDDEN: "bg-zinc-200 text-zinc-700",
};

type Props = {
  product: Pick<Product, "status">;
  className?: string;
};

export function ProductStatusBadge({ product, className }: Props) {
  const status = resolveProductStatus(product);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        STATUS_BADGE_CLASS[status],
        className
      )}
    >
      {PRODUCT_STATUS_LABELS[status]}
    </span>
  );
}
