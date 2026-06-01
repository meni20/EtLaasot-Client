import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { useMobileEvents } from "../../../hooks/mobile/useMobileEvents";
import { formatDate } from "../../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import attendeeService from "../../../services/attendee.service";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./EventMobile.styles";
import type {
  AttendanceIntent,
  IEvent,
  IMentorAssignment,
} from "../../../interfaces/event.interface";

const ATTENDANCE_OPTIONS: {
  intent: AttendanceIntent;
  label: string;
  icon: string;
}[] = [
  { intent: "BOTH", label: "שנינו מגיעים", icon: "👥" },
  { intent: "VOLUNTEER_ONLY", label: "רק אני מגיע", icon: "🙋" },
  { intent: "TRAINEE_ONLY", label: "רק החניך מגיע", icon: "🧒" },
  { intent: "NONE", label: "לא מגיעים", icon: "✕" },
];

const ATTENDANCE_STATUS_LABELS: Record<AttendanceIntent, string> = {
  BOTH: "נרשמת: שנינו מגיעים",
  VOLUNTEER_ONLY: "נרשמת: רק אני מגיע",
  TRAINEE_ONLY: "נרשמת: רק החניך מגיע",
  NONE: "לא נרשמת עדיין",
};

const formatTime = (date: Date | string) => {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";
  return `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;
};

export const EventDetailsMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const { allEvents } = useMobileEvents();
  const { user } = useAuth();

  const event = allEvents.find((currentEvent) => currentEvent.id === eventId);

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const attendanceIntentMutation = useMutation({
    mutationFn: ({
      currentEventId,
      intent,
    }: {
      currentEventId: string;
      intent: AttendanceIntent;
    }) => attendeeService.updateAttendanceIntent(currentEventId, intent),
    onSuccess: (_updatedParticipants, { currentEventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["attendeesByEvent", currentEventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventAttendees", currentEventId],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const activeAssignment = myTrainees.find((assignment) => assignment.isActive);
  const getAttendanceIntent = (currentEvent: IEvent): AttendanceIntent => {
    const volunteerAttends =
      currentEvent.attendees?.some(
        (attendee) => attendee.userId === user?.userId,
      ) ?? false;
    const traineeAttends =
      currentEvent.attendees?.some(
        (attendee) => attendee.userId === activeAssignment?.traineeId,
      ) ?? false;

    if (volunteerAttends && traineeAttends) return "BOTH";
    if (volunteerAttends) return "VOLUNTEER_ONLY";
    if (traineeAttends) return "TRAINEE_ONLY";
    return "NONE";
  };

  const handleAttendanceIntent = (
    currentEvent: IEvent,
    intent: AttendanceIntent,
  ) => {
    if (!currentEvent.id) return;
    attendanceIntentMutation.mutate({
      currentEventId: currentEvent.id,
      intent,
    });
  };

  const selectedIntent = event ? getAttendanceIntent(event) : "NONE";

  return (
    <Box className={styles.root}>
      <Box className={styles.detailsHeader}>
        <IconButton
          className={styles.detailsBackButton}
          onClick={() => navigate("/events")}
          aria-label="חזרה"
        >
          <ArrowForwardIcon />
        </IconButton>
        <Typography className={styles.detailsHeaderTitle}>פרטי אירוע</Typography>
        <Box />
      </Box>

      {!event ? (
        <Typography className={styles.empty}>האירוע לא נמצא</Typography>
      ) : (
        <Box className={styles.detailsCard}>
          {event.eventType && EVENT_TYPES[event.eventType] && (
            <Chip
              size="small"
              label={`${EVENT_TYPES[event.eventType].icon} ${decodeUnicodeEscapes(
                EVENT_TYPES[event.eventType].label,
              )}`}
              className={styles.typeChip}
            />
          )}

          <Typography className={styles.detailsTitle}>
            {decodeUnicodeEscapes(event.name)}
          </Typography>

          <Box className={styles.detailsMetaGroup}>
            <DetailMetaRow
              icon={<EventIcon fontSize="small" />}
              value={formatDate(event.startDate)}
              styles={styles}
            />
            <DetailMetaRow
              icon={<AccessTimeIcon fontSize="small" />}
              value={`${formatTime(event.startDate)} - ${formatTime(
                event.endDate,
              )}`}
              styles={styles}
            />
            {event.address && (
              <DetailMetaRow
                icon={<LocationOnIcon fontSize="small" />}
                value={decodeUnicodeEscapes(event.address)}
                styles={styles}
              />
            )}
          </Box>

          {event.description && (
            <Typography className={styles.description}>
              {decodeUnicodeEscapes(event.description)}
            </Typography>
          )}

          {isVolunteer && (
            <Box className={styles.rsvpRow}>
              <Box>
                <Typography className={styles.rsvpTitle}>
                  מי מגיע לאירוע?
                </Typography>
                <Typography className={styles.rsvpStatus}>
                  {ATTENDANCE_STATUS_LABELS[selectedIntent]}
                </Typography>
              </Box>
              <Box className={styles.rsvpGrid}>
                {ATTENDANCE_OPTIONS.map((option) => {
                  const isSelected = selectedIntent === option.intent;

                  return (
                    <Button
                      key={option.intent}
                      variant="outlined"
                      className={styles.rsvpOptionCard}
                      onClick={() => handleAttendanceIntent(event, option.intent)}
                      disabled={attendanceIntentMutation.isPending}
                      sx={{
                        bgcolor: isSelected ? "#7B3F98" : "#fff",
                        borderColor: isSelected ? "#7B3F98" : "#E4D7EB",
                        color: isSelected ? "#fff" : "#1F1F1F",
                        boxShadow: isSelected
                          ? "0 6px 16px rgba(123, 63, 152, 0.24)"
                          : "none",
                        "&:hover": {
                          bgcolor: isSelected ? "#6D3588" : "#F7F2FA",
                          borderColor: "#7B3F98",
                          boxShadow: isSelected
                            ? "0 6px 16px rgba(123, 63, 152, 0.24)"
                            : "none",
                        },
                        "&.Mui-disabled": {
                          color: isSelected ? "#fff" : "#6B7280",
                          borderColor: isSelected ? "#7B3F98" : "#E4D7EB",
                        },
                      }}
                    >
                      <Typography className={styles.rsvpOptionIcon}>
                        {option.icon}
                      </Typography>
                      <Typography className={styles.rsvpOptionLabel}>
                        {option.label}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <BottomNav />
    </Box>
  );
};

const DetailMetaRow: React.FC<{
  icon: React.ReactNode;
  value: string;
  styles: ReturnType<typeof useStyles>;
}> = ({ icon, value, styles }) => (
  <Box className={styles.detailsMetaRow}>
    <Box className={styles.detailsMetaIcon}>{icon}</Box>
    <Typography className={styles.detailsMeta}>{value}</Typography>
  </Box>
);
