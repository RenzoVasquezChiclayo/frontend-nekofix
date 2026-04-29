/** Valores de rol alineados al backend (usuarios / auth). */
export const ROLE_SUPER_ADMIN = "SUPER_ADMIN" as const;
export const ROLE_ADMINISTRADOR = "ADMINISTRADOR" as const;
export const ROLE_CLIENT = "CLIENT" as const;

/**
 * Roles que el front reconoce en API y formularios.
 * Panel web: solo `SUPER_ADMIN` y `ADMINISTRADOR` pueden iniciar sesión en `/admin`.
 */
export type KnownUserRole =
  | typeof ROLE_SUPER_ADMIN
  | typeof ROLE_ADMINISTRADOR
  | typeof ROLE_CLIENT;

const CANONICAL_ROLES: ReadonlySet<string> = new Set<string>([
  ROLE_SUPER_ADMIN,
  ROLE_ADMINISTRADOR,
  ROLE_CLIENT,
]);

/** Quién puede usar login + rutas `/admin/(panel)`. `CLIENT` no entra al panel. */
const PANEL_LOGIN_ROLES: ReadonlySet<string> = new Set<string>([
  ROLE_SUPER_ADMIN,
  ROLE_ADMINISTRADOR,
]);

/**
 * Normaliza `user.role` del API/JWT a un valor canónico, o `null` si no coincide.
 * Incluye alias y legacy `ADMIN` → `ADMINISTRADOR`.
 */
export function normalizeKnownUserRole(role: string | undefined | null): KnownUserRole | null {
  if (role == null || typeof role !== "string") return null;
  const t = role.trim();
  if (!t) return null;
  const u = t.replace(/-/g, "_").toUpperCase();

  const alias: Record<string, KnownUserRole> = {
    SUPER_ADMIN: ROLE_SUPER_ADMIN,
    SUPERADMIN: ROLE_SUPER_ADMIN,
    SUPERADMINISTRADOR: ROLE_SUPER_ADMIN,
    SUPER_ADMINISTRADOR: ROLE_SUPER_ADMIN,
    ADMINISTRADOR: ROLE_ADMINISTRADOR,
    /** Legacy: tratar como administrador de panel */
    ADMIN: ROLE_ADMINISTRADOR,
    CLIENT: ROLE_CLIENT,
    CLIENTE: ROLE_CLIENT,
  };

  const mapped = alias[u];
  if (mapped) return mapped;
  if (CANONICAL_ROLES.has(t)) return t as KnownUserRole;
  if (CANONICAL_ROLES.has(u)) return u as KnownUserRole;
  return null;
}

/** @deprecated Usar `normalizeKnownUserRole`. Se mantiene por compatibilidad con imports antiguos. */
export function normalizeAdminPanelRole(
  role: string | undefined | null
): KnownUserRole | null {
  return normalizeKnownUserRole(role);
}

/**
 * Puede usar el panel admin (login + rutas `/admin/(panel)`).
 * Solo `SUPER_ADMIN` y `ADMINISTRADOR` (y alias normalizados, p. ej. `ADMIN` legacy).
 */
export function isAdministrador(role: string | undefined | null): boolean {
  const n = normalizeKnownUserRole(role);
  return n != null && PANEL_LOGIN_ROLES.has(n);
}

export function isSuperAdmin(role: string | undefined | null): boolean {
  return normalizeKnownUserRole(role) === ROLE_SUPER_ADMIN;
}
