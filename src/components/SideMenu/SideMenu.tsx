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
import { useSideMenuStyles } from "./SIdeMenu.styles";
import { type SideMenuProps } from "./SideMenu.interface";

export const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const classes = useSideMenuStyles();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ className: classes.drawerPaper }}
    >
      <Typography variant="h6" className={classes.header}>
        Menu
      </Typography>

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
