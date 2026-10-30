import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { useBranch } from "../contexts/useBranch";
import { apiErrorMessage } from "../utils/api-error";
export function EventListFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: unknown;
  retry: () => unknown;
}) {
  const { activeBranch } = useBranch();
  if (!activeBranch)
    return (
      <Alert severity="info" dir="rtl">
        יש לבחור סניף להצגת האירועים.
      </Alert>
    );
  if (loading)
    return (
      <Stack role="status" alignItems="center" p={3}>
        <CircularProgress aria-label="טוען אירועים" />
      </Stack>
    );
  if (error)
    return (
      <Alert
        severity="error"
        dir="rtl"
        action={<Button onClick={() => void retry()}>ניסיון נוסף</Button>}
      >
        {apiErrorMessage(error, "לא ניתן לטעון את האירועים. נסו שוב.")}
      </Alert>
    );
  return null;
}
