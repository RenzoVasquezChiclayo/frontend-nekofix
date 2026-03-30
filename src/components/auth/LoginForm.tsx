"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-context";
import { AuthCard } from "@/components/auth/AuthCard";

export function LoginForm() {
  const router = useRouter();
  const { login, isReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Accede con tu cuenta de cliente"
      footer={
        <p className="text-center text-sm text-zinc-600">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-emerald-700 hover:underline">
            Regístrate
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Correo electrónico</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || !isReady}
          className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
        <p className="text-center text-xs text-zinc-500">
          El inicio de sesión usa el API NestJS (`/auth/login`). Configura{" "}
          <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_API_URL</code> y CORS.
        </p>
      </form>
    </AuthCard>
  );
}
