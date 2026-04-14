import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import authService from "../services/auth.service";
import { AuthContext } from "./useAuth";
import type { IAuthContext } from "./useAuth";

type AuthUser = NonNullable<IAuthContext["user"]>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState<boolean>(
    () => !!localStorage.getItem("token"),
  );

  useEffect(() => {
    if (token) {
      setLoading(true);
      authService
        .getMe(token)
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (userId: string, captchaToken: string) => {
  const data = await authService.login(userId, captchaToken);
  const accessToken = data.token;
  localStorage.setItem("token", accessToken);
  setLoading(true);
  setToken(accessToken);
}, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
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
        loading,
        login,
        logout,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
