import * as React from "react";
import {
  Box,
  List,
  Dialog,
  Avatar,
  ListItem,
  IconButton,
  DialogTitle,
  ListItemText,
  DialogContent,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import eventService from "../../services/event.service";
import type { IUser } from "../../interfaces/user.interface";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";
import { useStyles } from "./EventAtendeeDialog.styles";

export const EventAtendeeDialog: React.FC<IEventAtendeeDialogProps> = ({
  open,
  onClose,
  eventId,
  onDelete,
}) => {
  const classes = useStyles();

  const { data: attendeesByEvent, isFetching: isFetchingAttendees } = useQuery({
    queryKey: ["attendeesByEvent", eventId],
    queryFn: () => eventService.getEventAttendees(eventId),
  });

  const formattedAttendees = React.useMemo(
    () =>
      attendeesByEvent?.map((attendee: any) => ({
        id: attendee.user.id,
        name: attendee.user.name,
        email: attendee.user.email,
      })),
    [attendeesByEvent]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>רשומים לאירוע</DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {isFetchingAttendees ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress sx={{ color: "#9a5188" }} />
          </Box>
        ) : (
          <List disablePadding>
            {formattedAttendees?.map((attendee: IUser) => (
              <ListItem
                key={attendee.id}
                className={classes.listItem}
                secondaryAction={
                  <IconButton
                    edge="start"
                    aria-label="delete"
                    onClick={() => onDelete(attendee.id)}
                  >
                    <DeleteOutlineIcon sx={{ color: "#7a3e6b" }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonOutlineIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  className={classes.attendeeName}
                  primary={attendee.name}
                  primaryTypographyProps={{ className: classes.attendeeName }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
