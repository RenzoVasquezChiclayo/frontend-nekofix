import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { AdminUser, AdminUserCreateInput, AdminUserUpdateInput } from "@/types/admin-user";
import { adminApiFetch } from "@/services/admin/client";

/** Query de listado de usuarios (admin). */
export type AdminUserListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
};

/**
 * Listado paginado. Rutas esperadas: `GET /users`.
 * Query: `page`, `limit`, `search`, `role`, `isActive`.
 */
export async function getUsers(
  token: string,
  query: AdminUserListQuery = {}
): Promise<ApiListResponse<AdminUser>> {
  const raw = await adminApiFetch<unknown>("/users", token, {
    method: "GET",
    searchParams: {
      page: query.page,
      limit: query.limit,
      search: query.search?.trim() || undefined,
      role: query.role || undefined,
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    },
  });
  return normalizeApiListResponse<AdminUser>(raw);
}

/** `GET /users/:id` */
export async function getUser(token: string, id: string): Promise<AdminUser> {
  const raw = await adminApiFetch<unknown>(`/users/${encodeURIComponent(id)}`, token, {
    method: "GET",
  });
  return normalizeApiSingleResponse<AdminUser>(raw);
}

/** `POST /users` */
export async function createUser(token: string, body: AdminUserCreateInput): Promise<AdminUser> {
  const raw = await adminApiFetch<unknown>("/users", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<AdminUser>(raw);
}

/** `PATCH /users/:id` */
export async function updateUser(
  token: string,
  id: string,
  body: AdminUserUpdateInput
): Promise<AdminUser> {
  const raw = await adminApiFetch<unknown>(`/users/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<AdminUser>(raw);
}

/** `DELETE /users/:id` */
export async function deleteUser(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/users/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}
