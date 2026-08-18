import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import authService from "../services/auth.service";
import { AuthContext, type IAuthContext } from "./useAuth";
import {
  clearToken,
  getToken,
  setToken as persistToken,
} from "../config/tokenStore";

type AuthUser = NonNullable<IAuthContext["user"]>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    authService
      .getMe()
      .then((data) => {
        if (!mounted) return;
        setUser(data);
        setToken((currentToken) => currentToken ?? "cookie");
      })
      .catch(() => {
        if (!mounted) return;
        clearToken();
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearToken();
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const data = await authService.login(identifier, password);
      const accessToken =
        typeof data?.token === "string" && data.token ? data.token : null;

      if (accessToken) {
        persistToken(accessToken);
        setToken(accessToken);
      }

      setLoading(true);
      const currentUser = await authService.getMe();
      setUser(currentUser);
      setToken((currentToken) => currentToken ?? "cookie");
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      await authService.changePassword(payload);
      const currentUser = await authService.getMe();
      setUser(currentUser);
      setToken((currentToken) => currentToken ?? getToken() ?? "cookie");
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout().catch(() => undefined);
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const isSuperAdmin =
    user?.roles?.some((r) => r.role === "SUPER_ADMIN") ?? false;

  return (
    <AuthContext.Provider
      value={{
                user,
        token,
        isAuthenticated: !!token && !!user,
        mustChangePassword: Boolean(user?.mustChangePassword),
        loading,
        login,
        changePassword,
        logout,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
