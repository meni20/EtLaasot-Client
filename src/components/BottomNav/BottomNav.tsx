import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { useStyles } from "./BottomNav.styles";

const navItems = [
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  { label: "אירועים", icon: <EventIcon />, path: "/events" },
  { label: "חניכים", icon: <PeopleIcon />, path: "/trainees" },
  { label: "פרופיל", icon: <PersonIcon />, path: "/profile" },
];

export const BottomNav: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

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
