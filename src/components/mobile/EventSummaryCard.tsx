import { Box, Chip, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { EVENT_TYPES } from "../../constants/auth.const";
import { formatDate } from "../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../utils/text.util";
import type {
  AttendanceIntent,
  IEvent,
} from "../../interfaces/event.interface";

interface EventSummaryCardProps {
  event: IEvent;
  attendanceIntent: AttendanceIntent;
  onClick?: () => void;
  showChevron?: boolean;
  featured?: boolean;
}

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

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({
  event,
  attendanceIntent,
  onClick,
  showChevron = true,
  featured = false,
}) => {
  const isRegistered = attendanceIntent !== "NONE";
  const eventType = event.eventType ? EVENT_TYPES[event.eventType] : undefined;
  const eventName = decodeUnicodeEscapes(event.name);
  const eventAddress = decodeUnicodeEscapes(event.address);
  const hasImageBackground = Boolean(event.imageUrl);

  return (
    <Box
      onClick={onClick}
      onKeyDown={(keyboardEvent) => {
        if (!onClick) return;
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${eventName}, ${formatDate(event.startDate)}, ${
        ATTENDANCE_STATUS_LABELS[attendanceIntent]
      }`}
      sx={{
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        minHeight: featured ? "66dvh" : 196,
        borderRadius: "var(--radius-xl, 22px)",
        p: featured ? 3 : 2.5,
        backgroundColor: hasImageBackground ? "#252027" : "#fff",
        backgroundImage: hasImageBackground
          ? `linear-gradient(180deg, rgba(12, 15, 18, 0.46) 0%, rgba(12, 15, 18, 0.62) 100%), url("${event.imageUrl}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: hasImageBackground
          ? "1px solid rgba(255, 255, 255, 0.18)"
          : "1px solid var(--color-border-subtle, #e9ebef)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
        cursor: onClick ? "pointer" : "default",
        transition:
          "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease)",
        "&:active": onClick ? { transform: "scale(0.98)" } : undefined,
        "&:hover": onClick
          ? {
              transform: "translateY(-1px)",
              boxShadow: "var(--shadow-md, 0 12px 34px rgba(16,24,40,0.10))",
              borderColor: hasImageBackground
                ? "rgba(255, 255, 255, 0.3)"
                : "var(--color-border, #dadde3)",
            }
          : undefined,
        "&:focus-visible": onClick
          ? {
              outline: "none",
              boxShadow:
                "0 0 0 3px rgba(var(--color-primary-rgb), 0.24), var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
            }
          : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1}
        sx={{
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          minHeight: featured ? "calc(66dvh - 48px)" : 0,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
            alignSelf: featured ? "stretch" : "auto",
            display: featured ? "flex" : "block",
            flexDirection: featured ? "column" : undefined,
            alignItems: featured ? "flex-start" : undefined,
          }}
        >
          {eventType && (
            <Chip
              size="small"
              label={`${eventType.icon} ${decodeUnicodeEscapes(eventType.label)}`}
              sx={{
                alignSelf: featured ? "flex-start" : undefined,
                height: featured ? 28 : 24,
                borderRadius: "999px",
                backgroundColor: hasImageBackground
                  ? "rgba(255, 255, 255, 0.92)"
                  : "var(--color-brand-soft)",
                color: hasImageBackground
                  ? "var(--color-brand)"
                  : "var(--color-brand)",
                border: "1px solid rgba(var(--color-brand-rgb), 0.18)",
                fontSize: featured ? 12 : 11,
                fontWeight: 800,
              }}
            />
          )}

          <Typography
            sx={{
              mt: eventType ? (featured ? 1.75 : 1) : 0,
              fontWeight: featured ? 800 : 700,
              fontSize: featured ? 22 : 16,
              lineHeight: featured ? 1.3 : 1.4,
              overflowWrap: "anywhere",
              color: hasImageBackground ? "#fff" : "var(--color-text, #1d1d1f)",
              textShadow: hasImageBackground
                ? "0 1px 4px rgba(0, 0, 0, 0.55)"
                : "none",
            }}
          >
            {eventName}
          </Typography>

          {featured ? (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gap: 1,
                p: 1.5,
                width: "fit-content",
                maxWidth: "100%",
                alignSelf: "flex-start",
                borderRadius: "var(--radius-md, 14px)",
                color: hasImageBackground
                  ? "rgba(255, 255, 255, 0.96)"
                  : "var(--color-text-secondary, #51565c)",
                backgroundColor: hasImageBackground
                  ? "rgba(17, 20, 24, 0.34)"
                  : "var(--color-surface-muted, #f0f2f4)",
                border: hasImageBackground
                  ? "1px solid rgba(255, 255, 255, 0.18)"
                  : "1px solid var(--color-border-subtle, #e9ebef)",
                backdropFilter: hasImageBackground ? "blur(8px)" : "none",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                  {formatDate(event.startDate)} • {formatTime(event.startDate)}
                </Typography>
              </Stack>
              {eventAddress && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography
                    sx={{
                      minWidth: 0,
                      fontSize: 13.5,
                      fontWeight: 600,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {eventAddress}
                  </Typography>
                </Stack>
              )}
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: 12,
                  color: hasImageBackground
                    ? "rgba(255, 255, 255, 0.94)"
                    : "var(--color-text-muted, #6e737a)",
                  mt: 0.5,
                  textShadow: hasImageBackground
                    ? "0 1px 3px rgba(0, 0, 0, 0.55)"
                    : "none",
                }}
              >
                {formatDate(event.startDate)} • {formatTime(event.startDate)}
              </Typography>

              {eventAddress && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: hasImageBackground
                      ? "rgba(255, 255, 255, 0.94)"
                      : "var(--color-text-muted, #6e737a)",
                    mt: 0.5,
                    overflowWrap: "anywhere",
                    textShadow: hasImageBackground
                      ? "0 1px 3px rgba(0, 0, 0, 0.55)"
                      : "none",
                  }}
                >
                  {eventAddress}
                </Typography>
              )}
            </>
          )}

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-start",
              alignSelf: "flex-start",
              width: "fit-content",
              maxWidth: "100%",
              gap: 0.75,
              mt: featured ? "auto" : 1.25,
              color: isRegistered
                ? "var(--color-success)"
                : "var(--color-text-muted, #6e737a)",
              backgroundColor: isRegistered
                ? "var(--color-success-soft)"
                : "var(--color-surface-muted, #f0f2f4)",
              border: "1px solid",
              borderColor: isRegistered
                ? "rgba(var(--color-success-rgb), 0.18)"
                : "var(--color-border-subtle, #e9ebef)",
              borderRadius: featured
                ? "var(--radius-md, 14px)"
                : "var(--radius-sm, 10px)",
              px: featured ? 1.5 : 1.1,
              py: featured ? 1 : 0.625,
            }}
          >
            {isRegistered ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
            <Typography
              sx={{
                fontSize: featured ? 13 : 12,
                fontWeight: 800,
              }}
            >
              {ATTENDANCE_STATUS_LABELS[attendanceIntent]}
            </Typography>
          </Box>
        </Box>

        {showChevron && (
          <ChevronLeftIcon
            sx={{
              color: hasImageBackground ? "#fff" : "#9CA3AF",
              mt: 0.75,
              flexShrink: 0,
              filter: hasImageBackground
                ? "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.55))"
                : "none",
            }}
          />
        )}
      </Stack>
    </Box>
  );
};
