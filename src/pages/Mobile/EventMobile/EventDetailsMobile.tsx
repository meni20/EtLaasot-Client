import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { useMobileEvents } from "../../../hooks/mobile/useMobileEvents";
import { formatDate } from "../../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import { AUTH_ROLES, EVENT_TYPES } from "../../../constants/auth.const";
import attendeeService from "../../../services/attendee.service";
import { useStyles } from "./EventMobile.styles";
import type { AttendanceIntent, IEvent } from "../../../interfaces/event.interface";

const ATTENDANCE_OPTIONS: {
  intent: AttendanceIntent;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    intent: "VOLUNTEER_ONLY",
    label: "מגיע",
    icon: <CheckCircleOutlineIcon fontSize="inherit" />,
  },
  {
    intent: "NONE",
    label: "לא מגיע",
    icon: <EventBusyOutlinedIcon fontSize="inherit" />,
  },
];

const TRAINEE_ATTENDANCE_OPTIONS: {
  intent: AttendanceIntent;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    intent: "TRAINEE_ONLY",
    label: "מגיע",
    icon: <CheckCircleOutlineIcon fontSize="inherit" />,
  },
  {
    intent: "NONE",
    label: "לא מגיע",
    icon: <EventBusyOutlinedIcon fontSize="inherit" />,
  },
];

const ATTENDANCE_STATUS_LABELS: Record<AttendanceIntent, string> = {
  BOTH: "נרשמת",
  VOLUNTEER_ONLY: "נרשמת",
  TRAINEE_ONLY: "נרשמת",
  NONE: "לא נרשמת עדיין",
};

