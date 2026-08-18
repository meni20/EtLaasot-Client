import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import eventService from "../../services/event.service";
import type { IEventAiInsights } from "../../interfaces/event.interface";

interface EventAiSummaryDialogProps {
  open: boolean;
  eventId: string;
  eventName: string;
  onClose: () => void;
}

const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("he-IL");
};

export const EventAiSummaryDialog: React.FC<EventAiSummaryDialogProps> = ({
  open,
  eventId,
  eventName,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const queryKey = ["event-ai-insights", eventId];
  const { data, isError, isFetching } = useQuery<IEventAiInsights>({
    queryKey,
    queryFn: () => eventService.getEventAiInsights(eventId),
    enabled: open && Boolean(eventId),
  });

  const generateMutation = useMutation({
    mutationFn: () => eventService.generateEventAiSummary(eventId),
    onSuccess: (updatedInsights) => {
      queryClient.setQueryData(queryKey, updatedInsights);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  useEffect(() => {
    if (open) {
      setActiveTab(0);
      setCopyStatus(null);
    }
  }, [open, eventId]);

  const handleCopySummary = async () => {
    if (!data?.aiSummary) return;

    try {
      await navigator.clipboard.writeText(data.aiSummary);
      setCopyStatus("הסיכום הועתק");
    } catch {
      setCopyStatus("לא ניתן היה להעתיק את הסיכום");
    }
  };

  const isGenerating = generateMutation.isPending;
  const hasSummary = Boolean(data?.aiSummary);
  const aiActionLabel = hasSummary
    ? "יצירת סיכום מחדש"
    : "יצירת סיכום AI";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      dir="rtl"
      PaperProps={{
        sx: {
          overflow: "hidden",
          backgroundColor: "background.default",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          pr: { xs: 5, sm: 6 },
          pl: { xs: 8, sm: 9 },
          pt: 5,
          pb: 2,
        }}
      >
        <Typography component="span" sx={{ display: "block", fontSize: 22, fontWeight: 800 }}>
          סיכום AI לאירוע
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            mt: 0.75,
            color: "text.secondary",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {eventName}
        </Typography>
        <IconButton
          aria-label="סגור"
          onClick={onClose}
          disabled={isGenerating}
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
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 3, sm: 6 }, pb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 46,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 0.5,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 38,
              borderRadius: 2.25,
              fontWeight: 700,
              color: "text.secondary",
            },
            "& .Mui-selected": {
              color: "primary.main",
              backgroundColor: "primary.light",
            },
          }}
        >
          <Tab label="סיכום AI" />
          <Tab label={`הערות מקור (${data?.notes.length ?? 0})`} />
        </Tabs>

        {isFetching && !data ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">לא ניתן לטעון את נתוני סיכום ה-AI.</Alert>
        ) : activeTab === 0 ? (
          <Stack spacing={2}>
            {data?.isAiSummaryOutdated && (
              <Alert severity="warning">
                הסיכום חסר או אינו מעודכן ביחס להערות הפעילות האחרונות.
              </Alert>
            )}

            {generateMutation.isError && (
              <Alert severity="error">
                יצירת הסיכום נכשלה. ודא שיש הערות פעילות ושמפתח ה-AI מוגדר בשרת.
              </Alert>
            )}

            {hasSummary ? (
              <Box
                sx={{
                  whiteSpace: "pre-wrap",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 4,
                  p: { xs: 2.5, sm: 3 },
                  backgroundColor: "background.paper",
                  color: "text.primary",
                  lineHeight: 1.7,
                  boxShadow: (theme) => theme.shadows[0],
                }}
              >
                {data?.aiSummary}
              </Box>
            ) : (
              <Alert severity="info">
                עדיין אין סיכום AI. אפשר ליצור אחד מהכפתור למטה.
              </Alert>
            )}

            {data?.aiSummaryGeneratedAt && (
              <Typography variant="caption" color="text.secondary">
                נוצר לאחרונה: {formatDateTime(data.aiSummaryGeneratedAt)}
              </Typography>
            )}

            {copyStatus && (
              <Typography variant="caption" color="text.secondary">
                {copyStatus}
              </Typography>
            )}
          </Stack>
        ) : (
          <Stack spacing={2}>
            {!data?.notes.length && (
              <Alert severity="info">אין הערות פעילות להצגה.</Alert>
            )}

            {data?.notes.map((note) => (
              <Box
                key={note.id}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                }}
              >
                <Stack spacing={0.5}>
                  <Typography fontWeight={700}>
                    מתנדב/ת: {note.volunteerName || "-"} | חניך/ה:{" "}
                    {note.traineeName || "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    סטטוס: {note.status} | עודכן:{" "}
                    {formatDateTime(note.updatedAt)}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {note.notes}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: { xs: 3, sm: 6 },
          py: 4,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button onClick={onClose} disabled={isGenerating}>
          סגור
        </Button>
        <Stack direction="row" spacing={1}>
          {hasSummary && (
            <Tooltip title="העתקת הסיכום">
              <span>
                <IconButton
                  onClick={handleCopySummary}
                  disabled={isGenerating}
                  aria-label="העתקת הסיכום"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.default",
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title={aiActionLabel}>
            <span>
              <IconButton
                color="primary"
                onClick={() => generateMutation.mutate()}
                disabled={isGenerating || isFetching}
                aria-label={aiActionLabel}
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  backgroundColor: "primary.light",
                }}
              >
                <Badge
                  color="warning"
                  variant="dot"
                  invisible={
                    activeTab !== 0 || !data?.isAiSummaryOutdated || isGenerating
                  }
                  overlap="circular"
                >
                  {isGenerating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AutoAwesomeIcon fontSize="small" />
                  )}
                </Badge>
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
