/**
 * Sesión del panel admin (separada de la tienda pública en `auth-storage`).
 * En producción, valorar cookies httpOnly vía BFF o mismo dominio.
 */
export const ADMIN_AUTH_STORAGE = {
  token: "nekofix-admin-token",
  user: "nekofix-admin-user",
} as const;
