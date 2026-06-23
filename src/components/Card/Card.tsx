import { Box, Chip, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useMemo, useState } from "react";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { useCardStyles } from "./Card.styles";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import type { ICardProps } from "./Card.interface";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useBranch } from "../../contexts/useBranch";
import { EVENT_TYPES } from "../../constants/auth.const";
import userService from "../../services/user.service";
import type { IUser } from "../../interfaces/user.interface";
import { EventAtendeeDialog } from "../EventAtendeeDialog/EventAtendeeDialog";
import { EventActivityAttendanceDialog } from "../EventActivityAttendanceDialog/EventActivityAttendanceDialog";

const toDate = (value: Date | string | null | undefined) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatTime = (date: Date | null) => {
  if (!date) return "-";

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
};

const formatDate = (date: Date | null) => {
  if (!date) return "-";

  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

const isSameCalendarDay = (start: Date | null, end: Date | null) => {
  if (!start || !end) return false;

  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
};

export const BasicCard: React.FC<ICardProps> = ({
  eventId,
  eventName,
  startDate,
  endDate,
  address,
  description,
  eventType,
  imageUrl,
  participantsCount,
  onEdit,
}) => {
  const classes = useCardStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const { data: allUsers } = useQuery({
    queryKey: ["users", activeBranch],
    queryFn: () => userService.getAllUsers(activeBranch ?? undefined),
    select: (data) =>
      [...data].sort((a, b) => {
        const roleA = a.userRoles?.[0]?.roleId ?? Infinity;
        const roleB = b.userRoles?.[0]?.roleId ?? Infinity;
        return roleA - roleB;
      }),
  });

  const formattedVolunteers = useMemo(() => {
    return allUsers?.map((user: IUser) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.userRoles?.[0]?.roleId ?? 0,
      events: user.events,
    }));
  }, [allUsers]);

  const eventTypeLabel = eventType
    ? EVENT_TYPES[eventType]?.label ?? eventType
    : undefined;
  const start = toDate(startDate);
  const end = toDate(endDate);
  const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
  const dateRange = isSameCalendarDay(start, end)
    ? formatDate(start)
    : `${formatDate(start)} - ${formatDate(end)}`;
  const hasImageBackground = Boolean(imageUrl);

  return (
    <Box className={classes.cardContainer}>
      <Card
        className={`${classes.card} ${
          hasImageBackground ? classes.cardWithImage : ""
        }`}
        style={
          hasImageBackground
            ? { backgroundImage: `url("${imageUrl}")` }
            : undefined
        }
      >
        <CardContent className={classes.cardContent}>
          <Box className={classes.headerRow}>
            <Box className={classes.titleBlock}>
              <Typography variant="h6" className={classes.eventName}>
                {eventName}
              </Typography>
              {eventTypeLabel && (
                <Chip
                  className={classes.typeChip}
                  label={eventTypeLabel}
                  size="small"
                />
              )}
            </Box>

            <Tooltip title="עריכת אירוע">
              <IconButton
                className={classes.editButton}
                onClick={onEdit}
                aria-label="עריכת אירוע"
                size="small"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Stack className={classes.detailsList} spacing={1}>
            <Box className={classes.detailRow}>
              <ScheduleOutlinedIcon className={classes.detailIcon} />
              <Typography className={classes.detailValue}>
                {timeRange}
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <CalendarTodayOutlinedIcon className={classes.detailIcon} />
              <Typography className={classes.detailValue}>
                {dateRange}
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <LocationOnOutlinedIcon className={classes.detailIcon} />
              <Typography className={classes.detailValue}>
                {address || "-"}
              </Typography>
            </Box>

            {description && (
              <Box className={classes.detailRow}>
                <NotesOutlinedIcon className={classes.detailIcon} />
                <Typography className={classes.description}>
                  {description}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>

        <Divider className={classes.divider} />

        <CardActions className={classes.cardActions}>
          <Button
            size="small"
            className={classes.showButton}
            onClick={() => setOpen(true)}
            startIcon={<GroupsOutlinedIcon />}
          >
            רשומים לאירוע ({participantsCount ?? 0})
          </Button>
          <Button
            size="small"
            className={classes.secondaryButton}
            onClick={() => setIsAttendanceOpen(true)}
            startIcon={<EventAvailableOutlinedIcon />}
          >
            נוכחות
          </Button>
        </CardActions>
      </Card>

      {open && (
        <EventAtendeeDialog
          open={open}
          onClose={() => setOpen(false)}
          eventId={eventId}
          users={formattedVolunteers || []}
        />
      )}

      {isAttendanceOpen && (
        <EventActivityAttendanceDialog
          open={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          eventId={eventId}
        />
      )}
    </Box>
  );
};
