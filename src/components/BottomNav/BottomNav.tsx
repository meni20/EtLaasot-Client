import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useStyles } from "./BottomNav.styles";
import { useAuth } from "../../contexts/useAuth";
import { AUTH_ROLES } from "../../constants/auth.const";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  allowedRoles?: number[];
}

const allNavItems: NavItem[] = [
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  {
    label: "פעילות",
    icon: <AssignmentTurnedInRoundedIcon />,
    path: "/activity",
    allowedRoles: [AUTH_ROLES.VOLUNTEER.id],
  },
  { label: "אירועים", icon: <EventIcon />, path: "/events" },
  { label: "פרופיל", icon: <PersonRoundedIcon />, path: "/profile" },
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
    matchNavPath(location.pathname, item.path),
  );

  return (
    <BottomNavigation
      component="nav"
      aria-label="ניווט תחתון"
      className={styles.root}
      value={currentIndex === -1 ? false : currentIndex}
      onChange={(_, newValue) => {
        const target = navItems[newValue]?.path;
        if (target && target !== location.pathname) {
          navigate(target);
        }
      }}
      showLabels
    >
      {navItems.map((item, index) => (
        <BottomNavigationAction
          key={item.path}
          label={item.label}
          icon={item.icon}
          aria-current={index === currentIndex ? "page" : undefined}
        />
      ))}
    </BottomNavigation>
  );
};

const matchNavPath = (pathname: string, navPath: string) => {
  if (navPath === "/home") {
    return pathname === "/" || pathname === "/home";
  }

  return pathname === navPath || pathname.startsWith(`${navPath}/`);
};
