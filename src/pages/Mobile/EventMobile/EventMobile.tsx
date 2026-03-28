import { useMemo } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../contexts/useBranch";
import { useDataContext } from "../../../contexts/useDataContext";
import { formatDate } from "../../../utils/data.utillity";
import { EVENT_TYPES } from "../../../constants/auth.const";
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
              const rsvpStatus = event.attendees?.[0]?.rsvpStatus;
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

                  {rsvpStatus === "confirmed" ? (
                    <Chip
                      size="small"
                      label="✅ מאושר"
                      color="success"
                      className={styles.rsvpBadge}
                      sx={{ mt: 1 }}
                    />
                  ) : rsvpStatus === "declined" ? (
                    <Chip
                      size="small"
                      label="❌ לא מגיע"
                      color="error"
                      className={styles.rsvpBadge}
                      sx={{ mt: 1 }}
                    />
                  ) : null}

                  {event.attendees && event.attendees.length > 0 && (
                    <Button
                      size="small"
                      variant="text"
                      sx={{
                        mt: 1,
                        fontSize: 12,
                        color: "#9a5188",
                        textTransform: "none",
                      }}
                      onClick={() => navigate(`/events/${event.id}/attendance`)}
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
