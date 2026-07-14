import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "בית", icon: <HomeOutlinedIcon />, path: "/dashboard" },
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
