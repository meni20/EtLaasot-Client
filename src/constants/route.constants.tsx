import { HomePage } from "../pages/DesktopPages/HomePage/Home";
import { HomeMobile } from "../pages/Mobile/HomePage/HomeMobile";
import { EventPage } from "../pages/DesktopPages/EventPage/Event";
import { EventMobile } from "../pages/Mobile/EventMobile/EventMobile";
import { CalendarPage } from "../pages/DesktopPages/CalendarPage/Calendar";
import { TraineePage } from "../pages/DesktopPages/TraineePage/TraineePage";
import { CalendarMobile } from "../pages/Mobile/CalendarMobile/CalendarMobile";
import { VolunteerPage } from "../pages/DesktopPages/VolunteersPage/VolunteerPage";

export const DESKTOP_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/volunteers", element: <VolunteerPage /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/events", element: <EventPage /> },
  { path: "/trainee", element: <TraineePage /> },
];

export const MOBILE_ROUTES = [
  {path: "/", element: <HomeMobile /> },
  {path: "/home", element: <HomeMobile /> },
  {path: "/events", element: <EventMobile /> },
  {path: "/calendar", element: <CalendarMobile /> },
];
