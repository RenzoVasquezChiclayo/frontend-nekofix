import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { cn } from "@/lib/utils";
import type { ProductCondition, ProductType } from "@/types/product";

type Props = {
  type: ProductType;
  condition: ProductCondition;
  lowStock?: boolean;
  className?: string;
};

export function ProductBadges({ type, condition, lowStock, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <span className="rounded-full bg-primary-800/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
        {PRODUCT_TYPE_LABELS[type]}
      </span>
      <span className="rounded-full bg-primary-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
        {PRODUCT_CONDITION_LABELS[condition]}
      </span>
      {lowStock ? (
        <span className="rounded-full bg-amber-500/95 px-2 py-0.5 text-[10px] font-semibold text-white">
          Stock bajo
        </span>
      ) : null}
    </div>
  );
}
