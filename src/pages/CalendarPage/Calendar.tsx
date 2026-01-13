import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material";

export const CalendarPage: React.FC = () => {
  return (
    <Box
      sx={{
        width: "95%",
        height: "87%",
        position: "absolute",
        left: "2%",
        bottom: 5,
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          right: "prev,next today",
          center: "title",
          left: "",
        }}
        dayMaxEvents={3}
        events={[
          { title: "Meeting", date: "2025-12-31" },
          { title: "Meeting", date: "2025-12-22" },
          {
            title: "Vacation",
            start: "2025-12-20",
            end: "2025-12-25",
            allDay: true,
            color: "red",
          },
        ]}
      />
    </Box>
  );
};
