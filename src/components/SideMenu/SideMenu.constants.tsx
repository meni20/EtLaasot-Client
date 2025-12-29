import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Volunteers", icon: <PeopleIcon />, path: "/volunteers" },
];
