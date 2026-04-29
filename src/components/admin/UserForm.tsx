"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import {
  isSuperAdmin,
  normalizeKnownUserRole,
  ROLE_ADMINISTRADOR,
  ROLE_CLIENT,
  ROLE_SUPER_ADMIN,
} from "@/lib/roles";
import { notifyApiError, notifySuccess, notifyWarning } from "@/lib/toast";
import { createUser, getUser, updateUser } from "@/services/admin/user.service";
import { ApiError } from "@/services/api";
import { useAdminAuth } from "@/store/admin-auth-context";
import { Loader } from "@/components/shared/Loader";

type Props = { userId?: string };

const ROLE_OPTIONS = [
  { value: ROLE_SUPER_ADMIN, label: "Super administrador" },
  { value: ROLE_ADMINISTRADOR, label: "Administrador" },
  { value: ROLE_CLIENT, label: "Cliente" },
] as const;

type LoadPhase = "idle" | "loading" | "ready" | "not_found" | "error";

export function UserForm({ userId }: Props) {
  const router = useRouter();
  const { accessToken, user: authUser } = useAdminAuth();
  const isEdit = Boolean(userId);

  const [phase, setPhase] = useState<LoadPhase>(() => (isEdit ? "loading" : "ready"));
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>(ROLE_ADMINISTRADOR);
  const [isActive, setIsActive] = useState(true);

  const canAssignSuperAdmin = isSuperAdmin(authUser?.role);

  const roleChoices = useMemo(() => {
    if (canAssignSuperAdmin) return [...ROLE_OPTIONS];
    return ROLE_OPTIONS.filter((o) => o.value !== ROLE_SUPER_ADMIN);
  }, [canAssignSuperAdmin]);

  useEffect(() => {
    if (canAssignSuperAdmin) return;
    if (role === ROLE_SUPER_ADMIN) setRole(ROLE_ADMINISTRADOR);
  }, [canAssignSuperAdmin, role]);

  const loadUser = useCallback(async () => {
    if (!isEdit || !userId || !accessToken) return;
    setPhase("loading");
    setError(null);
    try {
      const u = await getUser(accessToken, userId);
      setName(u.name);
      setEmail(u.email);
      setRole(normalizeKnownUserRole(u.role) ?? u.role.trim());
      setIsActive(u.isActive);
      setPassword("");
      setPhase("ready");
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setPhase("not_found");
        return;
      }
      setError(getApiErrorMessage(e));
      notifyApiError(e);
      setPhase("error");
    }
  }, [isEdit, userId, accessToken]);

  useEffect(() => {
    if (!isEdit) {
      setPhase("ready");
      return;
    }
    void loadUser();
  }, [isEdit, loadUser, loadAttempt]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;

    if (!canAssignSuperAdmin && role === ROLE_SUPER_ADMIN) {
      const msg = "No tienes permiso para asignar el rol super administrador.";
      setError(msg);
      notifyWarning(msg);
      return;
    }

    if (!isEdit && password.trim().length < 6) {
      const msg = "La contraseña debe tener al menos 6 caracteres.";
      setError(msg);
      notifyWarning(msg);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (isEdit && userId) {
        await updateUser(accessToken, userId, {
          name: name.trim(),
          email: email.trim(),
          role,
          isActive,
        });
        notifySuccess("Usuario actualizado correctamente");
      } else {
        await createUser(accessToken, {
          name: name.trim(),
          email: email.trim(),
          password: password,
          role,
          isActive,
        });
        notifySuccess("Usuario creado correctamente");
      }
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && phase === "loading") {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
        <Loader label="Cargando usuario…" />
      </div>
    );
  }

  if (isEdit && phase === "not_found") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-base font-medium text-zinc-900">Usuario no encontrado</p>
        <p className="mt-2 text-sm text-zinc-500">Comprueba el enlace o vuelve al listado.</p>
        <button
          type="button"
          onClick={() => router.replace("/admin/users")}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  if (isEdit && phase === "error") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50/80 p-8 shadow-sm">
        <p className="text-sm font-medium text-red-900">No se pudo cargar el usuario</p>
        {error ? <p className="mt-2 text-sm text-red-800">{error}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setLoadAttempt((n) => n + 1)}
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => router.replace("/admin/users")}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const input =
    "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Datos</h2>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Nombre</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
        </label>
        {!isEdit ? (
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Contraseña</span>
            <input
              required
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
            <p className="mt-1 text-xs text-zinc-500">Mínimo 6 caracteres.</p>
          </label>
        ) : null}
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Rol</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={input}>
            {roleChoices.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-zinc-300 accent-primary-600"
          />
          Cuenta activa
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear usuario"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
