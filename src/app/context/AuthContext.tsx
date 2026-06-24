"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "@/types/api";
import { apiFetch } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("kenjutsu_token");
      const u = localStorage.getItem("kenjutsu_user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {
      // localStorage not available (SSR guard)
    }
  }, []);

  const login = useCallback((t: string, u: AuthUser) => {
    setToken(t);
    setUser(u);
    try {
      localStorage.setItem("kenjutsu_token", t);
      localStorage.setItem("kenjutsu_user", JSON.stringify(u));
    } catch {}
  }, []);

  const logout = useCallback(() => {
    const t = token;
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("kenjutsu_token");
      localStorage.removeItem("kenjutsu_user");
    } catch {}
    // fire-and-forget logout call
    if (t) {
      apiFetch("/admin/logout", "fa", { method: "POST" }, t).catch(() => {});
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
