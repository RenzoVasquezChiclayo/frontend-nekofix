/**
 * Usuario (tienda o admin). El backend debe enviar `role` en login/register/me.
 *
 * ## Contrato esperado para panel admin (`POST /auth/login` y `GET /auth/me`)
 *
 * El campo `user.role` debe ser exactamente `"ADMINISTRADOR"` para acceder al panel.
 *
 * ```json
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "opcional",
 *   "expiresIn": 3600,
 *   "user": {
 *     "id": "uuid-o-numeric-id",
 *     "email": "admin@tu-dominio.com",
 *     "name": "Nombre del admin",
 *     "phone": "+51999888777",
 *     "role": "ADMINISTRADOR"
 *   }
 * }
 * ```
 *
 * Si `role` no es `ADMINISTRADOR`, el front rechaza el acceso aunque el token sea válido.
 * Errores: `401` credenciales inválidas; `403` usuario sin rol admin (mensaje en `message`).
 *
 * ## Rutas esperadas (convención actual)
 * - Admin: `/auth/login`, `/auth/me`
 * - Cliente: `/auth/client/login`, `/auth/client/register`, `/auth/client/me`
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  /** Ej. `ADMINISTRADOR` | `CLIENTE`. Obligatorio para validar acceso al panel. */
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

/** Respuesta típica de login/register en Nest + Passport JWT */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: AuthUser;
}
