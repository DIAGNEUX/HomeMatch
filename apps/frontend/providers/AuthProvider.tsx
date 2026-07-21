"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import authService from "@/services/auth.service";
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

  /**
   * Connexion
   */
  const login = (token: string, user: User) => {
    localStorage.setItem("access_token", token);
    setUser(user);
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  /**
   * Restaurer la session au démarrage
   */
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();

        setUser(response.data);
      } catch (error) {
        console.error("Impossible de restaurer la session :", error);

        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * On attend que la session soit restaurée
   */
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}