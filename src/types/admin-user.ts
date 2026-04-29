/**
 * Usuario del panel (gestión vía API `/users`).
 * El campo `role` debe alinearse con los enum del backend.
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUserCreateInput {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

export interface AdminUserUpdateInput {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}
