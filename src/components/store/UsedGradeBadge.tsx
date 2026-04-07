import { cn } from "@/lib/utils";
import { normalizeUsedGrade } from "@/lib/used-grade";
import type { ProductType } from "@/types/product";

type Props = {
  grade: string | null | undefined;
  type: ProductType;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Badge de grado cosmético (A+ / A / B) solo para productos usados.
 */
export function UsedGradeBadge({ grade, type, className, size = "sm" }: Props) {
  if (type !== "USED") return null;
  const g = normalizeUsedGrade(grade);
  if (!g) return null;

  const label = `Grado ${g}`;
  const sizeCls =
    size === "md"
      ? "px-2.5 py-1 text-[11px] ring-1"
      : "px-2 py-0.5 text-[10px] ring-1";

  const tone =
    g === "A+"
      ? "bg-emerald-50 text-emerald-900 ring-emerald-200/90"
      : g === "A"
        ? "bg-sky-50 text-sky-900 ring-sky-200/90"
        : g === "B"
          ? "bg-amber-50 text-amber-900 ring-amber-200/90"
          : "bg-zinc-100 text-zinc-700 ring-zinc-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-wide",
        sizeCls,
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
