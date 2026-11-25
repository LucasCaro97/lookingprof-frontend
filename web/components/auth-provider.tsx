"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearToken, getStoredToken, sessionFromToken, storeToken } from "@/lib/auth";
import { login as loginRequest, register as registerRequest } from "@/lib/api";
import type { Session } from "@/lib/types";

type RegisterInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "USER" | "PROFESSIONAL";
  provinceId: number;
  cityId: number;
};

type AuthContextValue = {
  session: Session | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<Session>;
  register: (input: RegisterInput) => Promise<Session>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    setSession(token ? sessionFromToken(token) : null);
    setReady(true);
  }, []);

  const applyToken = useCallback((token: string) => {
    storeToken(token);
    const next = sessionFromToken(token);
    setSession(next);
    if (!next) throw new Error("Token inválido");
    return next;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token } = await loginRequest(email, password);
      return applyToken(token);
    },
    [applyToken],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const { token } = await registerRequest(input);
      return applyToken(token);
    },
    [applyToken],
  );

  const logout = useCallback(() => {
    clearToken();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, login, register, logout }),
    [session, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
