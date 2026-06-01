import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_ROLES } from "./auth.const";

const DashboardPage = lazy(() =>
  import("../pages/DesktopPages/DashboardPage/Dashboard").then((module) => ({
    default: module.DashboardPage,
  })),
);
const VolunteerPage = lazy(() =>
  import("../pages/DesktopPages/VolunteersPage/VolunteerPage").then(
    (module) => ({ default: module.VolunteerPage }),
  ),
);
const CalendarPage = lazy(() =>
  import("../pages/DesktopPages/CalendarPage/Calendar").then((module) => ({
    default: module.CalendarPage,
  })),
);
const EventPage = lazy(() =>
  import("../pages/DesktopPages/EventPage/Event").then((module) => ({
    default: module.EventPage,
  })),
);
const ActivitiesPage = lazy(() =>
  import("../pages/DesktopPages/ActivitiesPage/ActivitiesPage").then(
    (module) => ({ default: module.ActivitiesPage }),
  ),
);
const TraineePage = lazy(() =>
  import("../pages/DesktopPages/TraineePage/TraineePage").then((module) => ({
    default: module.TraineePage,
  })),
);
const MentorAssignmentPage = lazy(() =>
  import("../pages/DesktopPages/MentorAssignmentPage/MentorAssignment").then(
    (module) => ({ default: module.MentorAssignmentPage }),
  ),
);
const HomeMobile = lazy(() =>
  import("../pages/Mobile/HomePage/HomeMobile").then((module) => ({
    default: module.HomeMobile,
  })),
);
const ActivityMobile = lazy(() =>
  import("../pages/Mobile/ActivityMobile/ActivityMobile").then((module) => ({
    default: module.ActivityMobile,
  })),
);
const EventMobile = lazy(() =>
  import("../pages/Mobile/EventMobile/EventMobile").then((module) => ({
    default: module.EventMobile,
  })),
);
const EventDetailsMobile = lazy(() =>
  import("../pages/Mobile/EventMobile/EventDetailsMobile").then((module) => ({
    default: module.EventDetailsMobile,
  })),
);
const AttendanceCheckinPage = lazy(() =>
  import("../pages/Mobile/AttendanceCheckin/AttendanceCheckin").then(
    (module) => ({ default: module.AttendanceCheckinPage }),
  ),
);
const MyTraineesPage = lazy(() =>
  import("../pages/Mobile/MyTrainees/MyTrainees").then((module) => ({
    default: module.MyTraineesPage,
  })),
);
const ProfilePage = lazy(() =>
  import("../pages/Mobile/ProfilePage/Profile").then((module) => ({
    default: module.ProfilePage,
  })),
);

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  allowedRoles?: number[];
}

export const DESKTOP_ROUTES: AppRoute[] = [
  { path: "/", element: <DashboardPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/home", element: <Navigate to="/dashboard" replace /> },
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
  { path: "/events/:eventId", element: <EventDetailsMobile /> },
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
