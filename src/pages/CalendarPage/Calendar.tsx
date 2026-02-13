import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material";
import { useDataContext } from "../../contexts/DataContext.context";

export const CalendarPage: React.FC = () => {
  const { events } = useDataContext();

  const calendarEvents = events.map((event) => ({
    id: event.id?.toString(),
    title: event.name,
    start: event.startDate,
    end: event.endDate,
    allDay: true,
    backgroundColor: "#9a5188",
    borderColor: "#7a3e6b",
    textColor: "#fff",
  }));

  const handleEventClick = (clickInfo: { event: { title: any } }) => {
    alert(`Event: ${clickInfo.event.title}`);
  };

  const handleEventDidMount = (info: any) => {
    info.el.style.borderRadius = "8px";
    info.el.style.padding = "4px 8px";
    info.el.style.cursor = "pointer";
  };

  return (
    <Box
      sx={{
        width: "95%",
        height: "83%",
        position: "absolute",
        left: "2%",
        bottom: "8%",
        "& .fc": {
          fontFamily: "Rubik, sans-serif",
          color: "#333",
        },
        "& .fc-toolbar-title": {
          fontWeight: 700,
          fontSize: 22,
          color: "#9a5188",
        },
        "& .fc-daygrid-day-number": {
          fontWeight: 600,
          color: "#7a3e6b",
        },
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "",
          center: "title",
          right: "prev,next today",
        }}
        dayMaxEvents={3}
        events={calendarEvents}
        eventClick={handleEventClick}
        eventDidMount={handleEventDidMount}
      />
    </Box>
  );
};
