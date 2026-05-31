import * as React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import heLocale from "@fullcalendar/core/locales/he";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../../contexts/useDataContext";
import { EventDetailsDialog } from "../../../components/EventDetailsDialog/EventDetailsDialog";
import { useCalendarStyles } from "./Calendar.styles";
import type { IEvent } from "../../../interfaces/event.interface";

export const CalendarPage: React.FC = () => {
  const { events, isLoading } = useDataContext();
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | null>(null);
  const styles = useCalendarStyles();
  const navigate = useNavigate();

  const calendarEvents = events.map((event) => ({
    id: event.id?.toString(),
    title: event.name,
    start: event.startDate,
    end: event.endDate,
    allDay: false,
    backgroundColor: "#9a5188",
    borderColor: "#7a3e6b",
    textColor: "#fff",
    extendedProps: { ...event },
  }));

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps as IEvent);
  };

  const handleCloseDialog = () => setSelectedEvent(null);

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>לוח שנה</Typography>
        <Button
          variant="outlined"
          className={styles.eventsButton}
          startIcon={<EventNoteIcon />}
          onClick={() => navigate("/events")}
        >
          אירועים
        </Button>
      </Box>

      {isLoading ? (
        <Box className={styles.loadingBox}>
          <CircularProgress sx={{ color: "#9a5188" }} />
          <Typography sx={{ mt: 2, color: "#999", fontFamily: "Rubik" }}>
            טוען אירועים...
          </Typography>
        </Box>
      ) : (
        <Box className={styles.calendarWrapper}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={heLocale}
            direction="rtl"
            height="auto"
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "",
            }}
            dayMaxEvents={3}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            stickyHeaderDates
          />
        </Box>
      )}

      {selectedEvent && (
        <EventDetailsDialog
          open={!!selectedEvent}
          eventData={selectedEvent}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};
