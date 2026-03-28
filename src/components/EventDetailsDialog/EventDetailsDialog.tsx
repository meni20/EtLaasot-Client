import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import type { IEventDetailsDialogProps } from "./EventDetailsDialog.inteface";
import { useStyles } from "./EventDetailsDialog.styles";
import { formatDate } from "../../utils/data.utillity";
import { EVENT_TYPES } from "../../constants/auth.const";

export const EventDetailsDialog: React.FC<IEventDetailsDialogProps> = ({
  open,
  eventData,
  onClose,
}) => {
  const classes = useStyles();
  if (!eventData) return null;

  const eventTypeInfo = eventData.eventType
    ? EVENT_TYPES[eventData.eventType]
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.dialogPaper }}
    >
      <Box className={classes.header}>
        {eventData.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={classes.closeButton}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent className={classes.content}>
        <Stack spacing={2}>
          {eventTypeInfo && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Chip
                label={`${eventTypeInfo.icon} ${eventTypeInfo.label}`}
                sx={{
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  background: "rgba(154,81,136,0.1)",
                  color: "#9a5188",
                  borderRadius: 3,
                }}
              />
            </Box>
          )}

          <Box className={classes.section}>
            <Typography variant="body2" className={classes.label}>
              התחלה:
            </Typography>
            <Typography variant="body1" className={classes.valuePrimary}>
              {formatDate(eventData.startDate)}
            </Typography>
          </Box>

          <Box className={classes.section}>
            <Typography variant="body2" className={classes.label}>
              סוף:
            </Typography>
            <Typography variant="body1" className={classes.valuePrimary}>
              {formatDate(eventData.endDate)}
            </Typography>
          </Box>

          {eventData.description && (
            <Box className={classes.section}>
              <Typography variant="body2" className={classes.label}>
                פירוט:
              </Typography>
              <Typography variant="body1" className={classes.valueSecondary}>
                {eventData.description}
              </Typography>
            </Box>
          )}

          {eventData.address && (
            <Box className={classes.section}>
              <Typography variant="body2" className={classes.label}>
                מיקום:
              </Typography>
              <Typography variant="body1" className={classes.valueSecondary}>
                {eventData.address}
              </Typography>
            </Box>
          )}

          {eventData.attendees && eventData.attendees.length > 0 && (
            <Box className={classes.section}>
              <Typography variant="body2" className={classes.label}>
                משתתפים:
              </Typography>
              <Typography variant="body1" className={classes.valueSecondary}>
                {eventData.attendees.length} רשומים
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
