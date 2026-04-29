import {
  normalizeKnownUserRole,
  ROLE_ADMINISTRADOR,
  ROLE_CLIENT,
  ROLE_SUPER_ADMIN,
} from "@/lib/roles";

/** Etiquetas UI para valores de rol devueltos por el API. */
export const ADMIN_USER_ROLE_LABELS: Record<string, string> = {
  [ROLE_SUPER_ADMIN]: "Super administrador",
  [ROLE_ADMINISTRADOR]: "Administrador",
  [ROLE_CLIENT]: "Cliente",
};

export function formatAdminUserRole(role: string | undefined | null): string {
  if (!role) return "—";
  const canonical = normalizeKnownUserRole(role);
  if (canonical) return ADMIN_USER_ROLE_LABELS[canonical] ?? canonical;
  return role.trim() || "—";
}
