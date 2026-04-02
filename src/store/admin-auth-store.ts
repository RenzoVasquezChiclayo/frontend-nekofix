import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADMIN_AUTH_STORAGE } from "@/lib/admin-auth-storage";
import { getApiErrorMessage } from "@/lib/api-errors";
import { isAdministrador } from "@/lib/roles";
import { ApiError } from "@/services/api";
import { adminLogin, getAdminProfile } from "@/services/auth.service";
import type { AuthUser, LoginPayload } from "@/types/auth";

type AdminAuthState = {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  bootstrap: () => Promise<void>;
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isReady: false,

      login: async (payload: LoginPayload) => {
        try {
          const res = await adminLogin(payload);
          if (!isAdministrador(res.user.role)) {
            throw new Error("Tu cuenta no tiene permisos de administrador.");
          }
          set({ token: res.accessToken, user: res.user });
          try {
            localStorage.removeItem(ADMIN_AUTH_STORAGE.token);
            localStorage.removeItem(ADMIN_AUTH_STORAGE.user);
          } catch {
            /* ignore */
          }
        } catch (e) {
          throw new Error(getApiErrorMessage(e));
        }
      },

      logout: () => {
        set({ token: null, user: null });
        try {
          localStorage.removeItem(ADMIN_AUTH_STORAGE.token);
          localStorage.removeItem(ADMIN_AUTH_STORAGE.user);
        } catch {
          /* ignore */
        }
      },

      bootstrap: async () => {
        let token = get().token;
        let user = get().user;

        if (typeof window !== "undefined" && !token) {
          try {
            const legacyT = localStorage.getItem(ADMIN_AUTH_STORAGE.token);
            const legacyU = localStorage.getItem(ADMIN_AUTH_STORAGE.user);
            if (legacyT && legacyU) {
              const parsed = JSON.parse(legacyU) as AuthUser;
              if (isAdministrador(parsed.role)) {
                token = legacyT;
                user = parsed;
                set({ token: legacyT, user: parsed });
              }
            }
          } catch {
            /* ignore */
          }
        }

        if (!token) {
          set({ isReady: true });
          return;
        }

        if (user && !isAdministrador(user.role)) {
          get().logout();
          set({ isReady: true });
          return;
        }

        try {
          const fresh = await getAdminProfile(token);
          if (!isAdministrador(fresh.role)) {
            get().logout();
          } else {
            set({ user: fresh });
          }
        } catch (e) {
          if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
            get().logout();
          } else if (user && isAdministrador(user.role)) {
            set({ user });
          } else {
            get().logout();
          }
        } finally {
          set({ isReady: true });
        }
      },
    }),
    {
      name: "nekofix-admin-auth",
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
