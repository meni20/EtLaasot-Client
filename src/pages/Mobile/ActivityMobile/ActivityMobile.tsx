import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import { useDataContext } from "../../../contexts/useDataContext";
import activityService from "../../../services/activity.service";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import userService from "../../../services/user.service";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./ActivityMobile.styles";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import {
  formatDateTime,
  formatDurationMinutes,
  getDurationMinutesBetween,
} from "../../../utils/data.utillity";
import type { IVolunteerActivity } from "../../../interfaces/activity.interface";
import type { IMentorAssignment, IEvent } from "../../../interfaces/event.interface";
import type { IUser } from "../../../interfaces/user.interface";

type FeedbackState = { severity: "success" | "error"; message: string } | null;

export const ActivityMobile: React.FC = () => {
  const styles = useStyles();
  const { user } = useAuth();
  const { activeBranch } = useBranch();
  const { events } = useDataContext();
  const queryClient = useQueryClient();

  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedTraineeId, setSelectedTraineeId] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [timerTick, setTimerTick] = useState(Date.now());

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: activeActivity, isLoading: isLoadingActive } =
    useQuery<IVolunteerActivity | null>({
      queryKey: ["activity", "my-active"],
      queryFn: () => activityService.getMyActiveActivity(),
      enabled: !!isVolunteer,
    });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery<
    IVolunteerActivity[]
  >({
    queryKey: ["activity", "my-history"],
    queryFn: () => activityService.getMyHistory(8),
    enabled: !!isVolunteer,
  });

  const { data: yearlySummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["activity", "my-yearly-summary"],
    queryFn: () => activityService.getMyYearlySummary(),
    enabled: !!isVolunteer,
  });

  const { data: assignments = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const { data: allTrainees = [] } = useQuery<IUser[]>({
    queryKey: ["trainees", activeBranch],
    queryFn: () => userService.getAllTrainees(activeBranch ?? undefined),
    enabled: !!isVolunteer && !!activeBranch,
  });

  const startMutation = useMutation({
    mutationFn: () =>
      activityService.startActivity({
        eventId: selectedEventId,
        traineeId: selectedTraineeId,
      }),
    onSuccess: () => {
      setFeedback({ severity: "success", message: "הפעילות התחילה בהצלחה" });
      setNotes("");
      invalidateActivityQueries(queryClient);
    },
    onError: (error: any) => {
      setFeedback({
        severity: "error",
        message:
          error?.response?.data?.message || "לא הצלחנו להתחיל את הפעילות",
      });
    },
  });

  const endMutation = useMutation({
    mutationFn: () => activityService.endActivity(activeActivity!.id, notes),
    onSuccess: () => {
      setFeedback({ severity: "success", message: "הפעילות הסתיימה ונשמרה" });
      setNotes("");
      invalidateActivityQueries(queryClient);
    },
    onError: (error: any) => {
      setFeedback({
        severity: "error",
        message: error?.response?.data?.message || "לא הצלחנו לסיים את הפעילות",
      });
    },
  });

  const sortedEvents = useMemo(
    () => {
      const now = Date.now();
      const upcomingEvents = events.filter(
        (event) => new Date(event.startDate).getTime() >= now,
      );

      return [...upcomingEvents].sort(
        (first, second) =>
          new Date(first.startDate).getTime() - new Date(second.startDate).getTime(),
      );
    },
    [events],
  );

  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.isActive),
    [assignments],
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

    return Array.from(traineeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "he"),
    );
  }, [assignedTrainees, allTrainees]);

  useEffect(() => {
    if (!activeActivity && !selectedEventId && sortedEvents[0]?.id) {
      setSelectedEventId(sortedEvents[0].id);
    }
  }, [activeActivity, selectedEventId, sortedEvents]);

  useEffect(() => {
    if (!activeActivity && !selectedTraineeId && assignedTrainees[0]?.id) {
      setSelectedTraineeId(assignedTrainees[0].id);
    }
  }, [activeActivity, selectedTraineeId, assignedTrainees]);

  useEffect(() => {
    if (!activeActivity) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerTick(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeActivity]);

  const runningDuration = useMemo(() => {
    if (!activeActivity) return null;
    return getDurationMinutesBetween(activeActivity.startTime, new Date(timerTick));
  }, [activeActivity, timerTick]);

  const visibleHistory = useMemo(
    () => history.filter((activity) => activity.id !== activeActivity?.id),
    [history, activeActivity?.id],
  );

  if (!isVolunteer) {
    return (
      <Box className={styles.root}>
        <Alert severity="info">מסך הפעילות זמין למתנדבים בלבד.</Alert>
        <BottomNav />
      </Box>
    );
  }

  return (
    <Box className={styles.root}>
      <Typography className={styles.header}>פעילות באירוע</Typography>
      <Typography className={styles.subheader}>
        התחלה וסיום של השתתפות בפועל, עם שעות שנתיות והיסטוריית פעילויות.
      </Typography>

      {feedback && (
        <Alert
          severity={feedback.severity}
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      <Box className={styles.summaryCard}>
        <Typography className={styles.summaryValue}>
          {isLoadingSummary ? (
            <CircularProgress size={24} sx={{ color: "#9a5188" }} />
          ) : (
            yearlySummary?.formatted ?? "0 דק'"
          )}
        </Typography>
        <Typography className={styles.summaryLabel}>
          סך שעות התנדבות בשנת {yearlySummary?.year ?? new Date().getFullYear()}
        </Typography>
        {!isLoadingSummary && yearlySummary && (
          <Typography className={styles.fieldHint}>
            {yearlySummary.totalHoursDecimal} שעות מצטברות
          </Typography>
        )}
      </Box>

      {isLoadingActive ? (
        <Box className={styles.sectionCard}>
          <CircularProgress size={26} sx={{ color: "#9a5188" }} />
        </Box>
      ) : activeActivity ? (
        <Box className={styles.sectionCard}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography className={styles.sectionTitle}>פעילות פעילה</Typography>
            <Chip color="warning" size="small" label="ACTIVE" />
          </Stack>

          <Stack spacing={1.25}>
            <ActivityDetail
              label="אירוע"
              value={activeActivity.event?.name ?? activeActivity.eventId}
            />
            <ActivityDetail
              label="חניך"
              value={activeActivity.trainee?.name ?? activeActivity.traineeId}
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

          <Typography className={styles.fieldHint}>
            כבר קיימת פעילות פתוחה, לכן אפשר להמשיך ולעדכן רק את הסיום שלה.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            className={styles.actionButton}
            sx={{ bgcolor: "#9a5188", "&:hover": { bgcolor: "#7a3e6b" } }}
            disabled={endMutation.isPending}
            onClick={() => endMutation.mutate()}
          >
            {endMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "סיום פעילות"
            )}
          </Button>
        </Box>
      ) : (
        <Box className={styles.sectionCard}>
          <Typography className={styles.sectionTitle}>התחלת פעילות חדשה</Typography>

          <TextField
            select
            fullWidth
            label="אירוע"
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            sx={{ mb: 2 }}
          >
            {sortedEvents.map((event: IEvent) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}{" "}
                {event.eventType
                  ? `• ${EVENT_TYPES[event.eventType]?.label ?? event.eventType}`
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
                {trainee.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography className={styles.fieldHint}>
            {assignedTrainees[0]
              ? `החניך המשויך ${assignedTrainees[0].name} נבחר כברירת מחדל, ואפשר לעבור לחניך אחר מאותה רשימת הרשאה.`
              : "אין חניך משויך כברירת מחדל, לכן צריך לבחור חניך לפני תחילת הפעילות."}
          </Typography>

          {sortedEvents.length === 0 && (
            <Typography className={styles.empty}>
              אין אירועים זמינים להתחלת פעילות.
            </Typography>
          )}

          {allowedTrainees.length === 0 && (
            <Typography className={styles.empty}>
              אין חניכים זמינים לבחירה כרגע.
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            className={styles.actionButton}
            sx={{ bgcolor: "#9a5188", "&:hover": { bgcolor: "#7a3e6b" } }}
            disabled={
              startMutation.isPending ||
              !selectedEventId ||
              !selectedTraineeId ||
              sortedEvents.length === 0 ||
              allowedTrainees.length === 0
            }
            onClick={() => startMutation.mutate()}
          >
            {startMutation.isPending ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "התחלת פעילות"
            )}
          </Button>
        </Box>
      )}

      <Box className={styles.sectionCard}>
        <Typography className={styles.sectionTitle}>פעילויות אחרונות</Typography>

        {isLoadingHistory ? (
          <CircularProgress size={22} sx={{ color: "#9a5188" }} />
        ) : visibleHistory.length === 0 ? (
          <Typography className={styles.empty}>
            עדיין אין פעילויות שהושלמו השנה או לאחרונה.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {visibleHistory.map((activity) => (
              <Box key={activity.id} className={styles.historyItem}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography className={styles.detailValue}>
                    {activity.event?.name ?? activity.eventId}
                  </Typography>
                  <Chip
                    size="small"
                    color={
                      activity.status === "ACTIVE" ? "warning" : "success"
                    }
                    label={activity.status}
                  />
                </Stack>
                <Typography className={styles.historyMeta}>
                  {activity.trainee?.name ?? activity.traineeId}
                </Typography>
                <Typography className={styles.historyMeta}>
                  {formatDateTime(activity.startTime, activity.timezone)}
                  {activity.endTime
                    ? ` • ${formatDateTime(activity.endTime, activity.timezone)}`
                    : ""}
                </Typography>
                <Typography className={styles.historyMeta}>
                  משך:{" "}
                  {activity.durationFormatted ??
                    formatDurationMinutes(activity.durationMinutes)}
                </Typography>
                {activity.notes && (
                  <Typography className={styles.historyMeta}>
                    הערות: {activity.notes}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <BottomNav />
    </Box>
  );
};

const ActivityDetail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const styles = useStyles();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography className={styles.detailLabel}>{label}</Typography>
      <Typography className={styles.detailValue}>{value}</Typography>
    </Stack>
  );
};

const invalidateActivityQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["activity"] });
  queryClient.invalidateQueries({ queryKey: ["events"] });
  queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
};
