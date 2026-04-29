"use client";

import Link from "next/link";
import { formatAdminUserRole } from "@/lib/admin-user-labels";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin-user";

function formatCreatedAt(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

type Props = {
  users: AdminUser[];
  currentUserId?: string;
  onDelete: (id: string) => void;
  onToggleActive: (u: AdminUser) => void;
};

export function UsersTable({ users, currentUserId, onDelete, onToggleActive }: Props) {
  if (users.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center text-sm text-zinc-500">
        No hay usuarios con estos criterios.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-3 lg:hidden">
        {users.map((u) => {
          const isSelf = currentUserId != null && u.id === currentUserId;
          return (
            <li
              key={u.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-semibold leading-snug text-zinc-900">{u.name}</p>
                <p className="mt-1 truncate text-xs text-zinc-600" title={u.email}>
                  {u.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-800">
                    {formatAdminUserRole(u.role)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-semibold",
                      u.isActive ? "bg-emerald-50 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                    )}
                  >
                    {u.isActive ? "Activo" : "Inactivo"}
                  </span>
                  <span className="text-zinc-500">{formatCreatedAt(u.createdAt)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
                <Link
                  href={`/admin/users/${u.id}/edit`}
                  className="touch-manipulation rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-800"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => onToggleActive(u)}
                  className="touch-manipulation rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {u.isActive ? "Desactivar" : "Activar"}
                </button>
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => onDelete(u.id)}
                  className="touch-manipulation rounded-lg px-3 py-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/90 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => {
                const isSelf = currentUserId != null && u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-zinc-50/60">
                    <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-zinc-700" title={u.email}>
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {formatAdminUserRole(u.role)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                          u.isActive ? "bg-emerald-50 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                        )}
                      >
                        {u.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                      {formatCreatedAt(u.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/admin/users/${u.id}/edit`}
                          className="text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => onToggleActive(u)}
                          className="text-xs font-semibold text-zinc-600 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {u.isActive ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => onDelete(u.id)}
                          className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
