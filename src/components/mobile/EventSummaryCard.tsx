import { Box, Chip, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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
}

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

export const EventSummaryCard: React.FC<EventSummaryCardProps> = ({
  event,
  attendanceIntent,
  onClick,
  showChevron = true,
}) => {
  const isRegistered = attendanceIntent !== "NONE";
  const eventType = event.eventType ? EVENT_TYPES[event.eventType] : undefined;
  const eventName = decodeUnicodeEscapes(event.name);
  const eventAddress = decodeUnicodeEscapes(event.address);

  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: "20px",
        p: 2.25,
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:active": onClick ? { transform: "scale(0.98)" } : undefined,
        "&:hover": onClick
          ? {
              transform: "translateY(-1px)",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.08)",
            }
          : undefined,
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {eventType && (
            <Chip
              size="small"
              label={`${eventType.icon} ${decodeUnicodeEscapes(eventType.label)}`}
              sx={{
                height: 24,
                borderRadius: "999px",
                backgroundColor: "#F3EAF7",
                color: "#7B3F98",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Rubik, sans-serif",
              }}
            />
          )}

          <Typography
            sx={{
              mt: eventType ? 1 : 0,
              fontWeight: 700,
              fontSize: 16,
              color: "#1F1F1F",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {eventName}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#6B7280",
              mt: 0.5,
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {formatDate(event.startDate)} • {formatTime(event.startDate)}
          </Typography>

          {eventAddress && (
            <Typography
              sx={{
                fontSize: 12,
                color: "#6B7280",
                mt: 0.5,
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {eventAddress}
            </Typography>
          )}

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              mt: 1.25,
              color: isRegistered ? "#2F7D32" : "#6B7280",
              backgroundColor: isRegistered ? "#EAF7EE" : "#F1F2F4",
              borderRadius: "999px",
              px: 1.1,
              py: 0.625,
            }}
          >
            {isRegistered ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {ATTENDANCE_STATUS_LABELS[attendanceIntent]}
            </Typography>
          </Box>
        </Box>

        {showChevron && (
          <ChevronLeftIcon sx={{ color: "#9CA3AF", mt: 0.75 }} />
        )}
      </Stack>
    </Box>
  );
};
