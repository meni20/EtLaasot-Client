import React from "react";
import SideMenuIcon from "../../icons/SideMenuIcon";
import type { NavbarProps } from "./Navbar.interface";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavbarStyles } from "./Navbar.styles";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const classes = useNavbarStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.menuIconBox} onClick={onMenuClick}>
          <SideMenuIcon />
        </Box>
        <Typography variant="h5" component="div" className={classes.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
