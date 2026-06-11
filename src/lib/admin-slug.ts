import { slugify } from "@/lib/utils";

export { slugify };

export const KEBAB_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function resolveAdminSlug(name: string, slug: string): string {
  return slug.trim() || slugify(name.trim());
}

export function validateKebabSlug(slug: string): string | null {
  const value = slug.trim();
  if (!value) return "Indica un slug.";
  if (!KEBAB_SLUG_REGEX.test(value)) {
    return "El slug debe usar solo letras minúsculas, números y guiones (kebab-case).";
  }
  return null;
}
