import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import type { NavbarProps } from "./Navbar.interface";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import SideMenuIcon from "../../icons/SideMenuIcon";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title || "My App"}
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
