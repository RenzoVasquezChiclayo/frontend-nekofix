"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STORAGE } from "@/lib/auth-storage";
import { getApiErrorMessage } from "@/lib/api-errors";
import { login as loginRequest, register as registerRequest } from "@/services/auth.service";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  /** Hidrata desde localStorage en el cliente */
  isReady: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_STORAGE.token);
      const raw = localStorage.getItem(AUTH_STORAGE.user);
      if (token && raw) {
        // Hidratación desde localStorage tras el primer paint (evita mismatch SSR/cliente)
        queueMicrotask(() => {
          setAccessToken(token);
          setUser(JSON.parse(raw) as AuthUser);
        });
      }
    } catch {
      /* ignore */
    }
    queueMicrotask(() => setIsReady(true));
  }, []);

  const persist = useCallback((token: string, nextUser: AuthUser) => {
    setAccessToken(token);
    setUser(nextUser);
    try {
      localStorage.setItem(AUTH_STORAGE.token, token);
      localStorage.setItem(AUTH_STORAGE.user, JSON.stringify(nextUser));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE.token);
      localStorage.removeItem(AUTH_STORAGE.user);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const res = await loginRequest(payload);
        persist(res.accessToken, res.user);
      } catch (e) {
        throw new Error(getApiErrorMessage(e));
      }
    },
    [persist]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const res = await registerRequest(payload);
        persist(res.accessToken, res.user);
      } catch (e) {
        throw new Error(getApiErrorMessage(e));
      }
    },
    [persist]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isReady,
      login,
      register,
      logout,
    }),
    [user, accessToken, isReady, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
