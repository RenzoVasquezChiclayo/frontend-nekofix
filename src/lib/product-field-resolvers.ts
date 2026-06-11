import { PRODUCT_CONDITION_LABELS } from "@/lib/catalog-labels";
import { normalizeUsedGrade } from "@/lib/used-grade";
import type {
  PhoneSeries,
  ProductConditionCatalog,
  ProductGradeCatalog,
} from "@/types/catalog-admin";
import type { Product, ProductCondition } from "@/types/product";

type ProductCatalogFields = Pick<
  Product,
  | "condition"
  | "grade"
  | "seriesId"
  | "series"
  | "conditionId"
  | "conditionRef"
  | "gradeId"
  | "gradeRef"
>;

export function resolveProductConditionId(product: ProductCatalogFields): string {
  return (
    product.conditionRef?.id ??
    product.conditionId ??
    ""
  ).trim();
}

export function resolveProductGradeId(product: ProductCatalogFields): string {
  return (product.gradeRef?.id ?? product.gradeId ?? "").trim();
}

export function resolveProductSeriesId(product: ProductCatalogFields): string {
  return (product.series?.id ?? product.seriesId ?? "").trim();
}

/** Etiqueta de condición: relación → legacy enum. */
export function resolveProductConditionLabel(product: ProductCatalogFields): string {
  if (product.conditionRef?.name?.trim()) return product.conditionRef.name.trim();
  const legacy = product.condition;
  if (legacy && PRODUCT_CONDITION_LABELS[legacy as ProductCondition]) {
    return PRODUCT_CONDITION_LABELS[legacy as ProductCondition];
  }
  if (legacy) return legacy;
  return "—";
}

/** Etiqueta de grado: relación → legacy string. */
export function resolveProductGradeLabel(product: ProductCatalogFields): string | null {
  if (product.gradeRef?.name?.trim()) return product.gradeRef.name.trim();
  const legacy = normalizeUsedGrade(product.grade);
  return legacy;
}

export function resolveProductSeriesLabel(product: ProductCatalogFields): string | null {
  if (product.series?.name?.trim()) return product.series.name.trim();
  return null;
}

export function sortCatalogByName<T extends { name: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function sortSeriesByName(rows: PhoneSeries[]): PhoneSeries[] {
  return sortCatalogByName(rows);
}

export function matchConditionFromLegacy(
  rows: ProductConditionCatalog[],
  legacy: ProductCondition | string | null | undefined
): ProductConditionCatalog | null {
  if (!legacy || rows.length === 0) return null;
  const label = PRODUCT_CONDITION_LABELS[legacy as ProductCondition];
  if (label) {
    const byName = rows.find((c) => c.name.trim().toLowerCase() === label.toLowerCase());
    if (byName) return byName;
  }
  const code = String(legacy).trim();
  return (
    rows.find((c) => c.name.trim().toUpperCase() === code.toUpperCase()) ?? null
  );
}

export function matchGradeFromLegacy(
  rows: ProductGradeCatalog[],
  legacyGrade: string | null | undefined
): ProductGradeCatalog | null {
  const normalized = normalizeUsedGrade(legacyGrade);
  if (!normalized || rows.length === 0) return null;
  return (
    rows.find((g) => g.name.trim().toUpperCase() === normalized.toUpperCase()) ?? null
  );
}
