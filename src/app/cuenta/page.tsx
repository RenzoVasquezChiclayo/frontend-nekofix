"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth-context";
import { Loader } from "@/components/shared/Loader";

export default function CuentaPage() {
  const { user, isReady, logout } = useAuth();

  if (!isReady) {
    return <Loader label="Cargando sesión…" />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">Mi cuenta</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Inicia sesión para ver tus datos y pedidos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/iniciar-sesion"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Registrarse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Mi cuenta</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Sesión iniciada como cliente. Aquí podrás enlazar pedidos y direcciones cuando el
        backend esté conectado.
      </p>
      <dl className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Nombre
          </dt>
          <dd className="mt-1 text-zinc-900">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Correo
          </dt>
          <dd className="mt-1 text-zinc-900">{user.email}</dd>
        </div>
        {user.phone ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Teléfono
            </dt>
            <dd className="mt-1 text-zinc-900">{user.phone}</dd>
          </div>
        ) : null}
      </dl>
      <button
        type="button"
        onClick={() => logout()}
        className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 hover:bg-red-100"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
