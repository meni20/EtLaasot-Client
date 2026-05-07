import { useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Box, CircularProgress } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { NavbarMobile } from "../components/NavbarMobile/NavbarMobile";
import {
  DESKTOP_ROUTES,
  MOBILE_ROUTES,
  DESKTOP_ROLE_IDS,
} from "../constants/route.constants";
import { useAuth } from "../contexts/useAuth";
import { LoginPage } from "../pages/Mobile/LoginPage/Login";

const AppRouter: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
  if (isDesktopUser) {
    return (
      <Box>
        <Navbar title="עת לעשות" onMenuClick={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <Routes>
          {DESKTOP_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    );
  }

  // Volunteer / Trainee → always mobile layout
  return (
    <Box>
      <NavbarMobile />
      <Routes>
        {filteredMobileRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

export default AppRouter;
