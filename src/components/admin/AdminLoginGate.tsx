"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/shared/Loader";
import { isAdministrador } from "@/lib/roles";
import { useAdminAuth } from "@/store/admin-auth-context";

type Props = { children: React.ReactNode };

/** Si ya hay sesión admin válida, envía al dashboard. */
export function AdminLoginGate({ children }: Props) {
  const router = useRouter();
  const { user, accessToken, isReady } = useAdminAuth();

  useEffect(() => {
    if (!isReady) return;
    if (accessToken && user && isAdministrador(user.role)) {
      router.replace("/admin/dashboard");
    }
  }, [isReady, accessToken, user, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Cargando…" />
      </div>
    );
  }

  if (accessToken && user && isAdministrador(user.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Entrando al panel…" />
      </div>
    );
  }

  return <>{children}</>;
}
