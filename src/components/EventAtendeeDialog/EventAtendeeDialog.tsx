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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";

export const EventAtendeeDialog: React.FC<IEventAtendeeDialogProps> = ({
  open,
  onClose,
  atendees,
  onDelete,
}) => {
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

      <DialogContent sx={{ pt: 0, maxHeight: 300, overflowY: "auto" }}>
        <List disablePadding>
          {atendees.map((atendee) => (
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
      </DialogContent>
    </Dialog>
  );
};
