"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/store/admin-auth-store";
import type { LoginPayload } from "@/types/auth";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const run = () => void useAdminAuthStore.getState().bootstrap();

    if (useAdminAuthStore.persist.hasHydrated()) {
      run();
      return;
    }
    return useAdminAuthStore.persist.onFinishHydration(run);
  }, []);

  return <>{children}</>;
}

export function useAdminAuth() {
  const token = useAdminAuthStore((s) => s.token);
  const user = useAdminAuthStore((s) => s.user);
  const isReady = useAdminAuthStore((s) => s.isReady);
  const login = useAdminAuthStore((s) => s.login);
  const logout = useAdminAuthStore((s) => s.logout);

  return {
    user,
    accessToken: token,
    isReady,
    login,
    logout,
  };
}
