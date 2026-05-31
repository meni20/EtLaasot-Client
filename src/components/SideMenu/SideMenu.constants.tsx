import PeopleIcon from "@mui/icons-material/People";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ReportIcon } from "../../icons/ReportsIcon";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "בית", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { label: "אירועים", icon: <ReportIcon />, path: "/events" },
  { label: "מתנדבים", icon: <PeopleIcon />, path: "/volunteers" },
  { label: "חניכים", icon: <PeopleIcon />, path: "/trainee" },
  { label: "שיבוץ חונכים", icon: <GroupsIcon />, path: "/mentor-assignments" },
  { label: "פעילויות", icon: <AccessTimeIcon />, path: "/activities" },
];
