import {
  List,
  Drawer,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { menuItems } from "./SideMenu.constants";
import { useSideMenuStyles } from "./SIdeMenu.styles";
import { type SideMenuProps } from "./SideMenu.interface";

export const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useSideMenuStyles();
  const { logout } = useAuth();

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ className: classes.drawerPaper }}
    >
      <Box className={classes.header}>
        <Box>
          <Typography variant="h6" className={classes.headerTitle}>
            תפריט
          </Typography>
          <Typography className={classes.headerSubtitle}>
            ניהול סניף
          </Typography>
        </Box>

        <ListItemButton
          className={classes.logoutButton}
          onClick={() => {
            logout();
            navigate("/login");
            onClose();
          }}
        >
          <ListItemText primary="התנתקות" />
        </ListItemButton>
      </Box>

      <List className={classes.list}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);

          return (
            <ListItemButton
              key={item.path}
              className={`${classes.listItemButton} ${
                isActive ? classes.activeListItem : ""
              }`}
              selected={isActive}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={classes.listItemText}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};
