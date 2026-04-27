/**
 * Grados de estado cosmético para productos `type === "USED"`.
 * El backend puede enviar variantes de texto; normalizamos a claves de UI.
 */

export const USED_GRADE_ORDER = ["A+", "A", "B"] as const;
export type UsedGradeKey = (typeof USED_GRADE_ORDER)[number];

/** Normaliza grado para comparar y ordenar (A+, A, B u otro string). */
export function normalizeUsedGrade(grade: string | null | undefined): string | null {
  if (grade == null) return null;
  const t = grade.trim().toUpperCase().replace(/\s+/g, "");
  if (t === "A+") return "A+";
  if (t === "A") return "A";
  if (t === "B") return "B";
  const raw = grade.trim();
  return raw.length > 0 ? raw : null;
}

export function usedGradeSortIndex(grade: string | null | undefined): number {
  const n = normalizeUsedGrade(grade);
  if (!n) return 99;
  const i = USED_GRADE_ORDER.indexOf(n as UsedGradeKey);
  return i === -1 ? 50 : i;
}

export function sortProductsByGrade<T extends { grade?: string | null }>(products: T[]): T[] {
  return [...products].sort((a, b) => usedGradeSortIndex(a.grade) - usedGradeSortIndex(b.grade));
}
