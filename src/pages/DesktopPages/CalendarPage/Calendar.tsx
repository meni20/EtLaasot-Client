import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import heLocale from "@fullcalendar/core/locales/he";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../contexts/useBranch";
import { useDataContext } from "../../../contexts/useDataContext";
import { EventDetailsDialog } from "../../../components/EventDetailsDialog/EventDetailsDialog";
import { useCalendarStyles } from "./Calendar.styles";
import eventService from "../../../services/event.service";
import type { IEvent } from "../../../interfaces/event.interface";
import { EVENT_TYPES } from "../../../constants/auth.const";
import { designTokens } from "../../../theme/tokens";

const MAX_BACKGROUND_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_BACKGROUND_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const HEBREW_DATE_FORMATTER = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
  day: "numeric",
  month: "long",
  timeZone: "Asia/Jerusalem",
});

const MONTH_TITLE_FORMATTER = new Intl.DateTimeFormat("he-IL", {
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jerusalem",
});

const EVENT_COLOR_PALETTE = [
  designTokens.color.primary,
  designTokens.color.primaryHover,
  designTokens.color.brandHover,
  designTokens.color.primaryPressed,
  designTokens.color.brandInk,
];

const EVENT_TYPE_COLORS = Object.fromEntries(
  Object.keys(EVENT_TYPES).map((eventType, index) => [
    eventType,
    EVENT_COLOR_PALETTE[index % EVENT_COLOR_PALETTE.length],
  ]),
) as Record<string, string>;

const HEBREW_DAY_NUMERALS: Record<number, string> = {
  1: "א׳",
  2: "ב׳",
  3: "ג׳",
  4: "ד׳",
  5: "ה׳",
  6: "ו׳",
  7: "ז׳",
  8: "ח׳",
  9: "ט׳",
  10: "י׳",
  11: "י״א",
  12: "י״ב",
  13: "י״ג",
  14: "י״ד",
  15: "ט״ו",
  16: "ט״ז",
  17: "י״ז",
  18: "י״ח",
  19: "י״ט",
  20: "כ׳",
  21: "כ״א",
  22: "כ״ב",
  23: "כ״ג",
  24: "כ״ד",
  25: "כ״ה",
  26: "כ״ו",
  27: "כ״ז",
  28: "כ״ח",
  29: "כ״ט",
  30: "ל׳",
};

const getHebrewDateLabel = (date: Date) => {
  const stableDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12),
  );
  const parts = HEBREW_DATE_FORMATTER.formatToParts(stableDate);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const month = parts.find((part) => part.type === "month")?.value;

  if (!day || !month) {
    return HEBREW_DATE_FORMATTER.format(stableDate);
  }

  return `${HEBREW_DAY_NUMERALS[day] ?? day} ${month}`;
};

