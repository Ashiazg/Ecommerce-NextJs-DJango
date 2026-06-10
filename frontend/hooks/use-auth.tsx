"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { login, register, getMe, type User, type LoginInput, type RegisterInput } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem("access_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginFn = async (input: LoginInput) => {
    const tokens = await login(input);
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    const me = await getMe();
    setUser(me);
  };

  const registerFn = async (input: RegisterInput) => {
    await register(input);
    await loginFn({ username: input.username, password: input.password });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login: loginFn, register: registerFn, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
