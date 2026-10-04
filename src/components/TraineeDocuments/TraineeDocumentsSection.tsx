import { useId, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useAuth } from "../../contexts/useAuth";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_FILE_HELP,
  DOCUMENT_TYPES,
} from "../../constants/trainee-document.constants";
import type {
  DocumentType,
  TraineeDocument,
  TraineeDocumentsTarget,
} from "../../interfaces/trainee-document.interface";
import { useTraineeDocuments } from "../../hooks/useTraineeDocuments";
import {
  documentErrorMessage,
  validateDocumentFile,
} from "../../utils/trainee-document.util";
import { DocumentViewer } from "./DocumentViewer";
import { documentDialogSx, documentSectionSx } from "./document.styles";

type Action = {
  kind: "upload" | "delete" | "view";
  type: DocumentType;
  document?: TraineeDocument;
};

export function TraineeDocumentsSection(props: TraineeDocumentsTarget) {
  const { user, sessionId, isAuthenticated } = useAuth();
  if (!user || !isAuthenticated) return null;
  // Remount synchronously on identity/target changes, including open dialogs.
  return (
    <DocumentsContent
      key={`${sessionId}:${user.userId}:${props.mode}:${props.traineeUuid ?? "self"}`}
      target={props}
      actorId={user.userId}
      sessionId={sessionId}
    />
  );
}

