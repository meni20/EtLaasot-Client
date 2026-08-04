import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "./SideMenu.constants";
import { useSideMenuStyles } from "./SIdeMenu.styles";
import { type SideMenuProps } from "./SideMenu.interface";
import { useAuth } from "../../contexts/useAuth";

export const SideMenu: React.FC<SideMenuProps> = ({
  open,
  onClose,
  persistent = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useSideMenuStyles();
  const { user } = useAuth();
  const collapsed = persistent && !open;
  const drawerOpen = persistent || open;
  const userRoleIds = user?.roles?.map((role) => role.roleId) ?? [];
  const visibleMenuItems = menuItems.filter(
    (item) =>
      !item.allowedRoles ||
      item.allowedRoles.some((roleId) => userRoleIds.includes(roleId)),
  );

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={onClose}
      variant={persistent ? "persistent" : "temporary"}
      PaperProps={{
        className: `${classes.drawerPaper} ${
          collapsed ? classes.collapsedDrawerPaper : ""
        }`,
        sx: { right: 0, left: "auto" },
      }}
      SlideProps={{ direction: "left" }}
      ModalProps={{ keepMounted: true }}
    >
      <List
        className={`${classes.list} ${collapsed ? classes.collapsedList : ""}`}
      >
        {visibleMenuItems.map((item) => {
          const isActive = isActiveRoute(item.path);

          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ""}
              placement="left"
            >
            <ListItemButton
              className={`${classes.listItemButton} ${
                isActive ? classes.activeListItem : ""
              } ${collapsed ? classes.collapsedListItemButton : ""}`}
              selected={isActive}
              aria-label={item.label}
              onClick={() => {
                navigate(item.path);
                if (!persistent) {
                  onClose();
                }
              }}
            >
              <ListItemIcon
                className={`${classes.listItemIcon} ${
                  collapsed ? classes.collapsedListItemIcon : ""
                }`}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={`${classes.listItemText} ${
                  collapsed ? classes.collapsedListItemText : ""
                }`}
              />
            </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
};
