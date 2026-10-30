import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import eventService from "../../../services/event.service";
import attendeeService from "../../../services/attendee.service";
import { useStyles } from "./AttendanceCheckin.styles";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import type { IAttendees } from "../../../interfaces/event.interface";
import { saveAttendance } from "../../../utils/attendance-save";
import { apiErrorMessage } from "../../../utils/api-error";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import { useReloadGuard } from "../../../hooks/useReloadGuard";

export const AttendanceCheckinPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, sessionId } = useAuth();
  const { activeBranch } = useBranch();
  // Reset pending selections and successful acknowledgments on event changes.
  return (
    <AttendanceForm
      key={`${eventId}:${user?.userId}:${sessionId}:${activeBranch}`}
      eventId={eventId}
    />
  );
};
function AttendanceForm({ eventId }: { eventId?: string }) {
  const styles = useStyles(),
    navigate = useNavigate(),
    queryClient = useQueryClient();
  const { user, sessionId } = useAuth();
  const { activeBranch } = useBranch();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);
  const queryKey = [
    "eventAttendees",
    eventId,
    user?.userId,
    sessionId,
    activeBranch,
  ];
  const query = useQuery<IAttendees[]>({
    queryKey,
    queryFn: () => eventService.getEventAttendees(eventId!),
    enabled: !!eventId,
  });
  const attendees = query.data ?? [];
  // Mirrors the existing server restriction; it does not grant any permission.
  const canCheckIn =
    user?.roles?.some(
      (r) =>
        r.roleId === 10001 ||
        (r.roleId === 10000 && r.branchId === activeBranch),
    ) ?? false;
  const isSaved = (a: IAttendees) =>
    !!a.checkedIn || (!!a.id && acknowledged.has(a.id));
  const pending = attendees.filter(
    (a) => a.id && selected.has(a.id) && !isSaved(a),
  );
  useReloadGuard(
    saving || pending.length > 0,
    "יש לשמור את סימוני הנוכחות לפני העדכון.",
  );
  const handleSave = async () => {
    if (busy.current || !canCheckIn || !pending.length) return;
    busy.current = true;
    setSaving(true);
    setFeedback(null);
    try {
      const result = await saveAttendance(
        pending.map((a) => a.id!),
        (id) => attendeeService.checkIn(id),
      );
      setAcknowledged((previous) => new Set([...previous, ...result.saved]));
      // Acknowledge each success immediately, independently of the refetch.
      queryClient.setQueryData<IAttendees[]>(queryKey, (current) =>
        current?.map((a) =>
          a.id && result.saved.includes(a.id) ? { ...a, checkedIn: true } : a,
        ),
      );
      if (result.failed.length) {
        setFeedback({
          severity: "error",
          message: `נשמרו ${result.saved.length} סימונים. סימונים ללא אישור שמירה: ${result.failed.length}. ${apiErrorMessage(result.errors[0], "הבחירה נשמרה במסך. נסו שוב כדי לשמור את הסימונים שנותרו.")}`,
        });
      } else
        setFeedback({ severity: "success", message: "הנוכחות נשמרה בהצלחה." });
      void queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      setFeedback({
        severity: "error",
        message: apiErrorMessage(
          error,
          "לא ניתן לאשר שהנוכחות נשמרה. הבחירה נשמרה במסך; נסו שוב.",
        ),
      });
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  // A lost HTTP response is not proof that the write failed. A later read can
  // confirm every selected row without a duplicate check-in request.
  const confirmed =
    !saving &&
    !query.isError &&
    selected.size > 0 &&
    [...selected].every((id) =>
      attendees.some((a) => a.id === id && isSaved(a)),
    );
  const visibleFeedback =
    feedback?.severity === "error" && confirmed
      ? { severity: "success" as const, message: "הנוכחות נשמרה ואושרה." }
      : feedback;
  return (
    <Box className={styles.root} dir="rtl" aria-busy={saving}>
      <Button
        className={styles.backButton}
        startIcon={<ArrowForwardIcon />}
        onClick={() => navigate(-1)}
      >
        חזרה
      </Button>
      <Typography className={styles.header}>רישום נוכחות</Typography>
      {!canCheckIn && (
        <Alert severity="info">
          צפייה בלבד. סימון נוכחות זמין למנהלי הסניף בלבד.
        </Alert>
      )}
      {query.isLoading && (
        <Stack role="status" alignItems="center" p={3}>
          <CircularProgress aria-label="טוען נוכחות" />
        </Stack>
      )}
      {query.isError && (
        <Alert
          severity="error"
          action={
            <Button
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              ניסיון נוסף
            </Button>
          }
        >
          לא ניתן לטעון את הנוכחות. הבחירה נשמרה במסך.
        </Alert>
      )}
      {!query.isLoading && !query.isError && !attendees.length && (
        <Typography>אין משתתפים להצגה.</Typography>
      )}
      <Stack spacing={1}>
        {attendees.map((a) => {
          const saved = isSaved(a),
            name = decodeUnicodeEscapes(a.user?.name) || a.userId;
          return (
            <Box
              key={a.id ?? a.userId}
              className={`${styles.attendeeRow} ${saved || (a.id && selected.has(a.id)) ? styles.checkedIn : ""}`}
            >
              <FormControlLabel
                sx={{
                  m: 0,
                  width: "100%",
                  minHeight: 44,
                  "& .MuiFormControlLabel-label.Mui-disabled": {
                    color: "text.primary",
                  },
                }}
                control={
                  <Checkbox
                    checked={saved || (!!a.id && selected.has(a.id))}
                    disabled={saved || saving || !canCheckIn || !a.id}
                    onChange={(_, checked) => {
                      if (!a.id) return;
                      setSelected((previous) => {
                        const next = new Set(previous);
                        if (checked) next.add(a.id!);
                        else next.delete(a.id!);
                        return next;
                      });
                      setFeedback(null);
                    }}
                  />
                }
                label={
                  <span>
                    {name}
                    {saved ? " · נוכחות נשמרה (לקריאה בלבד)" : ""}
                  </span>
                }
              />
            </Box>
          );
        })}
      </Stack>
      {visibleFeedback && (
        <Alert severity={visibleFeedback.severity} role="status" sx={{ mt: 2 }}>
          {visibleFeedback.message}
        </Alert>
      )}
      {canCheckIn && attendees.length > 0 && (
        <Button
          fullWidth
          variant="contained"
          className={styles.saveButton}
          disabled={saving || !pending.length || query.isError}
          onClick={() => void handleSave()}
        >
          {saving ? (
            <>
              <CircularProgress
                size={20}
                aria-label="שומר נוכחות"
                color="inherit"
              />{" "}
              שומר…
            </>
          ) : (
            `שמירת נוכחות (${pending.length})`
          )}
        </Button>
      )}
    </Box>
  );
}
