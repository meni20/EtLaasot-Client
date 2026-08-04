import { Suspense, useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu/SideMenu";
import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from "../components/SideMenu/SideMenu.interface";
import {
  DESKTOP_ROUTES,
  MOBILE_ROUTES,
  DESKTOP_ROLE_IDS,
} from "../constants/route.constants";
import { useAuth } from "../contexts/useAuth";
import { LoginPage } from "../pages/Mobile/LoginPage/Login";
import { PasswordChangePage } from "../pages/Mobile/PasswordChangePage/PasswordChange";

const AppRouter: React.FC = () => {
  const { isAuthenticated, loading, user, mustChangePassword } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isPersistentSideMenu = useMediaQuery("(min-width:900px)");
  const desktopSideMenuWidth = menuOpen
    ? DRAWER_WIDTH
    : COLLAPSED_DRAWER_WIDTH;

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
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: "#9a5188" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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
      <Box>
        <Navbar
          title="עת לעשות"
          onMenuClick={() =>
            setMenuOpen((current) =>
              isPersistentSideMenu ? !current : true,
            )
          }
        />
        <SideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          persistent={isPersistentSideMenu}
        />
        <Box
          component="main"
          sx={{
            minWidth: 0,
            width: isPersistentSideMenu
              ? `calc(100% - ${desktopSideMenuWidth}px)`
              : "100%",
            overflowX: "hidden",
            marginRight: isPersistentSideMenu
              ? `${desktopSideMenuWidth}px`
              : 0,
            transition:
              "margin-right 240ms cubic-bezier(0.4, 0, 0.2, 1), width 240ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {filteredDesktopRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    );
  }

  // Volunteer / Trainee → always mobile layout
  return (
    <Box>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          {filteredMobileRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

const RouteLoading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress sx={{ color: "#9a5188" }} />
  </Box>
);

export default AppRouter;
