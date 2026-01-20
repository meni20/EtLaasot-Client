import { HomePage } from "../pages/HomePage/Home";
import { EventPage } from "../pages/EventPage/Event";
import { CalendarPage } from "../pages/CalendarPage/Calendar";
import { VolunteerPage } from "../pages/VolunteersPage/VolunteerPage";
import { TraineePage } from "../pages/TraineePage/TraineePage";

export const ALL_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/volunteers", element: <VolunteerPage /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/events", element: <EventPage /> },
  { path: "/trainee", element: <TraineePage /> },
];
