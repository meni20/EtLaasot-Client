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
      await queryClient.invalidateQueries({ queryKey: ["users"] });
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
          width: 340,
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          textAlign: "center",
          background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
          color: "#fff",
          padding: "12px 0",
        }}
      >
        הוספת משתתפים לאירוע
      </DialogTitle>

      <DialogContent sx={{ pt: 0, maxHeight: 300, overflowY: "auto" }}>
        <List disablePadding>
          {users?.map((user, index) => {
            const prevRole = users[index - 1]?.role;
            const isFirstOfRole = index === 0 || user.role !== prevRole;

            return (
              <React.Fragment key={user.id}>
                {isFirstOfRole && (
                  <Typography
                    sx={{
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "text.secondary",
                      textAlign: "right",
                    }}
                  >
                    {getRoleTitle(user.role)}
                  </Typography>
                )}

                <ListItem
                  sx={{
                    px: 1,
                    py: 1,
                    gap: 3,
                  }}
                >
                  <IconButton
                    edge="end"
                    onClick={() => handleAddAttendee(user.id)}
                    disabled={isUserAssignedToEvent(user.id)}
                  >
                    <AddIcon />
                  </IconButton>

                  <ListItemText
                    primary={user.name}
                    primaryTypographyProps={{
                      sx: { fontSize: 16, textAlign: "right" },
                    }}
                  />

                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor:
                          user.role === AUTH_ROLES.TRAINEE.id
                            ? "grey.300"
                            : "#dc87b8",
                        color: "grey.600",
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

        <Box sx={{ height: 6 }} />
      </DialogContent>
    </Dialog>
  );
};
