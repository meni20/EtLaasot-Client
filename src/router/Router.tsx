import { Route, Routes } from "react-router-dom";
import { ALL_ROUTES } from "../constants/route.constants";
import { Box } from "@mui/material";
import { SideMenu } from "../components/SideMenu/SideMenu";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";

const AppRouter: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Box>
      <Navbar title="Et Laasot" onMenuClick={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Routes>
        {ALL_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Box>
  );
};

export default AppRouter;
