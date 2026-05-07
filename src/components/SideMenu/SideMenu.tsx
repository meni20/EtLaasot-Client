import {
  List,
  Drawer,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { menuItems } from "./SideMenu.constants";
import { useSideMenuStyles } from "./SIdeMenu.styles";
import { type SideMenuProps } from "./SideMenu.interface";

export const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const classes = useSideMenuStyles();
  const { logout } = useAuth();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ className: classes.drawerPaper }}
    >
      
        <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.header}>
  <Typography variant="h6">תפריט</Typography>

  <ListItemButton
    onClick={() => {
      logout();
      navigate("/login");
      onClose();
    }}
  >
    <ListItemText primary="התנתקות" />
  </ListItemButton>

      </Box>



      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            className={classes.listItemButton}
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
        ))}
      </List>
    </Drawer>
  );
};
