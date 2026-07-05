import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import authService from "../services/auth.service";
import { AuthContext } from "./useAuth";
import type { IAuthContext } from "./useAuth";

type AuthUser = NonNullable<IAuthContext["user"]>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    authService
      .getMe()
      .then((data) => {
        if (!mounted) return;
        setUser(data);
        setToken("cookie");
      })
      .catch(() => {
        if (!mounted) return;
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
      await authService.login(identifier, password);
      setLoading(true);
      const currentUser = await authService.getMe();
      setUser(currentUser);
      setToken("cookie");
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
      setToken("cookie");
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout().catch(() => undefined);
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