const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const CalendarPage: React.FC = () => {
  const { events, isLoading } = useDataContext();
  const { activeBranch, availableBranches } = useBranch();
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | null>(null);
  const [displayedMonthKey, setDisplayedMonthKey] = React.useState(() =>
    toMonthKey(new Date()),
  );
  const [backgroundError, setBackgroundError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const styles = useCalendarStyles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const activeBranchName = React.useMemo(() => {
    const branchName = availableBranches.find(
      (branch) => branch.id === activeBranch,
    )?.name;

    return branchName?.replace(/^סניף\s+/, "") ?? "";
  }, [activeBranch, availableBranches]);

  const backgroundQueryKey = React.useMemo(
    () => ["calendar-background", activeBranch, displayedMonthKey],
    [activeBranch, displayedMonthKey],
  );

  const { data: calendarBackground, isFetching: isFetchingBackground } =
    useQuery({
      queryKey: backgroundQueryKey,
      queryFn: () =>
        eventService.getCalendarMonthBackground(activeBranch!, displayedMonthKey),
      enabled: !!activeBranch,
    });

  const uploadBackgroundMutation = useMutation({
    mutationFn: (image: File) =>
      eventService.uploadCalendarMonthBackground(
        activeBranch!,
        displayedMonthKey,
        image,
      ),
    onSuccess: (updatedBackground) => {
      setBackgroundError("");
      queryClient.setQueryData(backgroundQueryKey, updatedBackground);
    },
    onError: () => {
      setBackgroundError("לא הצלחנו להעלות את תמונת הרקע");
    },
  });

  const removeBackgroundMutation = useMutation({
    mutationFn: () =>
      eventService.removeCalendarMonthBackground(activeBranch!, displayedMonthKey),
    onSuccess: () => {
      setBackgroundError("");
      queryClient.setQueryData(backgroundQueryKey, null);
    },
    onError: () => {
      setBackgroundError("לא הצלחנו להסיר את תמונת הרקע");
    },
  });

  const calendarEvents = events.map((event) => {
    const eventColor = event.eventType
      ? EVENT_TYPE_COLORS[event.eventType]
      : undefined;

    return {
      id: event.id?.toString(),
      title: event.name,
      start: event.startDate,
      end: event.endDate,
      allDay: false,
      backgroundColor: eventColor ?? designTokens.color.primary,
      borderColor: eventColor ?? designTokens.color.primary,
      textColor: "#fff",
      extendedProps: { ...event },
    };
  });

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps as IEvent);
  };

  const handleCloseDialog = () => setSelectedEvent(null);
  const isBackgroundActionPending =
    uploadBackgroundMutation.isPending || removeBackgroundMutation.isPending;

  const handleBackgroundFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_BACKGROUND_IMAGE_TYPES.has(file.type)) {
      setBackgroundError("אפשר להעלות תמונת JPEG, PNG או WebP בלבד");
      return;
    }

    if (file.size > MAX_BACKGROUND_IMAGE_SIZE) {
      setBackgroundError("גודל התמונה חייב להיות עד 5MB");
      return;
    }

    uploadBackgroundMutation.mutate(file);
  };

  const calendarWrapperClassName = calendarBackground?.imageUrl
    ? `${styles.calendarWrapper} ${styles.calendarWrapperWithBackground}`
    : styles.calendarWrapper;

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>לוח שנה</Typography>
        <Box className={styles.headerActions}>
          <input
            ref={fileInputRef}
            className={styles.hiddenFileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBackgroundFileChange}
          />
          <Button
            variant="outlined"
            className={styles.eventsButton}
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            disabled={!activeBranch || isBackgroundActionPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {calendarBackground?.imageUrl ? "החלפת רקע" : "העלאת רקע"}
          </Button>
          {calendarBackground?.imageUrl && (
            <Tooltip title="הסרת רקע החודש">
              <span>
                <IconButton
                  className={styles.removeBackgroundButton}
                  disabled={!activeBranch || isBackgroundActionPending}
                  onClick={() => removeBackgroundMutation.mutate()}
                  aria-label="הסרת רקע החודש"
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Button
            variant="outlined"
            className={styles.eventsButton}
            startIcon={<EventNoteIcon />}
            onClick={() => navigate("/events")}
          >
            אירועים
          </Button>
        </Box>
      </Box>

      {backgroundError && (
        <Alert
          severity="error"
          className={styles.backgroundAlert}
          onClose={() => setBackgroundError("")}
        >
          {backgroundError}
        </Alert>
      )}

      {isLoading ? (
        <Box className={styles.loadingBox}>
          <CircularProgress sx={{ color: "var(--color-primary)" }} />
          <Typography sx={{ mt: 2, color: "var(--color-text-muted, #6e737a)" }}>
            טוען אירועים...
          </Typography>
        </Box>
      ) : (
        <Box
          className={calendarWrapperClassName}
          style={
            calendarBackground?.imageUrl
              ? ({
                  "--calendar-background-image": `url("${calendarBackground.imageUrl}")`,
                } as React.CSSProperties)
              : undefined
          }
        >
          {isFetchingBackground && (
            <Typography className={styles.backgroundLoading}>
              טוען רקע חודש...
            </Typography>
          )}
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={heLocale}
            direction="rtl"
            height="auto"
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "",
            }}
            titleFormat={(dateInfo) => {
              const monthTitle = MONTH_TITLE_FORMATTER.format(
                dateInfo.date.marker,
              );

              return activeBranchName
                ? `${monthTitle}\n• בסניף ${activeBranchName}`
                : monthTitle;
            }}
            dayMaxEvents={3}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            datesSet={(dateInfo) =>
              setDisplayedMonthKey(toMonthKey(dateInfo.view.currentStart))
            }
            dayCellContent={(dayInfo) => (
              <Box className={styles.dayNumberContent}>
                <Typography component="span" className={styles.gregorianDate}>
                  {dayInfo.dayNumberText}
                </Typography>
                <Typography component="span" className={styles.hebrewDate}>
                  {getHebrewDateLabel(dayInfo.date)}
                </Typography>
              </Box>
            )}
            stickyHeaderDates
          />
        </Box>
      )}

      {selectedEvent && (
        <EventDetailsDialog
          open={!!selectedEvent}
          eventData={selectedEvent}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};
