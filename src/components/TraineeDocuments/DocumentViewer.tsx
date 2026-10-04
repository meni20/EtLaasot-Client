import { useEffect, useId, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import type {
  DocumentView,
  TraineeDocument,
  TraineeDocumentsTarget,
} from "../../interfaces/trainee-document.interface";
import traineeDocumentService from "../../services/trainee-document.service";
import { documentErrorMessage } from "../../utils/trainee-document.util";
import { documentDialogSx } from "./document.styles";

export function DocumentViewer({
  target,
  document,
  label,
  onClose,
}: {
  target: TraineeDocumentsTarget;
  document: TraineeDocument;
  label: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<DocumentView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const { mode, traineeUuid } = target;

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    setLoading(true);
    setImageLoading(true);
    setView(null);
    setError("");
    const currentTarget: TraineeDocumentsTarget =
      mode === "self" ? { mode } : { mode, traineeUuid: traineeUuid! };
    void traineeDocumentService
      .view(currentTarget, document.documentType, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        const remaining = Date.parse(result.expiresAt) - Date.now();
        if (
          !Number.isFinite(remaining) ||
          remaining <= 0 ||
          !/^https?:\/\//.test(result.signedUrl)
        ) {
          throw new Error("Invalid or expired document link");
        }
        setView(result);
        timer = setTimeout(() => {
          setView(null);
          setError("תוקף הקישור הסתיים. ניתן לפתוח את המסמך מחדש.");
        }, remaining);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            documentErrorMessage(cause, "לא ניתן לפתוח את המסמך. נסו שוב."),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [mode, traineeUuid, document.documentType, attempt]);

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby={titleId}
      dir="rtl"
      slotProps={{ paper: { sx: documentDialogSx } }}
    >
      <DialogTitle id={titleId}>{label}</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflowWrap: "anywhere", mb: 4 }}
        >
          <bdi>{document.originalFilename}</bdi>
        </Typography>
        {loading && (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress aria-label="פותח מסמך" />
          </Stack>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {view && document.mimeType === "application/pdf" && (
          <Stack spacing={4} alignItems="flex-start">
            <Typography>
              המסמך ייפתח בלשונית חדשה. אם הקישור אינו זמין, לחצו על פתיחה מחדש.
            </Typography>
            <Button
              component="a"
              href={view.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              variant="contained"
              endIcon={<OpenInNewRoundedIcon />}
            >
              פתיחת PDF
            </Button>
          </Stack>
        )}
        {view && document.mimeType !== "application/pdf" && (
          <Box sx={{ textAlign: "center", minHeight: 100 }}>
            {imageLoading && <CircularProgress aria-label="טוען תמונה" />}
            <Box
              component="img"
              src={view.signedUrl}
              alt={label}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setView(null);
                setImageLoading(false);
                setError("טעינת התמונה נכשלה. ניתן לפתוח את המסמך מחדש.");
              }}
              sx={{
                display: imageLoading ? "none" : "block",
                width: "100%",
                maxHeight: "65dvh",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 6, pb: 5, gap: 2 }}>
        <Button onClick={onClose}>סגירה</Button>
        <Button
          disabled={loading}
          onClick={() => setAttempt((value) => value + 1)}
        >
          פתיחה מחדש
        </Button>
      </DialogActions>
    </Dialog>
  );
}
