import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import feedbackService from "../../services/feedback.service";
import { useFeatureRequestDialogStyles } from "./FeatureRequestDialog.styles";

const TITLE_MAX_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 4000;

interface FeatureRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FeatureRequestDialog: React.FC<FeatureRequestDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const classes = useFeatureRequestDialogStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setError("");
    setShowValidation(false);
  };

  const closeDialog = () => {
    if (isSending) return;
    reset();
    onClose();
  };

  const submit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    setShowValidation(true);
    setError("");

    if (!trimmedTitle || !trimmedDescription) return;

    setIsSending(true);
    try {
      await feedbackService.submitFeatureRequest({
        title: trimmedTitle,
        description: trimmedDescription,
      });
      reset();
      onClose();
      onSuccess();
    } catch (submissionError) {
      const status = axios.isAxiosError(submissionError)
        ? submissionError.response?.status
        : undefined;
      setError(
        status === 503
          ? "שירות המשוב אינו זמין כרגע. נסו שוב מאוחר יותר."
          : "לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד כמה רגעים.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="feature-request-dialog-title"
      fullWidth
      maxWidth="sm"
      PaperProps={{ dir: "rtl", className: classes.paper }}
    >
      <DialogTitle
        id="feature-request-dialog-title"
        className={classes.title}
      >
        בקשה לפיצ&apos;ר
        <IconButton
          aria-label="סגירת טופס בקשה לפיצ'ר"
          onClick={closeDialog}
          disabled={isSending}
          className={classes.close}
          style={{ position: "absolute" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <form
          id="feature-request-form"
          className={classes.form}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="כותרת"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            required
            fullWidth
            disabled={isSending}
            error={showValidation && !title.trim()}
            helperText={
              showValidation && !title.trim() ? "יש להזין כותרת" : " "
            }
            inputProps={{ maxLength: TITLE_MAX_LENGTH }}
          />
          <TextField
            label="תיאור"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            required
            fullWidth
            multiline
            minRows={5}
            maxRows={10}
            disabled={isSending}
            error={showValidation && !description.trim()}
            helperText={
              showValidation && !description.trim()
                ? "יש להזין תיאור"
                : `${description.length}/${DESCRIPTION_MAX_LENGTH}`
            }
            inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
          />
        </form>
      </DialogContent>

      <DialogActions dir="ltr" className={classes.actions}>
        <Button
          onClick={closeDialog}
          disabled={isSending}
          className={classes.actionButton}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          form="feature-request-form"
          variant="contained"
          disabled={isSending}
          className={classes.actionButton}
          startIcon={isSending ? <CircularProgress size={17} color="inherit" /> : undefined}
        >
          {isSending ? "שולח..." : "שליחה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
