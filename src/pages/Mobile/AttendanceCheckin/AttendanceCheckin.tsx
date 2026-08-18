import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import eventService from "../../../services/event.service";
import attendeeService from "../../../services/attendee.service";
import { useStyles } from "./AttendanceCheckin.styles";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import type { IAttendees } from "../../../interfaces/event.interface";

export const AttendanceCheckinPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { data: attendees = [], isLoading } = useQuery<IAttendees[]>({
    queryKey: ["eventAttendees", eventId],
    queryFn: () => eventService.getEventAttendees(eventId!),
    enabled: !!eventId,
  });

  useEffect(() => {
    if (!initialized && attendees.length > 0) {
      const initialChecked = new Set<string>();
      attendees.forEach((a) => {
        if (a.checkedIn && a.id) initialChecked.add(a.id);
      });
      if (initialChecked.size > 0) {
        setCheckedIds(initialChecked);
      }
      setInitialized(true);
    }
  }, [attendees, initialized]);

  const checkInMutation = useMutation({
    mutationFn: (attendeeId: string) => attendeeService.checkIn(attendeeId),
  });

  const toggleChecked = (attendeeId: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(attendeeId)) next.delete(attendeeId);
      else next.add(attendeeId);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const promises = attendees
      .filter((a) => a.id && checkedIds.has(a.id) && !a.checkedIn)
      .map((a) => checkInMutation.mutateAsync(a.id!));

    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
    setSaving(false);
  };

  return (
    <Box className={styles.root}>
      <Button
        className={styles.backButton}
        startIcon={<ArrowForwardIcon />}
        onClick={() => navigate(-1)}
      >
        חזרה
      </Button>

      <Typography className={styles.header}>רישום נוכחות</Typography>
      <Typography className={styles.subtitle}>
        סמנו את החניכים שהגיעו לאירוע
      </Typography>

      {isLoading ? (
        <Box className={styles.loading}>
          <CircularProgress
            size={28}
            sx={{ color: "var(--color-primary, #2f6f61)" }}
          />
        </Box>
      ) : (
        <Stack spacing={1}>
          {attendees.map((attendee) => {
            const isChecked = attendee.id ? checkedIds.has(attendee.id) : false;
            const user = attendee.user;
            return (
              <Box
                key={attendee.id ?? attendee.userId}
                className={`${styles.attendeeRow} ${isChecked ? styles.checkedIn : ""}`}
                onClick={() => attendee.id && toggleChecked(attendee.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isChecked}
                aria-label={`סימון נוכחות עבור ${
                  decodeUnicodeEscapes(user?.name) || attendee.userId
                }`}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && attendee.id) {
                    event.preventDefault();
                    toggleChecked(attendee.id);
                  }
                }}
                sx={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox
                    checked={isChecked}
                    sx={{
                      color: "var(--color-primary, #2f6f61)",
                      "&.Mui-checked": {
                        color: "var(--color-success, #2e7d32)",
                      },
                      p: 0,
                    }}
                  />
                  <Typography className={styles.attendeeName}>
                    {decodeUnicodeEscapes(user?.name) || attendee.userId}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      {attendees.length > 0 && (
        <Button
          fullWidth
          variant="contained"
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving || checkedIds.size === 0}
          sx={{
            bgcolor: "var(--color-primary, #2f6f61)",
            "&:hover": { bgcolor: "var(--color-primary-dark, #285e52)" },
          }}
        >
          {saving ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : (
            `שמור נוכחות (${checkedIds.size}/${attendees.length})`
          )}
        </Button>
      )}
    </Box>
  );
};
