import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { AUTH_ROLES } from "../../constants/auth.const";
import { menuItems } from "../SideMenu/SideMenu.constants";
import type { AdminSearchAction } from "./adminActionSearch.types";

const ADMIN_ROLE_IDS = [
  AUTH_ROLES.SUPER_ADMIN.id,
  AUTH_ROLES.BRANCH_ADMIN.id,
];

const navigationAliases: Record<string, string[]> = {
  "/dashboard": ["בית", "ראשי", "לוח בקרה", "דשבורד"],
  "/super-admin-dashboard": ["סקירה", "ארגון", "ארגונית", "כל הסניפים"],
  "/volunteers": ["מתנדב", "מתנדבים", "חונך", "חונכים"],
  "/trainee": ["חניך", "חניכים"],
  "/events": ["אירוע", "אירועים"],
  "/activities": ["פעילות", "פעילויות", "שעות פעילות"],
  "/mentor-assignments": ["שיבוץ", "שיבוצים", "חונך חניך", "הקצאות"],
  "/settings": ["הגדרה", "הגדרות", "חשבון"],
};

const navigationActions: AdminSearchAction[] = menuItems.map((item) => ({
  id: `navigate:${item.path}`,
  type: "navigate" as const,
  label: item.label,
  aliases: navigationAliases[item.path] ?? [item.label],
  icon: item.icon,
  path: item.path,
  allowedRoles: item.allowedRoles ?? ADMIN_ROLE_IDS,
  description: "מעבר לעמוד",
}));

export const STATIC_ADMIN_ACTIONS: AdminSearchAction[] = [
  ...navigationActions,
  {
    id: "navigate:/calendar",
    type: "navigate",
    label: "לוח שנה",
    aliases: ["לוח", "יומן", "קלנדר", "אירועים לפי תאריך"],
    icon: <CalendarMonthOutlinedIcon />,
    path: "/calendar",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "מעבר ללוח השנה",
  },
  {
    id: "create-volunteer",
    type: "route-action",
    label: "הוספת מתנדב",
    aliases: ["מתנדב חדש", "הוספת חונך", "חונך חדש", "יצירת מתנדב"],
    icon: <PersonAddAltOutlinedIcon />,
    path: "/volunteers",
    routeAction: "create-volunteer",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "פתיחת טופס מתנדב חדש",
  },
  {
    id: "create-trainee",
    type: "route-action",
    label: "הוספת חניך",
    aliases: ["חניך חדש", "יצירת חניך", "הוספת חניכים"],
    icon: <BadgeOutlinedIcon />,
    path: "/trainee",
    routeAction: "create-trainee",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "פתיחת טופס חניך חדש",
  },
  {
    id: "create-event",
    type: "route-action",
    label: "יצירת אירוע",
    aliases: ["אירוע חדש", "הוספת אירוע", "יצירת אירועים"],
    icon: <AddCircleOutlineRoundedIcon />,
    path: "/events",
    routeAction: "create-event",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "פתיחת טופס אירוע חדש",
  },
  {
    id: "personal-details",
    type: "dialog",
    label: "פרטים אישיים",
    aliases: ["הפרטים שלי", "פרטי חשבון", "פרופיל", "חשבון אישי"],
    icon: <PersonOutlineRoundedIcon />,
    dialog: "personal-details",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "הצגת פרטי החשבון",
  },
  {
    id: "change-password",
    type: "dialog",
    label: "שינוי סיסמה",
    aliases: ["שנה סיסמה", "סיסמא", "עדכון סיסמה", "אבטחה"],
    icon: <LockResetRoundedIcon />,
    dialog: "change-password",
    allowedRoles: ADMIN_ROLE_IDS,
    description: "פתיחת שינוי סיסמה",
  },
];

export const createBranchAction = (
  branch: { id: string; name: string },
): AdminSearchAction => ({
  id: `switch-branch:${branch.id}`,
  type: "switch-branch",
  label: `מעבר אל ${branch.name}`,
  aliases: ["החלפת סניף", "בחירת סניף", "מעבר בין סניפים", branch.name],
  icon: <BusinessOutlinedIcon />,
  branchId: branch.id,
  allowedRoles: ADMIN_ROLE_IDS,
  description: "החלפת הסניף הפעיל",
});
