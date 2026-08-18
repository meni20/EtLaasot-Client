import * as React from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import activityService from "../../services/activity.service";
import type { IEventActivityAttendanceDialogProps } from "./EventActivityAttendanceDialog.interface";

export const EventActivityAttendanceDialog: React.FC<
  IEventActivityAttendanceDialogProps
> = ({ open, eventId, onClose }) => {
  const queryClient = useQueryClient();
  const queryKey = ["activity", "event-attendance", eventId];
  const [notice, setNotice] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const {
    data: attendance = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => activityService.getEventAttendance(eventId),
    enabled: open && !!eventId,
  });

  const removeMutation = useMutation({
    mutationFn: (volunteerId: string) =>
      activityService.removeEventAttendance(eventId, volunteerId),
    onSuccess: (updatedAttendance) => {
      queryClient.setQueryData(queryKey, updatedAttendance);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setNotice({ severity: "success", message: "הרשומה הוסרה מהנוכחות" });
    },
    onError: () => {
      setNotice({
        severity: "error",
        message: "לא הצלחנו להסיר את רשומת הנוכחות. נסו שוב.",
      });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 460,
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 5,
            overflow: "hidden",
            direction: "rtl",
            fontFamily: (theme) => theme.typography.fontFamily,
            backgroundColor: "background.default",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            px: { xs: 4, sm: 5 },
            pt: 5,
            pb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 21 }}>
            נוכחות באירוע
          </Typography>
          <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 13 }}>
            ניהול רשומות פעילות בלבד
          </Typography>
          <IconButton
            aria-label="סגירת חלון נוכחות בפעילות"
            onClick={onClose}
            disabled={removeMutation.isPending}
            sx={{
              position: "absolute",
              left: 12,
              top: 14,
              color: "text.secondary",
              backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.06),
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

      <Box sx={{ px: { xs: 3, sm: 5 }, pb: 5, minHeight: 220 }}>
        {isFetching ? (
          <Box
            sx={{
              minHeight: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ direction: "rtl" }}>
            לא הצלחנו לטעון את רשימת הנוכחות לאירוע.
          </Alert>
        ) : attendance.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontWeight: 700,
              py: 5,
            }}
          >
            אין נוכחות פעילות לאירוע זה
          </Typography>
        ) : (
          attendance.map((row) => (
            <Box
              key={row.volunteerId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                mb: 1,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: (theme) =>
                  `background-color 140ms ease, transform 140ms ${theme.transitions.easing.easeOut}`,
                "&:hover": {
                  backgroundColor: "primary.light",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: "primary.light",
                  color: "primary.main",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                {row.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar>
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.name}
              </Typography>
              <IconButton
                size="small"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(row.volunteerId)}
                aria-label={`הסר נוכחות עבור ${row.name}`}
                sx={{
                  color: "error.main",
                  backgroundColor: "error.light",
                  border: "1px solid",
                  borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
                  "&:hover": {
                    backgroundColor: "error.light",
                    borderColor: "error.main",
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
      </Dialog>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
      >
        <Alert
          severity={notice?.severity ?? "success"}
          onClose={() => setNotice(null)}
          sx={{ width: "100%" }}
        >
          {notice?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
