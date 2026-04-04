import { apiFetch } from "@/services/api";

type FetchOpts = Parameters<typeof apiFetch>[1];

/**
 * Peticiones autenticadas al API NestJS (JWT).
 * No usar en Server Components: el token solo existe en el cliente (Zustand/localStorage).
 */
export async function adminApiFetch<T>(
  path: string,
  accessToken: string,
  options: FetchOpts = {}
): Promise<T> {
  const { headers, ...rest } = options;
  return apiFetch<T>(path, {
    ...rest,
    headers: {
      ...(headers as Record<string, string>),
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 0 },
  });
}
