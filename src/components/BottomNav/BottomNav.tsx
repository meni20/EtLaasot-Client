import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import { useStyles } from "./BottomNav.styles";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  { label: "אירועים", icon: <EventIcon />, path: "/events" },
];

export const BottomNav: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

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
