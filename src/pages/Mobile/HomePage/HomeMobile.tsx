import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import eventService from "../../../services/event.service";
import attendeeService from "../../../services/attendee.service";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { formatDate } from "../../../utils/data.utillity";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./HomeMobile.styles";
import type {
  IEvent,
  IMentorAssignment,
} from "../../../interfaces/event.interface";

export const HomeMobile: React.FC = () => {
  const styles = useStyles();
  const { user } = useAuth();
  const { activeBranch } = useBranch();
  const queryClient = useQueryClient();

  const isVolunteer = user?.roles?.some(
    (r) => r.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: events = [] } = useQuery<IEvent[]>({
    queryKey: ["upcomingEvents", activeBranch],
    queryFn: () => eventService.getUpcomingEvents(activeBranch!, 10),
    enabled: !!activeBranch,
  });

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const rsvpMutation = useMutation({
    mutationFn: ({
      attendeeId,
      status,
    }: {
      attendeeId: string;
      status: string;
    }) => attendeeService.updateRsvp(attendeeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const joinMutation = useMutation({
    mutationFn: ({ eventId, status }: { eventId: string; status: string }) =>
      attendeeService.joinEvent(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleRsvp = (event: IEvent, status: "confirmed" | "declined") => {
    if (!event.id) return;
    const myAttendee = event.attendees?.find((a) => a.userId === user?.userId);
    if (myAttendee?.id) {
      rsvpMutation.mutate({ attendeeId: myAttendee.id, status });
    } else {
      joinMutation.mutate({ eventId: event.id, status });
    }
  };

  const nextEvent = events[0];
  const activeTrainees = myTrainees.filter((t) => t.isActive).length;
  const isBusy = rsvpMutation.isPending || joinMutation.isPending;

  const nextEventRsvp = nextEvent?.attendees?.find(
    (a) => a.userId === user?.userId,
  )?.rsvpStatus;

  return (
    <Box className={styles.root}>
      <Typography className={styles.greeting}>
        שלום, {user?.name ?? ""}
      </Typography>
      <Typography className={styles.subtitle}>מה קורה השבוע בסניף</Typography>

      {nextEvent && (
        <Box className={styles.nextEventCard}>
          <Typography className={styles.nextEventTitle}>
            {nextEvent.name}
          </Typography>
          <Typography className={styles.nextEventDetail}>
            📅 {formatDate(nextEvent.startDate)}
          </Typography>
          {nextEvent.address && (
            <Typography className={styles.nextEventDetail}>
              📍 {nextEvent.address}
            </Typography>
          )}
          {nextEvent.eventType && (
            <Typography className={styles.nextEventDetail}>
              {EVENT_TYPES[nextEvent.eventType]?.icon}{" "}
              {EVENT_TYPES[nextEvent.eventType]?.label}
            </Typography>
          )}

          {nextEventRsvp === "confirmed" ? (
            <Box className={styles.rsvpButtons}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: 14, mr: 1 }}
              >
                ✅ אישרת הגעה
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleRsvp(nextEvent, "declined")}
                disabled={isBusy}
                sx={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 3,
                  fontSize: 12,
                }}
              >
                ביטול ❌
              </Button>
            </Box>
          ) : nextEventRsvp === "declined" ? (
            <Box className={styles.rsvpButtons}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 700,
                  fontSize: 14,
                  mr: 1,
                }}
              >
                ❌ לא מגיע/ה
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleRsvp(nextEvent, "confirmed")}
                disabled={isBusy}
                sx={{
                  bgcolor: "#fff",
                  color: "#9a5188",
                  fontWeight: 700,
                  borderRadius: 3,
                  fontSize: 12,
                  "&:hover": { bgcolor: "#f0e8ee" },
                }}
              >
                בעצם כן ✅
              </Button>
            </Box>
          ) : (
            <Box className={styles.rsvpButtons}>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleRsvp(nextEvent, "confirmed")}
                disabled={isBusy}
                sx={{
                  bgcolor: "#fff",
                  color: "#9a5188",
                  fontWeight: 700,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "#f0e8ee" },
                }}
              >
                אשר הגעה ✅
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleRsvp(nextEvent, "declined")}
                disabled={isBusy}
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 3,
                }}
              >
                לא מגיע ❌
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box className={styles.statsGrid}>
        {isVolunteer && (
          <Box className={styles.statCard}>
            <Typography className={styles.statValue}>
              {activeTrainees}
            </Typography>
            <Typography className={styles.statLabel}>חניכים שלי</Typography>
          </Box>
        )}
        <Box className={styles.statCard}>
          <Typography className={styles.statValue}>{events.length}</Typography>
          <Typography className={styles.statLabel}>אירועים קרובים</Typography>
        </Box>
      </Box>

      {events.length > 1 && (
        <>
          <Typography className={styles.sectionTitle}>
            אירועים קרובים
          </Typography>
          <Stack spacing={1}>
            {events.slice(1).map((event) => (
              <Box key={event.id} className={styles.eventItem}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography className={styles.eventItemName}>
                      {event.name}
                    </Typography>
                    <Typography className={styles.eventItemDate}>
                      {formatDate(event.startDate)}
                      {event.address ? ` • ${event.address}` : ""}
                    </Typography>
                  </Box>
                  {event.eventType && EVENT_TYPES[event.eventType] && (
                    <Chip
                      size="small"
                      label={EVENT_TYPES[event.eventType].label}
                      className={styles.typeChip}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </>
      )}

      <BottomNav />
    </Box>
  );
};
