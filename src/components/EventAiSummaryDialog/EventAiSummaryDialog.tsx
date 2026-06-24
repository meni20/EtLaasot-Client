import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" dir="rtl">
      <DialogTitle>סיכום AI לאירוע: {eventName}</DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ mb: 2 }}
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
                  border: "1px solid #ead8e5",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#fffafc",
                  color: "#2f2930",
                  lineHeight: 1.7,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                {data?.aiSummary}
              </Box>
            ) : (
              <Alert severity="info">No AI summary yet.</Alert>
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
              <Box key={note.id}>
                <Stack spacing={0.5}>
                  <Typography fontWeight={700}>
                    מתנדב/ת: {note.volunteerName || "-"} · חניך/ה:{" "}
                    {note.traineeName || "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    סטטוס: {note.status} · עודכן:{" "}
                    {formatDateTime(note.updatedAt)}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {note.notes}
                  </Typography>
                </Stack>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button onClick={onClose}>סגור</Button>
        <Stack direction="row" spacing={1}>
          {hasSummary && (
            <Button onClick={handleCopySummary} disabled={isGenerating}>
              העתק סיכום
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => generateMutation.mutate()}
            disabled={isGenerating || isFetching}
          >
            {isGenerating
              ? "יוצר סיכום..."
              : hasSummary
                ? "צור מחדש"
                : "צור סיכום"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
