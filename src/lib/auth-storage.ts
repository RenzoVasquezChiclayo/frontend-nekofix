/** Claves de persistencia local (cliente). En producción valorar cookies httpOnly vía BFF/Nest. */
export const AUTH_STORAGE = {
  token: "nekofix-auth-token",
  user: "nekofix-auth-user",
} as const;
