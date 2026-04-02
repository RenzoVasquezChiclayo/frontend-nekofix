"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/shared/Loader";
import { isAdministrador } from "@/lib/roles";
import { useAdminAuth } from "@/store/admin-auth-context";

type Props = { children: React.ReactNode };

/**
 * Solo renderiza hijos si hay sesión admin con rol ADMINISTRADOR.
 * Redirige a `/admin/login` si no.
 */
export function RequireAdmin({ children }: Props) {
  const router = useRouter();
  const { user, accessToken, isReady } = useAdminAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!accessToken || !user || !isAdministrador(user.role)) {
      router.replace("/admin/login");
    }
  }, [isReady, accessToken, user, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <Loader label="Verificando sesión…" />
      </div>
    );
  }

  if (!accessToken || !user || !isAdministrador(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <Loader label="Redirigiendo al login…" />
      </div>
    );
  }

  return <>{children}</>;
}
