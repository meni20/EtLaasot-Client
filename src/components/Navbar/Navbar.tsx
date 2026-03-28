import React from "react";
import SideMenuIcon from "../../icons/SideMenuIcon";
import type { NavbarProps } from "./Navbar.interface";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavbarStyles } from "./Navbar.styles";
import { BranchSelector } from "../BranchSelector/BranchSelector";
import { useAuth } from "../../contexts/useAuth";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const classes = useNavbarStyles();
  const { user } = useAuth();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.menuIconBox} onClick={onMenuClick}>
          <SideMenuIcon />
        </Box>
        <Typography variant="h5" component="div" className={classes.title}>
          {title}
        </Typography>
        <Box className={classes.userInfo}>
          <Typography className={classes.userName}>{user?.name}</Typography>
          <Typography className={classes.userTz}>ת.ז. {user?.userId}</Typography>
        </Box>
        <BranchSelector />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
