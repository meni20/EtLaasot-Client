import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { useStyles } from "./BottomNav.styles";
import { useAuth } from "../../contexts/useAuth";
import { AUTH_ROLES } from "../../constants/auth.const";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  /** If set, only these roleIds see this tab */
  allowedRoles?: number[];
}

const allNavItems: NavItem[] = [
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  { label: "אירועים", icon: <EventIcon />, path: "/events" },
  {
    label: "החניכים שלי",
    icon: <PeopleIcon />,
    path: "/trainees",
    allowedRoles: [AUTH_ROLES.VOLUNTEER.id],
  },
  { label: "פרופיל", icon: <PersonIcon />, path: "/profile" },
];

export const BottomNav: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRoleIds = useMemo(
    () => user?.roles?.map((r) => r.roleId) ?? [],
    [user?.roles],
  );

  const navItems = useMemo(
    () =>
      allNavItems.filter(
        (item) =>
          !item.allowedRoles ||
          item.allowedRoles.some((id) => userRoleIds.includes(id)),
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
