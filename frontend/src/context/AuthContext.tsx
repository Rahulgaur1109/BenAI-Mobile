import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { AuthUser, UserRole } from "../types";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AUTH_KEY = "benai-mobile-user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(AUTH_KEY);
        if (value) setUser(JSON.parse(value));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login: async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if (!result.ok) return result;

      const mapped: AuthUser = {
        name: email.split("@")[0],
        email,
        role: "student"
      };
      setUser(mapped);
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(mapped));
      return { ok: true };
    },
    register: async (name: string, email: string, password: string, role: UserRole = "student") => {
      try {
        const result = await registerUser({ name, email, password });
        if (!result.ok) return { ok: false, message: result.message || "Registration failed" };
        const mapped: AuthUser = { name, email, role };
        setUser(mapped);
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(mapped));
        return { ok: true };
      } catch (error: any) {
        return { ok: false, message: error?.message || "Registration failed" };
      }
    },
    logout: async () => {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_KEY);
    }
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
