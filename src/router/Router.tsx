import { useState, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useIsMobile } from "../hooks/window.hook";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { NavbarMobile } from "../components/NavbarMobile/NavbarMobile";
import { DESKTOP_ROUTES, MOBILE_ROUTES } from "../constants/route.constants";
import MobileSideMenu from "../components/SideMenu/MobileSideMenu";
import { isAuthenticated } from "../constants/auth.const";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LoginPage: React.FC = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      px: 3,
      textAlign: "center",
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      Login Required
    </Typography>
    <Typography color="text.secondary">
      Please sign in to access the Et La&apos;asot management system.
    </Typography>
  </Box>
);

const AppRouter: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const routes = isMobile ? MOBILE_ROUTES : DESKTOP_ROUTES;
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box>
      {isMobile ? (
        <Box>
          <NavbarMobile />
          <Routes>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
              />
            ))}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>

          <MobileSideMenu />
        </Box>
      ) : (
        <Box>
          <Navbar title="׳¢׳× ׳׳¢׳©׳•׳×" onMenuClick={() => setMenuOpen(true)} />
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          <Routes>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
              />
            ))}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Box>
      )}
    </Box>
  );
};

export default AppRouter;
