import { HomePage } from "../pages/DesktopPages/HomePage/Home";
import { HomeMobile } from "../pages/Mobile/HomePage/HomeMobile";
import { EventPage } from "../pages/DesktopPages/EventPage/Event";
import { EventMobile } from "../pages/Mobile/EventMobile/EventMobile";
import { ActivitiesPage } from "../pages/DesktopPages/ActivitiesPage/ActivitiesPage";
import { ActivityMobile } from "../pages/Mobile/ActivityMobile/ActivityMobile";
import { CalendarPage } from "../pages/DesktopPages/CalendarPage/Calendar";
import { TraineePage } from "../pages/DesktopPages/TraineePage/TraineePage";
import { VolunteerPage } from "../pages/DesktopPages/VolunteersPage/VolunteerPage";
import { DashboardPage } from "../pages/DesktopPages/DashboardPage/Dashboard";
import { MentorAssignmentPage } from "../pages/DesktopPages/MentorAssignmentPage/MentorAssignment";
import { MyTraineesPage } from "../pages/Mobile/MyTrainees/MyTrainees";
import { AttendanceCheckinPage } from "../pages/Mobile/AttendanceCheckin/AttendanceCheckin";
import { ProfilePage } from "../pages/Mobile/ProfilePage/Profile";
import { AUTH_ROLES } from "./auth.const";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  allowedRoles?: number[];
}

export const DESKTOP_ROUTES: AppRoute[] = [
  { path: "/", element: <DashboardPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/volunteers", element: <VolunteerPage /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/events", element: <EventPage /> },
  { path: "/activities", element: <ActivitiesPage /> },
  { path: "/trainee", element: <TraineePage /> },
  { path: "/mentor-assignments", element: <MentorAssignmentPage /> },
];

export const MOBILE_ROUTES: AppRoute[] = [
  { path: "/", element: <HomeMobile /> },
  { path: "/home", element: <HomeMobile /> },
  {
    path: "/activity",
    element: <ActivityMobile />,
    allowedRoles: [AUTH_ROLES.VOLUNTEER.id],
  },
  { path: "/events", element: <EventMobile /> },
  {
    path: "/events/:eventId/attendance",
    element: <AttendanceCheckinPage />,
    allowedRoles: [AUTH_ROLES.VOLUNTEER.id],
  },
  {
    path: "/trainees",
    element: <MyTraineesPage />,
    allowedRoles: [AUTH_ROLES.VOLUNTEER.id],
  },
  { path: "/profile", element: <ProfilePage /> },
];

export const DESKTOP_ROLE_IDS = [
  AUTH_ROLES.SUPER_ADMIN.id,
  AUTH_ROLES.BRANCH_ADMIN.id,
];

export const MOBILE_ROLE_IDS = [AUTH_ROLES.VOLUNTEER.id, AUTH_ROLES.TRAINEE.id];
