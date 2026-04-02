import { apiFetch } from "@/services/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

/**
 * Convención de rutas:
 * - Cliente: `/auth/client/*`
 * - Admin: `/auth/*` (sin prefijo `/admin`)
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/client/login", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/client/register", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

export async function getProfile(accessToken: string): Promise<AuthResponse["user"]> {
  return apiFetch<AuthResponse["user"]>("/auth/client/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
}

/** Login exclusivo del panel. Ver contrato JSON en `AuthUser` (types/auth.ts). */
export async function adminLogin(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

/** Perfil del admin autenticado (validar token y rol). */
export async function getAdminProfile(accessToken: string): Promise<AuthResponse["user"]> {
  return apiFetch<AuthResponse["user"]>("/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
}
