import {
  List,
  Drawer,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./SideMenu.constants";
import { DRAWER_WIDTH, type SideMenuProps } from "./SideMenu.interface";

export const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
        },
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Menu
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
