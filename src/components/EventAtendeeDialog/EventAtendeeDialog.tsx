import * as React from "react";
import {
  Box,
  Dialog,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import eventService from "../../services/event.service";
import attendeeService from "../../services/attendee.service";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";
import { useStyles } from "./EventAtendeeDialog.styles";

interface FormattedAttendee {
  attendeeId: string;
  userId: string;
  name: string;
  email: string;
}

export const EventAtendeeDialog: React.FC<IEventAtendeeDialogProps> = ({
  open,
  onClose,
  eventId,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const { data: attendeesByEvent, isFetching: isFetchingAttendees } = useQuery({
    queryKey: ["attendeesByEvent", eventId],
    queryFn: () => eventService.getEventAttendees(eventId),
  });

  const deleteMutation = useMutation({
    mutationFn: (attendeeId: string) =>
      attendeeService.deleteAttendee(attendeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendeesByEvent", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendees"] });
    },
  });

  const formattedAttendees: FormattedAttendee[] = React.useMemo(
    () =>
      attendeesByEvent?.map((attendee: any) => ({
        attendeeId: attendee.id,
        userId: attendee.user?.id ?? "",
        name: attendee.user?.name ?? "ללא שם",
        email: attendee.user?.email ?? "",
      })) ?? [],
    [attendeesByEvent],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.dialogPaper }}
    >
      <Box className={classes.header}>
        רשומים לאירוע
        {!isFetchingAttendees && (
          <Typography className={classes.countBadge}>
            ({formattedAttendees.length})
          </Typography>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className={classes.dialogContent}>
        {isFetchingAttendees ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress sx={{ color: "#9a5188" }} size={36} />
          </Box>
        ) : formattedAttendees.length === 0 ? (
          <Box className={classes.emptyState}>
            <PeopleOutlineIcon sx={{ fontSize: 48, mb: 1, color: "#ddd" }} />
            <Typography sx={{ fontFamily: "Rubik", color: "#bbb" }}>
              אין משתתפים רשומים
            </Typography>
          </Box>
        ) : (
          formattedAttendees.map((attendee, index) => (
            <Box
              key={attendee.attendeeId}
              className={classes.listItem}
              sx={{ animationDelay: `${index * 0.05}s` }}
            >
              <Avatar className={classes.avatar}>
                {attendee.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#333",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {attendee.name}
                </Typography>
                {attendee.email && (
                  <Typography
                    sx={{
                      fontFamily: "Rubik",
                      fontSize: 12,
                      color: "#999",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {attendee.email}
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                className={classes.deleteButton}
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(attendee.attendeeId)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Dialog>
  );
};
