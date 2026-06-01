import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { useMobileEvents } from "../../../hooks/mobile/useMobileEvents";
import { AUTH_ROLES } from "../../../constants/auth.const";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { EventSummaryCard } from "../../../components/mobile/EventSummaryCard";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./EventMobile.styles";
import type {
  AttendanceIntent,
  IEvent,
  IMentorAssignment,
} from "../../../interfaces/event.interface";

const monthFormatter = new Intl.DateTimeFormat("he-IL", {
  month: "long",
  year: "numeric",
});

export const EventMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { upcomingEvents } = useMobileEvents();
  const { user } = useAuth();

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const activeAssignment = myTrainees.find((assignment) => assignment.isActive);
  const getAttendanceIntent = (event: IEvent): AttendanceIntent => {
    const volunteerAttends =
      event.attendees?.some((attendee) => attendee.userId === user?.userId) ??
      false;
    const traineeAttends =
      event.attendees?.some(
        (attendee) => attendee.userId === activeAssignment?.traineeId,
      ) ?? false;

    if (volunteerAttends && traineeAttends) return "BOTH";
    if (volunteerAttends) return "VOLUNTEER_ONLY";
    if (traineeAttends) return "TRAINEE_ONLY";
    return "NONE";
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

      <BottomNav />
    </Box>
  );
};
