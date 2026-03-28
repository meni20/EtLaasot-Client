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
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IAddAttendeeDialogProps } from "./AddAttendeeDialog.interface";
import AddIcon from "@mui/icons-material/Add";
import eventService from "../../services/event.service";
import { AUTH_ROLES } from "../../constants/auth.const";
import { useQueryClient } from "@tanstack/react-query";

export const AddAttendeeDialog: React.FC<IAddAttendeeDialogProps> = ({
  open,
  eventId,
  onClose,
  users,
}) => {
  const queryClient = useQueryClient();

  const handleAddAttendee = async (userId: string) => {
    try {
      await eventService.addAttendeeToEvent(userId, eventId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["events"] }),
        queryClient.invalidateQueries({ queryKey: ["eventAttendees"] }),
        queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] }),
      ]);
    } catch (error) {
      console.error("Error adding attendee to event:", error);
    }
  };

  const isUserAssignedToEvent = (userId: string) => {
    const user = users?.find((u) => u.id === userId);

    if (!user?.events || user.events.length === 0) return false;

    return user.events.some((event) => event.id === eventId);
  };

  const getRoleTitle = (roleId: number) => {
    switch (roleId) {
      case AUTH_ROLES.TRAINEE.id:
        return "חניכים";
      case AUTH_ROLES.VOLUNTEER.id:
        return "חונכים";
      default:
        return "משתמשים";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          borderRadius: 4,
          overflow: "hidden",
          direction: "rtl",
          fontFamily: "Rubik, sans-serif",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 18,
          textAlign: "center",
          background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
          color: "#fff",
          padding: "14px 0",
          fontFamily: "Rubik, sans-serif",
        }}
      >
        הוספת משתתפים לאירוע
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 1,
          pb: 2,
          maxHeight: 340,
          overflowY: "auto",
          backgroundColor: "#faf8f9",
        }}
      >
        <List disablePadding>
          {users.map((user, index) => {
            const prevRole = users[index - 1]?.role;
            const isFirstOfRole = index === 0 || user.role !== prevRole;

            return (
              <React.Fragment key={user.id}>
                {isFirstOfRole && (
                  <Typography
                    sx={{
                      px: 2,
                      py: 1,
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#9a5188",
                      textAlign: "right",
                      fontFamily: "Rubik, sans-serif",
                    }}
                  >
                    {getRoleTitle(user.role!)}
                  </Typography>
                )}

                <ListItem
                  sx={{
                    px: 1.5,
                    py: 1,
                    gap: 2,
                    borderRadius: 3,
                    marginBottom: 0.5,
                    backgroundColor: isUserAssignedToEvent(user.id)
                      ? "#f0fdf4"
                      : "#fff",
                    border: "1px solid",
                    borderColor: isUserAssignedToEvent(user.id)
                      ? "#bbf7d0"
                      : "#f0ecef",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: isUserAssignedToEvent(user.id)
                        ? "#f0fdf4"
                        : "#f8f4f9",
                    },
                  }}
                >
                  <IconButton
                    edge="end"
                    onClick={() => handleAddAttendee(user.id)}
                    disabled={isUserAssignedToEvent(user.id)}
                    sx={{
                      color: isUserAssignedToEvent(user.id)
                        ? "#22c55e"
                        : "#9a5188",
                    }}
                  >
                    <AddIcon />
                  </IconButton>

                  <ListItemText
                    primary={user.name}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "right",
                        fontFamily: "Rubik, sans-serif",
                      },
                    }}
                  />

                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:
                          user.role === AUTH_ROLES.TRAINEE.id
                            ? "#e8e8e8"
                            : "#dc87b8",
                        color:
                          user.role === AUTH_ROLES.TRAINEE.id ? "#888" : "#fff",
                        fontSize: 14,
                      }}
                    >
                      <PersonOutlineIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};
