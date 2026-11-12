import { useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, Stack, Typography,
} from "@mui/material";
import { discountApi, type AdminStatus } from "./discount-api";

const labels = {
  disabled: "טרם ניתנה הרשאה",
  enabled: "ממתין למילוי",
  draft: "טיוטה נשמרה",
  submitted: "הבקשה נשלחה",
};
const errorMessage = "לא ניתן היה להשלים את הפעולה. אפשר לנסות שוב.";

type Preview = { url: string; type: string; name: string; key: string };

export function AdminDiscountRequest({ traineeId }: { traineeId: string }) {
  const [status, setStatus] = useState<AdminStatus>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview>();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void discountApi.adminStatus(traineeId, controller.signal).then(({ data }) => setStatus(data)).catch((failure: unknown) => {
      if (controller.signal.aborted) return;
      const statusCode = (failure as { response?: { status?: number } })?.response?.status;
      if (statusCode !== 404 && statusCode !== 403) setError(errorMessage);
    });
    return () => controller.abort();
  }, [traineeId, refresh]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);

  async function run(operation: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try { await operation(); }
    catch { setError(errorMessage); }
    finally { setBusy(false); }
  }

  function file(key: string, name: string, view: boolean) {
    void run(async () => {
      const { data } = await discountApi.file(traineeId, key);
      const url = URL.createObjectURL(data);
      if (view) setPreview({ url, name, type: data.type, key });
      else {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });
  }

  if (!status && !error) return null;
  const actions = (key: string, name: string) => (
    <Stack key={key} direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ sm: "center" }}>
      <Typography sx={{ flex: 1, overflowWrap: "anywhere" }}>{name}</Typography>
      <Stack direction="row" gap={1}>
        <Button size="small" disabled={busy} onClick={() => file(key, name, true)} aria-label={"צפייה: " + name}>צפייה</Button>
        <Button size="small" disabled={busy} onClick={() => file(key, name, false)} aria-label={"הורדה: " + name}>הורדה</Button>
      </Stack>
    </Stack>
  );
  return (
    <Stack component="section" dir="rtl" gap={1} sx={{ my: 2 }}>
      <Typography component="h2" variant="h6">בקשת הנחה</Typography>
      {error && <Alert severity="error" action={!status ? <Button onClick={() => { setError(""); setRefresh((value) => value + 1); }}>טעינה מחדש</Button> : undefined}>{error}</Alert>}
      {status && <Typography>{labels[status.status]}</Typography>}
      {busy && <CircularProgress size={20} aria-label="טוען" />}
      {status?.status === "disabled" && (
        <Button sx={{ alignSelf: "start" }} variant="outlined" disabled={busy}
          onClick={() => void run(async () => setStatus((await discountApi.enable(traineeId)).data))}>
          אפשר מילוי טופס הנחה
        </Button>
      )}
      {status?.status === "submitted" && <>
        <Typography variant="body2">{new Date(status.submittedAt).toLocaleString("he-IL")}</Typography>
        {actions("pdf", "בקשת הנחה.pdf")}
        {actions("signature", "חתימת ממלא הבקשה.png")}
        {Object.entries(status.attachments).map(([key, name]) => actions(key, name))}
      </>}
      {preview && <Dialog open fullWidth maxWidth="md" dir="rtl" onClose={() => setPreview(undefined)} aria-labelledby="discount-preview">
        <DialogTitle id="discount-preview" sx={{ overflowWrap: "anywhere" }}>{preview.name}</DialogTitle>
        <DialogContent>
          {preview.type.startsWith("image/") ? (
            <Box component="img" src={preview.url} alt={preview.name} sx={{ width: "100%", maxHeight: "65vh", objectFit: "contain" }} />
          ) : preview.key === "pdf" ? (
            <Box component="iframe" referrerPolicy="no-referrer" title={preview.name}
              src={preview.url} sx={{ width: "100%", height: "65vh", border: 0 }} />
          ) : null}
        </DialogContent>
        <DialogActions>
          {preview.type === "application/pdf" &&
            <Button component="a" href={preview.url} target="_blank" rel="noopener noreferrer">פתיחת PDF בכרטיסייה חדשה</Button>}
          <Button component="a" href={preview.url} download={preview.name}>הורדה</Button>
          <Button onClick={() => setPreview(undefined)}>סגירה</Button>
        </DialogActions>
      </Dialog>}
    </Stack>
  );
}
