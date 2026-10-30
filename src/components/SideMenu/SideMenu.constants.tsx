import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { AUTH_ROLES } from "../../constants/auth.const";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  allowedRoles?: number[];
  anchoredToBottom?: boolean;
}

export const menuItems: MenuItem[] = [
  ...(import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED === "true"
    ? [
        {
          label: "בקשות הרשמה",
          icon: <AssignmentOutlinedIcon />,
          path: "/parent-applications-admin",
          allowedRoles: [AUTH_ROLES.SUPER_ADMIN.id, AUTH_ROLES.BRANCH_ADMIN.id],
        },
      ]
    : []),
  ...(import.meta.env.VITE_PARENT_REGISTRATION_ENABLED === "true"
    ? [
        {
          label: "רישום חניכים",
          icon: <AssignmentOutlinedIcon />,
          path: "/parent-registration",
          allowedRoles: [AUTH_ROLES.SUPER_ADMIN.id, AUTH_ROLES.BRANCH_ADMIN.id],
        },
      ]
    : []),
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
  { label: "קבצים", icon: <FolderOutlinedIcon />, path: "/files" },
  {
    label: "שיבוץ חונכים",
    icon: <AssignmentIndOutlinedIcon />,
    path: "/mentor-assignments",
  },
  { label: "פעילויות", icon: <AssignmentOutlinedIcon />, path: "/activities" },
  {
    label: "הגדרות",
    icon: <SettingsOutlinedIcon />,
    path: "/settings",
    allowedRoles: [AUTH_ROLES.SUPER_ADMIN.id, AUTH_ROLES.BRANCH_ADMIN.id],
    anchoredToBottom: true,
  },
];
