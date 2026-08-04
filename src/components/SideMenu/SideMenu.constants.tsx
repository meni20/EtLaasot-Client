import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import { AUTH_ROLES } from "../../constants/auth.const";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  allowedRoles?: number[];
}

export const menuItems: MenuItem[] = [
  { label: "בית", icon: <HomeOutlinedIcon />, path: "/dashboard" },
  {
    label: "סקירה ארגונית",
    icon: <DashboardCustomizeOutlinedIcon />,
    path: "/super-admin-dashboard",
    allowedRoles: [AUTH_ROLES.SUPER_ADMIN.id],
  },
  { label: "אירועים", icon: <CalendarMonthOutlinedIcon />, path: "/events" },
  {
    label: "מתנדבים",
    icon: <VolunteerActivismOutlinedIcon />,
    path: "/volunteers",
  },
  { label: "חניכים", icon: <SchoolOutlinedIcon />, path: "/trainee" },
  {
    label: "שיבוץ חונכים",
    icon: <AssignmentIndOutlinedIcon />,
    path: "/mentor-assignments",
  },
  { label: "פעילויות", icon: <AssignmentOutlinedIcon />, path: "/activities" },
];