const formatTime = (date: Date | string) => {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";
  return `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;
};

const getImageExtension = (contentType: string) => {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return extensions[contentType.toLowerCase()] ?? "jpg";
};

const getSafeImageFilename = (eventName: string, contentType: string) => {
  const safeName = decodeUnicodeEscapes(eventName)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  return `${safeName || "event-image"}.${getImageExtension(contentType)}`;
};

export const EventDetailsMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const { allEvents } = useMobileEvents();
  const { user } = useAuth();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const event = allEvents.find((currentEvent) => currentEvent.id === eventId);

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );
  const isTrainee = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.TRAINEE.id,
  );
  const useTraineeRsvp = Boolean(isTrainee && !isVolunteer);
  const canUpdateAttendanceIntent = Boolean(isVolunteer || isTrainee);

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

  const getAttendanceIntent = (currentEvent: IEvent): AttendanceIntent => {
    const userAttends =
      currentEvent.attendees?.some(
        (attendee) => attendee.userId === user?.userId,
      ) ?? false;

    if (!userAttends) return "NONE";
    return useTraineeRsvp ? "TRAINEE_ONLY" : "VOLUNTEER_ONLY";
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
  const visibleAttendanceOptions = useTraineeRsvp
    ? TRAINEE_ATTENDANCE_OPTIONS
    : ATTENDANCE_OPTIONS;
  const hasImageBackground = Boolean(event?.imageUrl);

  const handleOpenImageViewer = () => {
    setImageLoadFailed(false);
    setDownloadError(false);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  const handleDownloadImage = async () => {
    if (!event?.imageUrl || isDownloadingImage) return;

    setIsDownloadingImage(true);
    setDownloadError(false);

    try {
      const response = await fetch(event.imageUrl);
      if (!response.ok) throw new Error("Image download failed");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = getSafeImageFilename(event.name, blob.type);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setDownloadError(true);

      const fallbackLink = document.createElement("a");
      fallbackLink.href = event.imageUrl;
      fallbackLink.download = getSafeImageFilename(event.name, "image/jpeg");
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } finally {
      setIsDownloadingImage(false);
    }
  };

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
        {event?.imageUrl ? (
          <IconButton
            className={styles.detailsImageButton}
            onClick={handleOpenImageViewer}
            aria-label="הצגת תמונת האירוע"
          >
            <ImageOutlinedIcon />
          </IconButton>
        ) : (
          <Box />
        )}
      </Box>

      {!event ? (
        <Typography className={styles.empty}>האירוע לא נמצא</Typography>
      ) : (
        <Box
          className={`${styles.detailsCard} ${
            hasImageBackground ? styles.detailsCardWithImage : ""
          }`}
          style={
            hasImageBackground
              ? { backgroundImage: `url("${event.imageUrl}")` }
              : undefined
          }
        >
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

          {canUpdateAttendanceIntent && (
            <Box className={styles.rsvpRow}>
              <Box className={styles.rsvpHeader}>
                <Box>
                  <Typography className={styles.rsvpTitle}>
                    מי מגיע לאירוע?
                  </Typography>
                  <Typography className={styles.rsvpStatus}>
                    {ATTENDANCE_STATUS_LABELS[selectedIntent]}
                  </Typography>
                </Box>
              </Box>
              <Box className={styles.rsvpGrid}>
                {visibleAttendanceOptions.map((option) => {
                  const isSelected = selectedIntent === option.intent;

                  return (
                    <Button
                      key={option.intent}
                      variant="outlined"
                      className={styles.rsvpOptionCard}
                      aria-pressed={isSelected}
                      aria-label={`${option.label} - ${ATTENDANCE_STATUS_LABELS[option.intent]}`}
                      onClick={() => handleAttendanceIntent(event, option.intent)}
                      disabled={attendanceIntentMutation.isPending}
                      sx={{
                        bgcolor: isSelected
                          ? "var(--color-primary, #2f6f61)"
                          : "var(--color-surface, #fff)",
                        borderColor: isSelected
                          ? "var(--color-primary, #2f6f61)"
                          : "var(--color-border, #dadde3)",
                        color: isSelected ? "#fff" : "var(--color-text, #1d1d1f)",
                        boxShadow: isSelected
                          ? "0 6px 16px rgba(47, 111, 97, 0.22)"
                          : "none",
                        "&:hover": {
                          bgcolor: isSelected
                            ? "var(--color-primary-dark, #285e52)"
                            : "var(--color-primary-soft, #eaf4f1)",
                          borderColor: "var(--color-primary, #2f6f61)",
                          boxShadow: isSelected
                            ? "0 6px 16px rgba(47, 111, 97, 0.22)"
                            : "none",
                        },
                        "&.Mui-disabled": {
                          color: isSelected
                            ? "#fff"
                            : "var(--color-text-muted, #6e737a)",
                          borderColor: isSelected
                            ? "var(--color-primary, #2f6f61)"
                            : "var(--color-border, #dadde3)",
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

      {event?.imageUrl && (
        <Dialog
          open={isImageViewerOpen}
          onClose={handleCloseImageViewer}
          fullScreen
          aria-labelledby="event-image-viewer-title"
          PaperProps={{ className: styles.imageViewerPaper }}
        >
          <Box className={styles.imageViewerHeader}>
            <Typography
              id="event-image-viewer-title"
              className={styles.imageViewerTitle}
            >
              {decodeUnicodeEscapes(event.name)}
            </Typography>
            <IconButton
              className={styles.imageViewerCloseButton}
              onClick={handleCloseImageViewer}
              aria-label="סגירת תמונת האירוע"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box className={styles.imageViewerContent}>
            {imageLoadFailed ? (
              <Box className={styles.imageViewerError} role="alert">
                <BrokenImageOutlinedIcon className={styles.imageViewerErrorIcon} />
                <Typography>לא הצלחנו לטעון את התמונה</Typography>
              </Box>
            ) : (
              <img
                src={event.imageUrl}
                alt={`תמונה עבור ${decodeUnicodeEscapes(event.name)}`}
                className={styles.imageViewerImage}
                onError={() => setImageLoadFailed(true)}
              />
            )}
          </Box>

          <Box className={styles.imageViewerActions}>
            <Button
              variant="contained"
              className={styles.imageDownloadButton}
              startIcon={
                isDownloadingImage ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DownloadOutlinedIcon />
                )
              }
              onClick={handleDownloadImage}
              disabled={isDownloadingImage || imageLoadFailed}
            >
              שמירה לגלריה
            </Button>
            {downloadError && (
              <Typography className={styles.imageDownloadHint} role="status">
                התמונה נפתחה בחלון חדש. ניתן לשמור אותה משם.
              </Typography>
            )}
          </Box>
        </Dialog>
      )}
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
