/** Rol con acceso completo al panel (debe coincidir con el backend). */
export const ROLE_ADMINISTRADOR = "ADMINISTRADOR" as const;

export type AdminRole = typeof ROLE_ADMINISTRADOR;

export function isAdministrador(role: string | undefined | null): boolean {
  return role === ROLE_ADMINISTRADOR;
}
