import HomeIcon from "@mui/icons-material/Home";
import {ReportIcon} from "../../icons/ReportsIcon";
import PeopleIcon from "@mui/icons-material/People";
import { CalendarIcon } from "../../icons/CalendarIcon";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Volunteers", icon: <PeopleIcon />, path: "/volunteers" },
  {label: "Calendar", icon: <CalendarIcon />, path: "/calendar"},
  {label: "Events" , icon: <ReportIcon/>, path: "/events"},
  {label: "Trainee", icon: <PeopleIcon/>, path: "/trainee"}
];
