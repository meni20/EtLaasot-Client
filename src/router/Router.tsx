import { useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useIsMobile } from "../hooks/window.hook";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { NavbarMobile } from "../components/NavbarMobile/NavbarMobile";
import { DESKTOP_ROUTES, MOBILE_ROUTES } from "../constants/route.constants";
import MobileSideMenu from "../components/SideMenu/MobileSideMenu";

const AppRouter: React.FC = () => {
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Box>
      {isMobile ? (
        <Box>
          <NavbarMobile />
          <Routes>
            {MOBILE_ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>

          <MobileSideMenu />
        </Box>
      ) : (
        <Box>
          <Navbar title="עת לעשות" onMenuClick={() => setMenuOpen(true)} />
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          <Routes>
            {DESKTOP_ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Box>
      )}
    </Box>
  );
};

export default AppRouter;
