import { Box, Button, Stack, Typography } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { Link as RouterLink } from "react-router-dom";

export type ApplicantStatus =
  "PENDING_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

export function ApplicationStatusScreen({
  status,
  reason,
  onCorrect,
}: {
  status: ApplicantStatus;
  reason?: string | null;
  onCorrect: () => void;
}) {
  const success = status === "PENDING_REVIEW" || status === "APPROVED";
  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: { xs: 3, sm: 6 },
      }}
    >
      <Stack
        role="status"
        alignItems="center"
        spacing={3}
        sx={{ width: "100%", maxWidth: 480, textAlign: "center" }}
      >
        {success && (
          <CheckCircleRounded
            aria-hidden="true"
            sx={{ fontSize: { xs: 96, sm: 120 }, color: "success.main" }}
          />
        )}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem" },
            fontWeight: 700,
            color: success
              ? "success.main"
              : status === "REJECTED"
                ? "error.main"
                : "text.primary",
          }}
        >
          {status === "PENDING_REVIEW"
            ? "הבקשה נשלחה!"
            : status === "APPROVED"
              ? "הבקשה אושרה!"
              : status === "CHANGES_REQUESTED"
                ? "נדרשים תיקונים"
                : "הבקשה נדחתה"}
        </Typography>
        {status === "PENDING_REVIEW" && (
          <Typography color="text.secondary">
            הבקשה ממתינה לאישור מנהל.
          </Typography>
        )}
        {(status === "REJECTED" || status === "CHANGES_REQUESTED") &&
          reason?.trim() && (
            <Typography
              sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
            >
              {reason}
            </Typography>
          )}
        {status === "APPROVED" && (
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="large"
          >
            כניסה למערכת
          </Button>
        )}
        {status === "CHANGES_REQUESTED" && (
          <Button onClick={onCorrect} variant="contained" size="large">
            לתיקון הבקשה
          </Button>
        )}
      </Stack>
    </Box>
  );
}
