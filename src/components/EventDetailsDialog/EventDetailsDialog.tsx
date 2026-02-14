import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import type { IEventDetailsDialogProps } from "./EventDetailsDialog.inteface";
import { useStyles } from "./EventDetailsDialog.styles";
import { formatDate } from "../../utils/data.utillity";

export const EventDetailsDialog: React.FC<IEventDetailsDialogProps> = ({
  open,
  eventData,
  onClose,
}) => {
  const classes = useStyles();
  if (!eventData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.dialogPaper }}
    >
      <Box className={classes.header}>{eventData.name}</Box>

      <DialogContent className={classes.content}>
        <Stack spacing={2}>
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

          {eventData.location && (
            <Box className={classes.section}>
              <Typography variant="body2" className={classes.label}>
                מיקום:
              </Typography>
              <Typography variant="body1" className={classes.valueSecondary}>
                {eventData.location}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
