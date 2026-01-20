import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IAddAttendeeDialogProps } from "./AddAttendeeDialog.interface";
import AddIcon from "@mui/icons-material/Add";
import eventService from "../../services/event.service";

export const AddAttendeeDialog: React.FC<IAddAttendeeDialogProps> = ({
  open,
  eventId,
  onClose,
  users,
  onDelete,
}) => {
  const handleAddAttendee = async (userId: string) => {
    try {
      await eventService.addAttendeeToEvent(userId, eventId);
    } catch (error) {
      console.error("Error adding attendee to event:", error);
    }
  };

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
        הוספת משתתפים לאירוע
      </DialogTitle>

      <DialogContent sx={{ pt: 0, maxHeight: 300, overflowY: "auto" }}>
        <List disablePadding>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                px: 1,
                py: 1,
                gap: 3,
              }}
            >
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleAddAttendee(user.id)}
              >
                <AddIcon />
              </IconButton>
              <ListItemText
                primary={user.name}
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
      </DialogContent>
    </Dialog>
  );
};
