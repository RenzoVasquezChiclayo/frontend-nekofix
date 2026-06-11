import {
  resolveProductConditionLabel,
  resolveProductGradeLabel,
  resolveProductSeriesLabel,
} from "@/lib/product-field-resolvers";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  className?: string;
};

/** Metadatos dinámicos de catálogo (serie, condición, grado) en ficha de producto. */
export function ProductCatalogMeta({ product, className }: Props) {
  const series = resolveProductSeriesLabel(product);
  const condition = resolveProductConditionLabel(product);
  const grade = resolveProductGradeLabel(product);
  const showCondition = condition !== "—";
  const items: { label: string; value: string }[] = [];

  if (series) items.push({ label: "Serie", value: series });
  if (showCondition) items.push({ label: "Condición", value: condition });
  if (grade) items.push({ label: "Grado", value: grade });

  if (items.length === 0) return null;

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.label} className="text-sm text-ink-soft">
          <span className="font-medium text-ink">{item.label}:</span> {item.value}
        </li>
      ))}
    </ul>
  );
}
