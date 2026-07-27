"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import authService from "@/services/auth.service";
import adminAuthService from "@/services/admin-auth.service";
import { AuthContextType, User } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = (user: User) => {
    localStorage.removeItem("access_token");
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const response = await authService.me();
    setUser(response.data);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authService.me({ skipAuthRedirect: true });
        setUser(response.data);
      } catch {
        try {
          const response = await adminAuthService.me({
            skipAuthRedirect: true,
          });
          setUser(response.data);
        } catch {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
