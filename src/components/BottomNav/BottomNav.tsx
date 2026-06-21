import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import { useStyles } from "./BottomNav.styles";
import { useAuth } from "../../contexts/useAuth";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  allowedRoles?: number[];
}

const allNavItems: NavItem[] = [
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  { label: "אירועים", icon: <EventIcon />, path: "/events" },
];

export const BottomNav: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRoleIds = useMemo(
    () => user?.roles?.map((role) => role.roleId) ?? [],
    [user?.roles],
  );

  const navItems = useMemo(
    () =>
      allNavItems.filter(
        (item) =>
          !item.allowedRoles ||
          item.allowedRoles.some((roleId) => userRoleIds.includes(roleId)),
      ),
    [userRoleIds],
  );

  const currentIndex = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <BottomNavigation
      className={styles.root}
      value={currentIndex === -1 ? 0 : currentIndex}
      onChange={(_, newValue) => navigate(navItems[newValue].path)}
      showLabels
    >
      {navItems.map((item) => (
        <BottomNavigationAction
          key={item.path}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </BottomNavigation>
  );
};
