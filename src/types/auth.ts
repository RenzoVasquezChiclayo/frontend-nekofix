/** Usuario cliente (alineable con respuesta NestJS / JWT) */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
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