function DocumentsContent({
  target,
  actorId,
  sessionId,
}: {
  target: TraineeDocumentsTarget;
  actorId: string;
  sessionId: number;
}) {
  const headingId = useId();
  const dialogId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const { documents, upload, remove } = useTraineeDocuments(
    target,
    actorId,
    sessionId,
  );
  const [action, setAction] = useState<Action | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const pending = upload.isPending || remove.isPending;
  const selected = DOCUMENT_TYPES.find((item) => item.type === action?.type);

  function open(next: Action) {
    setFile(null);
    setError("");
    setAction(next);
  }
  function close() {
    if (submitting.current) return;
    setAction(null);
    setFile(null);
    setError("");
    upload.reset();
    remove.reset();
  }
  async function submit() {
    if (!action || submitting.current) return;
    if (action.kind === "upload") {
      if (!file) return;
      const validation = validateDocumentFile(file);
      if (validation) {
        setError(validation);
        return;
      }
    }
    submitting.current = true;
    setError("");
    try {
      if (action.kind === "upload" && file) {
        await upload.mutateAsync({ type: action.type, file });
        setSuccess(
          action.document ? "המסמך הוחלף בהצלחה" : "המסמך הועלה בהצלחה",
        );
      } else if (action.kind === "delete") {
        await remove.mutateAsync(action.type);
        setSuccess("המסמך נמחק בהצלחה");
      }
      submitting.current = false;
      close();
    } catch (cause) {
      setError(
        documentErrorMessage(
          cause,
          action.kind === "delete"
            ? "מחיקת המסמך נכשלה. נסו שוב."
            : "העלאת המסמך נכשלה. נסו שוב.",
        ),
      );
    } finally {
      submitting.current = false;
    }
  }

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      dir="rtl"
      sx={documentSectionSx}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <DescriptionOutlinedIcon color="primary" />
        <Typography id={headingId} component="h2" variant="h6">
          מסמכים אישיים
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {DOCUMENT_FILE_HELP}
      </Typography>
      {documents.isPending && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress size={28} aria-label="טוען מסמכים" />
        </Stack>
      )}
      {documents.isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              disabled={documents.isFetching}
              onClick={() => void documents.refetch()}
            >
              נסו שוב
            </Button>
          }
        >
          {documentErrorMessage(
            documents.error,
            "טעינת המסמכים נכשלה. נסו שוב.",
          )}
        </Alert>
      )}
      {!documents.isPending && !documents.isError && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 3,
            "@container (min-width: 780px)": {
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {DOCUMENT_TYPES.map(({ type, label }) => {
            const document = documents.data?.find(
              (item) => item.documentType === type,
            );
            return (
              <Box
                key={type}
                component="article"
                aria-label={label}
                sx={{
                  p: 4,
                  minWidth: 0,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "14px",
                  bgcolor: "background.default",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  sx={{ mb: 3 }}
                >
                  <Typography component="h3" variant="subtitle1">
                    {label}
                  </Typography>
                  <Chip
                    size="small"
                    label={document ? "הועלה" : "לא הועלה"}
                    color={document ? "success" : "default"}
                    variant="outlined"
                  />
                </Stack>
                {document && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ overflowWrap: "anywhere", mb: 3 }}
                  >
                    <bdi>{document.originalFilename}</bdi>
                  </Typography>
                )}
                <Stack direction="row" flexWrap="wrap" gap={2}>
                  {document ? (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityOutlinedIcon />}
                        disabled={pending}
                        onClick={() => open({ kind: "view", type, document })}
                      >
                        צפייה
                      </Button>
                      <Button
                        disabled={pending}
                        onClick={() => open({ kind: "upload", type, document })}
                      >
                        החלפה
                      </Button>
                      <Button
                        color="error"
                        disabled={pending}
                        onClick={() => open({ kind: "delete", type, document })}
                      >
                        מחיקה
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<UploadFileRoundedIcon />}
                      disabled={pending}
                      onClick={() => open({ kind: "upload", type })}
                    >
                      העלאת מסמך
                    </Button>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      )}
      {action?.kind === "view" && action.document && selected && (
        <DocumentViewer
          target={target}
          document={action.document}
          label={selected.label}
          onClose={close}
        />
      )}
      {action && action.kind !== "view" && selected && (
        <Dialog
          open
          onClose={close}
          disableEscapeKeyDown={pending}
          fullWidth
          maxWidth="sm"
          dir="rtl"
          aria-labelledby={dialogId}
          slotProps={{ paper: { sx: documentDialogSx } }}
        >
          <DialogTitle id={dialogId}>
            {action.kind === "delete"
              ? `האם למחוק את ${selected.deleteLabel}?`
              : `${action.document ? "החלפת" : "העלאת"} מסמך — ${selected.label}`}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={4} sx={{ pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {action.kind === "delete" ? (
                <Typography>
                  המסמך יוסר. ניתן להעלות מסמך חדש לאחר המחיקה.
                </Typography>
              ) : (
                <>
                  {action.document && (
                    <Alert severity="warning">
                      המסמך החדש יחליף את המסמך הקיים רק לאחר שההעלאה תצליח.
                    </Alert>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {DOCUMENT_FILE_HELP}
                  </Typography>
                  <input
                    ref={fileInput}
                    type="file"
                    accept={DOCUMENT_ACCEPT}
                    hidden
                    disabled={pending}
                    onChange={(event) => {
                      const chosen = event.target.files?.[0];
                      event.target.value = "";
                      if (!chosen) return;
                      const validation = validateDocumentFile(chosen);
                      setFile(validation ? null : chosen);
                      setError(validation ?? "");
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileRoundedIcon />}
                    disabled={pending}
                    onClick={() => fileInput.current?.click()}
                  >
                    {file ? "בחירת קובץ אחר" : "בחירת קובץ"}
                  </Button>
                  {file && (
                    <Typography
                      variant="body2"
                      sx={{ overflowWrap: "anywhere" }}
                    >
                      <bdi>{file.name}</bdi>
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 6, pb: 5, gap: 2 }}>
            <Button disabled={pending} onClick={close}>
              ביטול
            </Button>
            <Button
              variant="contained"
              color={action.kind === "delete" ? "error" : "primary"}
              disabled={pending || (action.kind === "upload" && !file)}
              onClick={() => void submit()}
              startIcon={
                pending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {pending
                ? "נא להמתין…"
                : action.kind === "delete"
                  ? "מחיקת מסמך"
                  : action.document
                    ? "החלפת מסמך"
                    : "העלאת מסמך"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          bottom: { xs: "calc(80px + env(safe-area-inset-bottom))", sm: 24 },
        }}
      >
        <Alert
          severity="success"
          closeText="סגירה"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
