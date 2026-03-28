import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useIsMobile } from "../hooks/window.hook";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { NavbarMobile } from "../components/NavbarMobile/NavbarMobile";
import { DESKTOP_ROUTES, MOBILE_ROUTES } from "../constants/route.constants";
import { useAuth } from "../contexts/useAuth";
import { LoginPage } from "../pages/Mobile/LoginPage/Login";

const AppRouter: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
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

  return (
    <Box>
      {isMobile ? (
        <Box>
          <NavbarMobile />
          <Routes>
            {MOBILE_ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      ) : (
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
      )}
    </Box>
  );
};

export default AppRouter;
