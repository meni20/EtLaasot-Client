import { useState } from "react";
import {
  AppBar,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import SideMenuIcon from "../../icons/SideMenuIcon";
import { AdminActionSearch } from "../AdminActionSearch/AdminActionSearch";
import type { AdminDialogActionId } from "../AdminActionSearch/adminActionSearch.types";
import { ChangePasswordDialog } from "../AccountSettings/ChangePasswordDialog";
import { PersonalDetailsDialog } from "../AccountSettings/PersonalDetailsDialog";
import { useAuth } from "../../contexts/useAuth";
import type { NavbarProps } from "./Navbar.interface";
import { useNavbarStyles } from "./Navbar.styles";

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title, menuOpen }) => {
  const classes = useNavbarStyles();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const openAccountDialog = (dialog: AdminDialogActionId) => {
    if (dialog === "personal-details") {
      setIsProfileDialogOpen(true);
      return;
    }

    setIsPasswordDialogOpen(true);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} component="header">
        <Toolbar className={classes.toolbar} aria-label="סרגל ניווט עליון">
          <Box className={classes.navActions}>
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
            <Tooltip title={menuOpen ? "צמצום תפריט" : "פתיחת תפריט"}>
              <IconButton
                className={classes.menuIconBox}
                onClick={onMenuClick}
                aria-label={menuOpen ? "צמצום תפריט" : "פתיחת תפריט"}
                aria-controls="app-side-menu"
                aria-expanded={menuOpen ?? false}
                size="small"
              >
                <SideMenuIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className={classes.adminSearchSlot}>
            <AdminActionSearch onOpenDialog={openAccountDialog} />
          </Box>
          <Box className={classes.navbarLogoSlot} aria-label={title}>
            <Box
              component="img"
              src="/et-laasot-bat-yam-logo.png"
              alt="עת לעשות בת ים"
              className={classes.navbarLogo}
            />
          </Box>
          <Tooltip title="הפרטים שלי">
            <ButtonBase
              className={classes.userInfo}
              onClick={() => setIsProfileDialogOpen(true)}
              aria-label="פתיחת הפרטים שלי"
              aria-haspopup="dialog"
              aria-expanded={isProfileDialogOpen}
            >
              <Box className={classes.userAvatar} aria-hidden="true">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </Box>
              <Typography className={classes.userName}>{user?.name}</Typography>
            </ButtonBase>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <PersonalDetailsDialog
        open={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </>
  );
};

export default Navbar;
