import { useMemo, useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { BasicCard } from "../../../components/Card/Card";
import { CreateEvent } from "../../../components/CreateEvent/CreateEvent";
import { useDataContext } from "../../../contexts/useDataContext";
import type { IEvent } from "../../../interfaces/event.interface";
import { useStyles } from "./Event.styles";

export const EventPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const { events } = useDataContext();
  const allEvents = events ?? [];

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = Date.now();
    const sortedEvents = [...allEvents].sort(
      (firstEvent, secondEvent) =>
        new Date(firstEvent.startDate).getTime() -
        new Date(secondEvent.startDate).getTime(),
    );

    return {
      upcomingEvents: sortedEvents.filter(
        (event) => new Date(event.startDate).getTime() >= now,
      ),
      pastEvents: sortedEvents
        .filter((event) => new Date(event.startDate).getTime() < now)
        .reverse(),
    };
  }, [allEvents]);

  const renderEventCards = (sectionEvents: IEvent[]) => (
    <Box className={styles.cardsContainer}>
      {sectionEvents.map((event) => (
        <BasicCard
          key={event.id}
          eventId={event.id ?? ""}
          eventName={event.name}
          startDate={event.startDate}
          endDate={event.endDate}
          address={event.address}
          description={event.description}
          eventType={event.eventType}
          participantsCount={event.attendees?.length}
          onEdit={() => {
            setSelectedEvent(event);
            setOpen(true);
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>אירועים</Typography>
        <Box className={styles.headerActions}>
          <Tooltip title="הצג אירועים בלוח שנה">
            <Button
              onClick={() => navigate("/calendar")}
              variant="outlined"
              className={styles.calendarButton}
              startIcon={<CalendarMonthIcon />}
            >
              תצוגת לוח שנה
            </Button>
          </Tooltip>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setOpen(true);
            }}
            variant="contained"
            className={styles.createButton}
          >
            + יצירת אירוע
          </Button>
        </Box>
      </Box>

      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>אירועים קרובים</Typography>
        {upcomingEvents.length > 0 ? (
          renderEventCards(upcomingEvents)
        ) : (
          <Typography className={styles.emptyState}>
            אין כרגע אירועים קרובים.
          </Typography>
        )}
      </Box>

      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>אירועים שהיו</Typography>
        {pastEvents.length > 0 ? (
          renderEventCards(pastEvents)
        ) : (
          <Typography className={styles.emptyState}>
            אין אירועים קודמים להצגה.
          </Typography>
        )}
      </Box>

      {open && (
        <CreateEvent
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};
