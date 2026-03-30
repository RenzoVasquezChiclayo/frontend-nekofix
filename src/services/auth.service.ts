import { apiFetch } from "@/services/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

/**
 * Rutas orientativas para NestJS (AuthModule + JWT).
 * Ajusta si tu backend usa otros paths, por ejemplo:
 * `/customers/auth/login`, `/customers/register`, etc.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}

export async function getProfile(accessToken: string): Promise<AuthResponse["user"]> {
  return apiFetch<AuthResponse["user"]>("/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
}
