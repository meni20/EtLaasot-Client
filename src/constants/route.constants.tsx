import { HomePage } from "../pages/DesktopPages/HomePage/Home";
import { HomeMobile } from "../pages/Mobile/HomePage/HomeMobile";
import { EventPage } from "../pages/DesktopPages/EventPage/Event";
import { EventMobile } from "../pages/Mobile/EventMobile/EventMobile";
import { CalendarPage } from "../pages/DesktopPages/CalendarPage/Calendar";
import { TraineePage } from "../pages/DesktopPages/TraineePage/TraineePage";
import { VolunteerPage } from "../pages/DesktopPages/VolunteersPage/VolunteerPage";
import { LoginPage } from "../pages/Mobile/LoginPage/Login";
import { DashboardPage } from "../pages/DesktopPages/DashboardPage/Dashboard";
import { MentorAssignmentPage } from "../pages/DesktopPages/MentorAssignmentPage/MentorAssignment";
import { MyTraineesPage } from "../pages/Mobile/MyTrainees/MyTrainees";
import { AttendanceCheckinPage } from "../pages/Mobile/AttendanceCheckin/AttendanceCheckin";
import { ProfilePage } from "../pages/Mobile/ProfilePage/Profile";

export const DESKTOP_ROUTES = [
  { path: "/", element: <DashboardPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/volunteers", element: <VolunteerPage /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/events", element: <EventPage /> },
  { path: "/trainee", element: <TraineePage /> },
  { path: "/mentor-assignments", element: <MentorAssignmentPage /> },
];

export const MOBILE_ROUTES = [
  { path: "/", element: <HomeMobile /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/home", element: <HomeMobile /> },
  { path: "/events", element: <EventMobile /> },
  { path: "/events/:eventId/attendance", element: <AttendanceCheckinPage /> },
  { path: "/trainees", element: <MyTraineesPage /> },
  { path: "/profile", element: <ProfilePage /> },
];
