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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import eventService from "../../services/event.service";
import type { IUser } from "../../interfaces/user.interface";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";

export const EventAtendeeDialog: React.FC<IEventAtendeeDialogProps> = ({
  open,
  onClose,
  eventId,
  onDelete,
}) => {
  const { data: attendeesByEvent, isFetching: isFetchingAttendees } = useQuery({
    queryKey: ["attendeesByEvent", eventId],
    queryFn: () => eventService.getEventAttendees(eventId),
  });

  const formatteedAttendees = React.useMemo(() => {
    return attendeesByEvent?.map((attendee: any) => ({
      id: attendee.user.id,
      name: attendee.user.name,
      email: attendee.user.email,
    }));
  }, [attendeesByEvent]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 340,
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        רשומים לאירוע
      </DialogTitle>

      {isFetchingAttendees ? "loading...":<DialogContent sx={{ pt: 0, maxHeight: 300, overflowY: "auto" }}>
        <List disablePadding>
          {formatteedAttendees?.map((atendee: IUser) => (
            <ListItem
              key={atendee.id}
              sx={{
                px: 1,
                py: 1,
                gap: 3,
              }}
            >
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(atendee.id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
              <ListItemText
                primary={atendee.name}
                primaryTypographyProps={{
                  sx: { fontSize: 16, textAlign: "right" },
                }}
                sx={{ my: 0 }}
              />
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "grey.200",
                    color: "grey.600",
                  }}
                >
                  <PersonOutlineIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
        <Box sx={{ height: 6 }} />
      </DialogContent>}
    </Dialog>
  );
};
