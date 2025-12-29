import { HomePage } from "../pages/HomePage/Home";
import { VolunteerPage } from "../pages/VolunteersPage/VolunteerPage";

export const ALL_ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/volunteers", element: <VolunteerPage /> },
];
