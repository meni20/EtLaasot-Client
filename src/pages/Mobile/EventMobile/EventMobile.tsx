import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { useMobileEvents } from "../../../hooks/mobile/useMobileEvents";
import { EventSummaryCard } from "../../../components/mobile/EventSummaryCard";
import { useStyles } from "./EventMobile.styles";
import type { AttendanceIntent, IEvent } from "../../../interfaces/event.interface";

const monthFormatter = new Intl.DateTimeFormat("he-IL", {
  month: "long",
  year: "numeric",
});

export const EventMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { upcomingEvents } = useMobileEvents();
  const { user } = useAuth();

  const getAttendanceIntent = (event: IEvent): AttendanceIntent => {
    const userAttends =
      event.attendees?.some((attendee) => attendee.userId === user?.userId) ??
      false;

    return userAttends ? "VOLUNTEER_ONLY" : "NONE";
  };

  const grouped = useMemo(() => {
    const map = new Map<string, IEvent[]>();
    for (const event of upcomingEvents) {
      const date = new Date(event.startDate);
      const key = monthFormatter.format(date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [upcomingEvents]);

  const hasVisibleEvents = Array.from(grouped.values()).some(
    (monthEvents) => monthEvents.length > 0,
  );

  return (
    <Box className={styles.root}>
      <Typography className={styles.header}>אירועים</Typography>

      {!hasVisibleEvents && (
        <Typography className={styles.empty}>אין אירועים להצגה</Typography>
      )}

      {Array.from(grouped.entries()).map(([month, monthEvents]) => (
        <Box key={month}>
          <Typography className={styles.monthTitle}>{month}</Typography>
          <Stack spacing={1}>
            {monthEvents.map((event) => (
              <EventSummaryCard
                key={event.id}
                event={event}
                attendanceIntent={getAttendanceIntent(event)}
                onClick={() => event.id && navigate(`/events/${event.id}`)}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};
