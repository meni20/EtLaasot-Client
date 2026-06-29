import React from "react";
import SideMenuIcon from "../../icons/SideMenuIcon";
import type { NavbarProps } from "./Navbar.interface";
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import { useNavbarStyles } from "./Navbar.styles";
import { BranchSelector } from "../BranchSelector/BranchSelector";
import { useAuth } from "../../contexts/useAuth";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const classes = useNavbarStyles();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.navActions}>
          <Box className={classes.menuIconBox} onClick={onMenuClick}>
            <SideMenuIcon />
          </Box>
          <Tooltip title="חזרה לבית">
            <IconButton
              className={classes.homeButton}
              onClick={() => navigate("/dashboard")}
              aria-label="חזרה לבית"
              size="small"
            >
              <HomeRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h5" component="div" className={classes.title}>
          {title}
        </Typography>
        <Box className={classes.userInfo}>
          <Typography className={classes.userName}>{user?.name}</Typography>
          {user?.nationalIdMasked && (
            <Typography className={classes.userTz}>
              ת.ז. {user.nationalIdMasked}
            </Typography>
          )}
        </Box>
        <BranchSelector />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
