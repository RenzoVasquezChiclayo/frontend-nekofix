"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useAdminAuth } from "@/store/admin-auth-context";

/**
 * Login del panel. Usa `POST /auth/login` (ver contrato en `types/auth.ts`).
 */
export function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
    >
      <div>
        <label htmlFor="admin-email" className="text-sm font-medium text-zinc-700">
          Correo
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60"
          placeholder="admin@nekofix.com"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium text-zinc-700">
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary-800 py-3 text-sm font-semibold text-white transition hover:bg-primary-900 disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar al panel"}
      </button>
      <p className="text-center text-xs text-zinc-500">
        <Link href="/" className="text-primary-700 hover:underline">
          Volver a {SITE_NAME}
        </Link>
      </p>
    </form>
  );
}
