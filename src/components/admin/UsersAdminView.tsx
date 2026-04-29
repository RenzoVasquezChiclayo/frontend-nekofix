"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { getApiErrorMessage } from "@/lib/api-errors";
import { ROLE_ADMINISTRADOR, ROLE_CLIENT, ROLE_SUPER_ADMIN } from "@/lib/roles";
import { notifyApiError, notifySuccess, notifyWarning } from "@/lib/toast";
import {
  deleteUser,
  getUsers,
  updateUser,
  type AdminUserListQuery,
} from "@/services/admin/user.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Pagination } from "@/components/admin/Pagination";
import { UsersTable } from "@/components/admin/UsersTable";
import { Loader } from "@/components/shared/Loader";
import type { PaginationMeta } from "@/types/api";
import type { AdminUser } from "@/types/admin-user";

const PAGE_SIZE = 15;
const SEARCH_DEBOUNCE_MS = 300;

const ROLE_FILTER_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: ROLE_SUPER_ADMIN, label: "Super administrador" },
  { value: ROLE_ADMINISTRADOR, label: "Administrador" },
  { value: ROLE_CLIENT, label: "Cliente" },
] as const;

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
] as const;

export function UsersAdminView() {
  const { accessToken, user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [listMeta, setListMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const q: AdminUserListQuery = {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter === "" ? undefined : statusFilter === "true",
      };
      const res = await getUsers(accessToken, q);
      setRows(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
      setRows([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    if (user?.id === deleteId) {
      notifyWarning("No puedes eliminar tu propia cuenta.");
      setDeleteId(null);
      return;
    }
    setDeleting(true);
    try {
      await deleteUser(accessToken, deleteId);
      setDeleteId(null);
      notifySuccess("Usuario eliminado correctamente");
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(u: AdminUser) {
    if (!accessToken) return;
    if (user?.id === u.id) {
      notifyWarning("No puedes cambiar el estado de tu propia cuenta desde aquí.");
      return;
    }
    try {
      await updateUser(accessToken, u.id, { isActive: !u.isActive });
      notifySuccess(u.isActive ? "Usuario desactivado" : "Usuario activado");
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
    }
  }

  function requestDelete(id: string) {
    if (user?.id === id) {
      notifyWarning("No puedes eliminar tu propia cuenta.");
      return;
    }
    setDeleteId(id);
  }

  return (
    <>
      <AdminHeader
        title="Usuarios"
        description="Gestión de cuentas del panel. Solo super administradores."
        actions={
          <Link
            href="/admin/users/new"
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Nuevo usuario
          </Link>
        }
      />
      <div className="space-y-6 p-4 sm:p-6">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end">
          <label className="min-w-[200px] flex-1">
            <span className="text-xs font-medium text-zinc-500">Buscar</span>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nombre o email"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
          <label className="min-w-[200px]">
            <span className="text-xs font-medium text-zinc-500">Rol</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setPage(1);
                setRoleFilter(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              {ROLE_FILTER_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[160px]">
            <span className="text-xs font-medium text-zinc-500">Estado</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value as "" | "true" | "false");
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              {STATUS_FILTER_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
            <Loader label="Cargando usuarios…" />
          </div>
        ) : (
          <>
            <UsersTable
              users={rows}
              currentUserId={user?.id}
              onDelete={requestDelete}
              onToggleActive={handleToggleActive}
            />
            <Pagination meta={listMeta} onPageChange={(p) => setPage(p)} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Eliminar usuario"
        description="Esta acción no se puede deshacer. ¿Continuar?"
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
