import * as React from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
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
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          maxWidth: "90vw",
          borderRadius: 2,
          overflow: "hidden",
          direction: "rtl",
          fontFamily: "Rubik, sans-serif",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
          color: "#fff",
          p: "16px 24px",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        נוכחות באירוע
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#fff",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, minHeight: 180, backgroundColor: "#faf8f9" }}>
        {isFetching ? (
          <Box
            sx={{
              minHeight: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={28} sx={{ color: "#9a5188" }} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ direction: "rtl" }}>
            לא הצלחנו לטעון את רשימת הנוכחות לאירוע.
          </Alert>
        ) : attendance.length === 0 ? (
          <Typography
            sx={{
              color: "#888",
              textAlign: "center",
              fontFamily: "Rubik, sans-serif",
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
                p: "10px 12px",
                mb: 1,
                backgroundColor: "#fff",
                border: "1px solid #f0ecef",
                borderRadius: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#f3e8f0",
                  color: "#9a5188",
                  fontSize: 14,
                  fontWeight: 700,
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
                  color: "#333",
                  fontFamily: "Rubik, sans-serif",
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
                sx={{
                  color: "#bbb",
                  "&:hover": {
                    color: "#d32f2f",
                    backgroundColor: "rgba(211,47,47,0.08)",
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
  );
};
