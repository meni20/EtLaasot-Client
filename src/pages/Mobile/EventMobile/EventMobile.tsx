import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBranch } from "../../../contexts/useBranch";
import { useAuth } from "../../../contexts/useAuth";
import { useDataContext } from "../../../contexts/useDataContext";
import { formatDate } from "../../../utils/data.utillity";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import attendeeService from "../../../services/attendee.service";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./EventMobile.styles";
import type { IEvent } from "../../../interfaces/event.interface";

const HEBREW_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

export const EventMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { events } = useDataContext();
  const { activeBranch } = useBranch();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isVolunteer = user?.roles?.some(
    (r) => r.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const joinMutation = useMutation({
    mutationFn: ({ eventId, status }: { eventId: string; status: string }) =>
      attendeeService.joinEvent(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
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

  const isBusy = joinMutation.isPending || rsvpMutation.isPending;

  const grouped = useMemo(() => {
    const map = new Map<string, IEvent[]>();
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
    for (const event of sorted) {
      const d = new Date(event.startDate);
      const key = `${HEBREW_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [events]);

  return (
    <Box className={styles.root}>
      <Typography className={styles.header}>אירועים</Typography>

      {events.length === 0 && (
        <Typography className={styles.empty}>אין אירועים להצגה</Typography>
      )}

      {Array.from(grouped.entries()).map(([month, monthEvents]) => (
        <Box key={month}>
          <Typography className={styles.monthTitle}>{month}</Typography>
          <Stack spacing={1}>
            {monthEvents.map((event) => {
              const myAttendee = event.attendees?.find(
                (a) => a.userId === user?.userId,
              );
              const myRsvp = myAttendee?.rsvpStatus;

              return (
                <Box key={event.id} className={styles.eventCard}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography className={styles.eventName}>
                        {event.name}
                      </Typography>
                      <Typography className={styles.eventMeta}>
                        {formatDate(event.startDate)}
                        {event.address ? ` • ${event.address}` : ""}
                      </Typography>
                    </Box>
                    {event.eventType && EVENT_TYPES[event.eventType] && (
                      <Chip
                        size="small"
                        label={`${EVENT_TYPES[event.eventType].icon} ${EVENT_TYPES[event.eventType].label}`}
                        className={styles.typeChip}
                      />
                    )}
                  </Stack>

                  {/* RSVP status & actions */}
                  {myRsvp === "confirmed" ? (
                    <Box className={styles.rsvpRow}>
                      <Chip
                        size="small"
                        label="✅ אישרת הגעה"
                        color="success"
                        className={styles.rsvpBadge}
                      />
                      <Button
                        size="small"
                        className={styles.rsvpDecline}
                        onClick={() => handleRsvp(event, "declined")}
                        disabled={isBusy}
                        sx={{ color: "#d32f2f" }}
                      >
                        {isBusy ? <CircularProgress size={14} /> : "ביטול ❌"}
                      </Button>
                    </Box>
                  ) : myRsvp === "declined" ? (
                    <Box className={styles.rsvpRow}>
                      <Chip
                        size="small"
                        label="❌ לא מגיע/ה"
                        color="error"
                        className={styles.rsvpBadge}
                      />
                      <Button
                        size="small"
                        className={styles.rsvpConfirm}
                        onClick={() => handleRsvp(event, "confirmed")}
                        disabled={isBusy}
                        sx={{ color: "#2e7d32" }}
                      >
                        {isBusy ? <CircularProgress size={14} /> : "בעצם כן ✅"}
                      </Button>
                    </Box>
                  ) : (
                    <Box className={styles.rsvpRow}>
                      <Button
                        size="small"
                        variant="contained"
                        className={styles.rsvpConfirm}
                        onClick={() => handleRsvp(event, "confirmed")}
                        disabled={isBusy}
                        sx={{
                          bgcolor: "#9a5188",
                          "&:hover": { bgcolor: "#7a3e6b" },
                        }}
                      >
                        {isBusy ? (
                          <CircularProgress size={14} sx={{ color: "#fff" }} />
                        ) : (
                          "אשר הגעה ✅"
                        )}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.rsvpDecline}
                        onClick={() => handleRsvp(event, "declined")}
                        disabled={isBusy}
                        sx={{
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                        }}
                      >
                        לא מגיע ❌
                      </Button>
                    </Box>
                  )}

                  {isVolunteer &&
                    event.attendees &&
                    event.attendees.length > 0 && (
                      <Button
                        size="small"
                        variant="text"
                        sx={{
                          mt: 0.5,
                          fontSize: 12,
                          color: "#9a5188",
                          textTransform: "none",
                        }}
                        onClick={() =>
                          navigate(`/events/${event.id}/attendance`)
                        }
                      >
                        נוכחות →
                      </Button>
                    )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      ))}

      <BottomNav />
    </Box>
  );
};
