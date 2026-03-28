import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ReportIcon } from "../../icons/ReportsIcon";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "דשבורד", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "בית", icon: <HomeIcon />, path: "/home" },
  { label: "מתנדבים", icon: <PeopleIcon />, path: "/volunteers" },
  { label: "לוח שנה", icon: <CalendarIcon />, path: "/calendar" },
  { label: "אירועים", icon: <ReportIcon />, path: "/events" },
  { label: "חניכים", icon: <PeopleIcon />, path: "/trainee" },
  { label: "שיבוץ חונכים", icon: <GroupsIcon />, path: "/mentor-assignments" },
];
