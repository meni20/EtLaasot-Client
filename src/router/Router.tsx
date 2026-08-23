import { Suspense, useMemo } from "react";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  DESKTOP_ROUTES,
  MOBILE_ROUTES,
  DESKTOP_ROLE_IDS,
} from "../constants/route.constants";
import { useAuth } from "../contexts/useAuth";
import { LoginPage } from "../pages/Mobile/LoginPage/Login";
import { PasswordChangePage } from "../pages/Mobile/PasswordChangePage/PasswordChange";
import { AppShell } from "../components/Shell/AppShell";
import { BottomNav } from "../components/BottomNav/BottomNav";
import { PwaUpdatePrompt } from "../components/PwaUpdatePrompt/PwaUpdatePrompt";

const AppRouter: React.FC = () => {
  const { isAuthenticated, loading, user, mustChangePassword } = useAuth();
  const isMobileViewport = useMediaQuery("(max-width:1023px)");

  // Determine if user is a desktop role (admin) based on their highest-privilege role
  const isDesktopUser = useMemo(() => {
    if (!user?.roles?.length) return false;
    return user.roles.some((r) => DESKTOP_ROLE_IDS.includes(r.roleId));
  }, [user?.roles]);

  // Filter mobile routes by user's role
  const userRoleIds = useMemo(
    () => user?.roles?.map((r) => r.roleId) ?? [],
    [user?.roles],
  );

  const filteredMobileRoutes = useMemo(
    () =>
      MOBILE_ROUTES.filter(
        (route) =>
          !route.allowedRoles ||
          route.allowedRoles.some((id) => userRoleIds.includes(id)),
      ),
    [userRoleIds],
  );

  const filteredDesktopRoutes = useMemo(
    () =>
      DESKTOP_ROUTES.filter(
        (route) =>
          !route.allowedRoles ||
          route.allowedRoles.some((id) => userRoleIds.includes(id)),
      ),
    [userRoleIds],
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100dvh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {isMobileViewport && <PwaUpdatePrompt />}
      </>
    );
  }

  // Admin roles → always desktop layout
  if (mustChangePassword) {
    return (
      <Routes>
        <Route path="/change-password" element={<PasswordChangePage />} />
        <Route path="*" element={<Navigate to="/change-password" replace />} />
      </Routes>
    );
  }

  if (isDesktopUser) {
    return (
      <AppShell>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {filteredDesktopRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    );
  }

  // Volunteer / Trainee → always mobile layout
  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-canvas)",
        paddingBottom: "var(--shell-bottom-inset)",
      }}
    >
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          {filteredMobileRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
      <PwaUpdatePrompt hasBottomNavigation />
    </Box>
  );
};

const RouteLoading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60dvh">
    <CircularProgress color="primary" />
  </Box>
);

export default AppRouter;
