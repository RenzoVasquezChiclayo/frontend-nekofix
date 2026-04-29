"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader } from "@/components/shared/Loader";
import { isSuperAdmin } from "@/lib/roles";
import { notifyWarning } from "@/lib/toast";
import { useAdminAuth } from "@/store/admin-auth-context";

type Props = { children: React.ReactNode };

/**
 * Solo renderiza hijos si el usuario autenticado es `SUPER_ADMIN`.
 * El panel base ya exige sesión admin vía `RequireAdmin`.
 */
export function RequireSuperAdmin({ children }: Props) {
  const router = useRouter();
  const { user, isReady } = useAdminAuth();
  const warned = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    if (!isSuperAdmin(user?.role)) {
      if (!warned.current) {
        warned.current = true;
        notifyWarning("No tienes permiso para acceder a esta sección.");
      }
      router.replace("/admin/dashboard");
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-zinc-50/50">
        <Loader label="Verificando permisos…" />
      </div>
    );
  }

  if (!isSuperAdmin(user?.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-zinc-50/50">
        <Loader label="Redirigiendo…" />
      </div>
    );
  }

  return <>{children}</>;
}
