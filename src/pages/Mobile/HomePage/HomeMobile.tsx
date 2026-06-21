import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import activityService from "../../../services/activity.service";
import userService from "../../../services/user.service";
import { useMobileEvents } from "../../../hooks/mobile/useMobileEvents";
import { EventSummaryCard } from "../../../components/mobile/EventSummaryCard";
import {
  formatDateTime,
  formatDurationMinutes,
  getDurationMinutesBetween,
} from "../../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./HomeMobile.styles";
import type { IVolunteerActivity } from "../../../interfaces/activity.interface";
import type {
  AttendanceIntent,
  IEvent,
  IMentorAssignment,
} from "../../../interfaces/event.interface";
import type { IUser } from "../../../interfaces/user.interface";

type FeedbackState = { severity: "success" | "error"; message: string } | null;

export const HomeMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranch();
  const queryClient = useQueryClient();
  const { upcomingEvents } = useMobileEvents();

  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [selectedUpcomingEventIndex, setSelectedUpcomingEventIndex] =
    useState(0);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedTraineeId, setSelectedTraineeId] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [timerTick, setTimerTick] = useState(Date.now());

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const { data: activeActivity, isLoading: isLoadingActiveActivity } =
    useQuery<IVolunteerActivity | null>({
      queryKey: ["activity", "my-active"],
      queryFn: () => activityService.getMyActiveActivity(),
      enabled: !!isVolunteer,
    });

  const { data: allTrainees = [] } = useQuery<IUser[]>({
    queryKey: ["trainees", activeBranch],
    queryFn: () => userService.getAllTrainees(activeBranch ?? undefined),
    enabled: !!isVolunteer && !!activeBranch,
  });

  const startActivityMutation = useMutation({
    mutationFn: () =>
      activityService.startActivity({
        eventId: selectedEventId,
        traineeId: selectedTraineeId,
      }),
    onSuccess: () => {
      setFeedback({
        severity: "success",
        message: "הפעילות התחילה בהצלחה",
      });
      setNotes("");
      setIsActivityPanelOpen(false);
      invalidateActivityQueries(queryClient, selectedEventId);
    },
    onError: (error: any) => {
      setFeedback({
        severity: "error",
        message:
          decodeUnicodeEscapes(error?.response?.data?.message) ||
          "לא הצלחנו להתחיל את הפעילות",
      });
    },
  });

  const endActivityMutation = useMutation({
    mutationFn: () => activityService.endActivity(activeActivity!.id, notes),
    onSuccess: () => {
      setFeedback({
        severity: "success",
        message: "הפעילות הסתיימה ונשמרה",
      });
      setNotes("");
      invalidateActivityQueries(queryClient, activeActivity?.eventId);
    },
    onError: (error: any) => {
      setFeedback({
        severity: "error",
        message:
          decodeUnicodeEscapes(error?.response?.data?.message) ||
          "לא הצלחנו לסיים את הפעילות",
      });
    },
  });

  const activeAssignment = myTrainees.find((assignment) => assignment.isActive);

  const activeAssignments = useMemo(
    () => myTrainees.filter((assignment) => assignment.isActive),
    [myTrainees],
  );

  const assignedTrainees = useMemo(
    () =>
      activeAssignments
        .map((assignment) => assignment.trainee)
        .filter((trainee): trainee is IUser => !!trainee),
    [activeAssignments],
  );

  const allowedTrainees = useMemo(() => {
    const traineeMap = new Map<string, IUser>();

    [...assignedTrainees, ...allTrainees].forEach((trainee) => {
      if (!trainee?.id) return;
      traineeMap.set(trainee.id, trainee);
    });

    return Array.from(traineeMap.values()).sort((first, second) =>
      first.name.localeCompare(second.name, "he"),
    );
  }, [assignedTrainees, allTrainees]);

  useEffect(() => {
    if (!activeActivity && !selectedEventId && upcomingEvents[0]?.id) {
      setSelectedEventId(upcomingEvents[0].id);
    }
  }, [activeActivity, selectedEventId, upcomingEvents]);

  useEffect(() => {
    if (!activeActivity && !selectedTraineeId && assignedTrainees[0]?.id) {
      setSelectedTraineeId(assignedTrainees[0].id);
    }
  }, [activeActivity, selectedTraineeId, assignedTrainees]);

  useEffect(() => {
    if (!activeActivity) return;

    const intervalId = window.setInterval(() => {
      setTimerTick(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeActivity]);

  useEffect(() => {
    setSelectedUpcomingEventIndex((currentIndex) => {
      if (upcomingEvents.length === 0) return 0;
      return currentIndex >= upcomingEvents.length ? 0 : currentIndex;
    });
  }, [upcomingEvents.length]);

  const runningDuration = useMemo(() => {
    if (!activeActivity) return null;
    return getDurationMinutesBetween(
      activeActivity.startTime,
      new Date(timerTick),
    );
  }, [activeActivity, timerTick]);

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

  const selectedUpcomingEvent =
    upcomingEvents[selectedUpcomingEventIndex] ?? null;
  const selectedUpcomingEventIntent = selectedUpcomingEvent
    ? getAttendanceIntent(selectedUpcomingEvent)
    : "NONE";
  const canBrowseUpcomingEvents = upcomingEvents.length > 1;

  const handleUpcomingEventStep = (
    event: React.MouseEvent<HTMLButtonElement>,
    direction: -1 | 1,
  ) => {
    event.stopPropagation();
    setSelectedUpcomingEventIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= upcomingEvents.length) {
        return currentIndex;
      }
      return nextIndex;
    });
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.headerRow}>
        <Box>
          <Typography className={styles.greeting}>
            שלום, {decodeUnicodeEscapes(user?.name)}
          </Typography>
          <Typography className={styles.subtitle}>
            מה קורה השבוע בסניף
          </Typography>
        </Box>
        <Button
          className={styles.profileButton}
          onClick={() => navigate("/profile")}
          aria-label="פרופיל"
        >
          <Avatar className={styles.profileAvatar}>
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </Avatar>
        </Button>
      </Box>

      {feedback && (
        <Alert
          severity={feedback.severity}
          sx={{ mb: 2.5, borderRadius: "16px" }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {selectedUpcomingEvent && (
        <Box className={styles.eventCarousel}>
          <Box className={styles.eventCarouselRow}>
            {canBrowseUpcomingEvents && (
              <IconButton
                className={styles.eventCarouselArrow}
                aria-label="האירוע הקודם"
                disabled={selectedUpcomingEventIndex === 0}
                onClick={(event) => handleUpcomingEventStep(event, -1)}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
            <Box className={styles.eventCarouselCard}>
              <EventSummaryCard
                event={selectedUpcomingEvent}
                attendanceIntent={selectedUpcomingEventIntent}
                onClick={() =>
                  selectedUpcomingEvent.id &&
                  navigate(`/events/${selectedUpcomingEvent.id}`)
                }
              />
            </Box>
            {canBrowseUpcomingEvents && (
              <IconButton
                className={styles.eventCarouselArrow}
                aria-label="האירוע הבא"
                disabled={selectedUpcomingEventIndex === upcomingEvents.length - 1}
                onClick={(event) => handleUpcomingEventStep(event, 1)}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
          {canBrowseUpcomingEvents && (
            <Typography className={styles.eventCarouselIndicator}>
              {selectedUpcomingEventIndex + 1} / {upcomingEvents.length}
            </Typography>
          )}
        </Box>
      )}

      {isVolunteer && (
        <Box className={styles.eventItem}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography className={styles.eventItemName}>
                {activeActivity
                  ? "יש פעילות פתוחה"
                  : "ניהול פעילות"}
              </Typography>
              <Typography className={styles.eventItemDate}>
                {activeActivity
                  ? `${decodeUnicodeEscapes(activeActivity.event?.name) || "אירוע"} • ${formatDateTime(
                      activeActivity.startTime,
                      activeActivity.timezone,
                    )}`
                  : "התחלה וסיום של פעילות מתנדב בתוך אירוע"}
              </Typography>
            </Box>
            {activeActivity && (
              <Chip
                size="small"
                label="ACTIVE"
                color="warning"
                className={styles.typeChip}
              />
            )}
          </Stack>

          {isLoadingActiveActivity ? (
            <Box sx={{ mt: 1.5 }}>
              <CircularProgress size={22} sx={{ color: "#7B3F98" }} />
            </Box>
          ) : activeActivity ? (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={1.25}>
                <ActivityDetail
                  label="אירוע"
                  value={
                    decodeUnicodeEscapes(activeActivity.event?.name) ||
                    activeActivity.eventId
                  }
                />
                <ActivityDetail
                  label="חניך"
                  value={
                    decodeUnicodeEscapes(activeActivity.trainee?.name) ||
                    activeActivity.traineeId
                  }
                />
                <ActivityDetail
                  label="התחלה"
                  value={formatDateTime(
                    activeActivity.startTime,
                    activeActivity.timezone,
                  )}
                />
                <ActivityDetail
                  label="משך נוכחי"
                  value={formatDurationMinutes(runningDuration)}
                />
              </Stack>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="הערות לסיום"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                sx={{ mt: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 1.5,
                  bgcolor: "#FCEEEF",
                  color: "#B42318",
                  border: "1px solid #F7D4D6",
                  fontWeight: 700,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#F9DCDD", boxShadow: "none" },
                }}
                disabled={endActivityMutation.isPending}
                onClick={() => endActivityMutation.mutate()}
              >
                {endActivityMutation.isPending ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "סיום פעילות"
                )}
              </Button>
            </Box>
          ) : (
            <>
              <Button
                size="small"
                variant="contained"
                onClick={() => setIsActivityPanelOpen((open) => !open)}
                sx={{
                  mt: 1.5,
                  bgcolor: "#7B3F98",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "14px",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(123, 63, 152, 0.22)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  "&:hover": {
                    bgcolor: "#6D3588",
                    boxShadow: "0 6px 16px rgba(123, 63, 152, 0.26)",
                  },
                  "&:active": { transform: "scale(0.98)" },
                }}
              >
                {isActivityPanelOpen
                  ? "סגור"
                  : "התחלת פעילות"}
              </Button>

              {isActivityPanelOpen && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="אירוע"
                    value={selectedEventId}
                    onChange={(event) => setSelectedEventId(event.target.value)}
                    sx={{ mb: 2 }}
                  >
                    {upcomingEvents.map((event: IEvent) => (
                      <MenuItem key={event.id} value={event.id}>
                        {decodeUnicodeEscapes(event.name)}{" "}
                        {event.eventType
                          ? `• ${
                              decodeUnicodeEscapes(
                                EVENT_TYPES[event.eventType]?.label,
                              ) ||
                              event.eventType
                            }`
                          : ""}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="חניך"
                    value={selectedTraineeId}
                    onChange={(event) => setSelectedTraineeId(event.target.value)}
                  >
                    {allowedTrainees.map((trainee) => (
                      <MenuItem key={trainee.id} value={trainee.id}>
                        {decodeUnicodeEscapes(trainee.name)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Typography sx={{ mt: 1.25, fontSize: 12, color: "#6B7280" }}>
                    {assignedTrainees[0]
                      ? `החניך המשויך ${decodeUnicodeEscapes(
                          assignedTrainees[0].name,
                        )} נבחר כברירת מחדל, ואפשר לעבור לחניך אחר מרשימת ההרשאה.`
                      : "אין חניך משויך כברירת מחדל, לכן צריך לבחור חניך לפני תחילת הפעילות."}
                  </Typography>

                  {upcomingEvents.length === 0 && (
                    <Typography sx={{ mt: 1.25, fontSize: 12, color: "#6B7280" }}>
                      אין אירועים זמינים להתחלת פעילות.
                    </Typography>
                  )}

                  {allowedTrainees.length === 0 && (
                    <Typography sx={{ mt: 1.25, fontSize: 12, color: "#6B7280" }}>
                      אין חניכים זמינים לבחירה כרגע.
                    </Typography>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: "#7B3F98",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: "14px",
                      textTransform: "none",
                      boxShadow: "0 4px 12px rgba(123, 63, 152, 0.22)",
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                      "&:hover": {
                        bgcolor: "#6D3588",
                        boxShadow: "0 6px 16px rgba(123, 63, 152, 0.26)",
                      },
                      "&:active": { transform: "scale(0.98)" },
                    }}
                    disabled={
                      startActivityMutation.isPending ||
                      !selectedEventId ||
                      !selectedTraineeId ||
                      upcomingEvents.length === 0 ||
                      allowedTrainees.length === 0
                    }
                    onClick={() => startActivityMutation.mutate()}
                  >
                    {startActivityMutation.isPending ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "התחלת פעילות"
                    )}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      )}

      <BottomNav />
    </Box>
  );
};

const ActivityDetail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
        {decodeUnicodeEscapes(label)}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#1F1F1F", fontWeight: 700 }}>
        {decodeUnicodeEscapes(value)}
      </Typography>
    </Stack>
  );
};

const invalidateActivityQueries = (queryClient: QueryClient, eventId?: string) => {
  queryClient.invalidateQueries({ queryKey: ["activity"] });
  queryClient.invalidateQueries({ queryKey: ["activities"] });
  queryClient.invalidateQueries({ queryKey: ["events"] });
  if (eventId) {
    queryClient.invalidateQueries({
      queryKey: ["activity", "event-attendance", eventId],
    });
  }
};

