import React from "react";
import SideMenuIcon from "../../icons/SideMenuIcon";
import type { NavbarProps } from "./Navbar.interface";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
        >
          {title}
        </Typography>

        <Box sx={{ cursor: "pointer" }} onClick={onMenuClick}>
          <SideMenuIcon />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}></Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
