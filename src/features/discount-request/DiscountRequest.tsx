import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox,
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, MenuItem, Stack, TextField, Typography, useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { isAxiosError } from "axios";
import { AUTH_ROLES } from "../../constants/auth.const";
import { useAuth } from "../../contexts/useAuth";
import { SignaturePad, type CompletedSignature } from "../parent-registration/SignaturePad";
import { discountApi, type Answers, type Condition, type Draft, type Field } from "./discount-api";

const success = "הבקשה נשלחה בהצלחה";
const fallback = "הפעולה נכשלה. אפשר לנסות שוב.";
const applies = (rule: Condition | undefined, answers: Answers) =>
  !rule || rule.values.includes(answers[rule.key]);

export function DiscountRequest() {
  const { user, sessionId } = useAuth();
  const isTrainee = user && user.roles.some((role) => role.roleId === AUTH_ROLES.TRAINEE.id)
    && !user.roles.some((role) => role.roleId === AUTH_ROLES.VOLUNTEER.id);
  return isTrainee ? <PersonalDiscountRequest key={user.userId + ":" + sessionId} /> : null;
}

function PersonalDiscountRequest() {
  const [status, setStatus] = useState<"available" | "submitted">();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery("(max-width:600px)");
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => {
      void discountApi.status(controller.signal).then(({ data }) => {
        setStatus((previous) => previous === "submitted" ? previous : data.status);
        if (data.status === "submitted") setOpen(false);
      }).catch(() => undefined);
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  const onSubmitted = useCallback(() => { setOpen(false); setStatus("submitted"); }, []);
  if (!status) return null;
  if (status === "submitted") return <Alert dir="rtl" severity="success">{success}</Alert>;
  return (
    <Box sx={{ my: 2 }} dir="rtl">
      <Button variant="outlined" onClick={() => setOpen(true)}>בקשת הנחה</Button>
      {open && <DiscountDialog fullScreen={fullScreen} onClose={() => setOpen(false)} onSubmitted={onSubmitted} />}
    </Box>
  );
}

function DiscountDialog({ fullScreen, onClose, onSubmitted }: {
  fullScreen: boolean; onClose: () => void; onSubmitted: () => void;
}) {
  const [draft, setDraft] = useState<Draft>();
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void discountApi.draft(controller.signal).then(({ data }) => setDraft(data)).catch(async () => {
      if (controller.signal.aborted) return;
      const result = await discountApi.status(controller.signal).catch(() => undefined);
      if (controller.signal.aborted) return;
      if (result?.data.status === "submitted") onSubmitted();
      else setLoadError(true);
    });
    return () => controller.abort();
  }, [attempt, onSubmitted]);

  return (
    <Dialog open fullWidth maxWidth="md" fullScreen={fullScreen} dir="rtl" aria-labelledby="discount-title">
      <DialogTitle id="discount-title">בקשת הנחה</DialogTitle>
      {draft ? <DiscountForm key={attempt} draft={draft} onClose={onClose} onSubmitted={onSubmitted}
        reload={() => { setDraft(undefined); setLoadError(false); setAttempt((value) => value + 1); }} /> : <>
        <DialogContent>
          {loadError ? <Alert severity="error">{fallback}</Alert> : <CircularProgress size={24} aria-label="טוען טופס" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>סגירה</Button>
          {loadError && <Button onClick={() => { setLoadError(false); setAttempt((value) => value + 1); }}>טעינה מחדש</Button>}
        </DialogActions>
      </>}
    </Dialog>
  );
}

function DiscountForm({ draft, onClose, onSubmitted, reload }: {
  draft: Draft; onClose: () => void; onSubmitted: () => void; reload: () => void;
}) {
  const [answers, setAnswers] = useState(draft.data);
  const [revision, setRevision] = useState(draft.revision);
  const [attachments, setAttachments] = useState(draft.attachments);
  const [signature, setSignature] = useState<CompletedSignature>();
  const [declared, setDeclared] = useState(false);
  const [busy, setBusy] = useState<"save" | "file" | "submit">();
  const pending = useRef(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const documents = draft.documents.filter((document) =>
    applies(document.when, answers) && applies(document.and, answers));

  async function run(action: NonNullable<typeof busy>, operation: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(action);
    setError("");
    setSaved(false);
    try {
      await operation();
    } catch (failure) {
      const response = isAxiosError(failure) ? failure.response : undefined;
      if (response?.status === 409 || response?.status === 404 || action === "submit") {
        const result = await discountApi.status().catch(() => undefined);
        if (result?.data.status === "submitted") {
          onSubmitted();
          return;
        }
      }
      setConflict(response?.status === 409);
      const message: unknown = response?.data?.message;
      setError(typeof message === "string" && response?.status !== 404 ? message : fallback);
    } finally {
      pending.current = false;
      setBusy(undefined);
    }
  }

  async function save() {
    const { data } = await discountApi.save(revision, answers);
    setRevision(data.revision);
    setDirty(false);
    return data.revision;
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!declared || !signature) { setError("יש לאשר את ההצהרה ולהשלים חתימה."); return; }
    const missing = documents.find((document) => !attachments[document.key]);
    if (missing) { setError("חסר מסמך: " + missing.label); return; }
    void run("submit", async () => {
      await discountApi.submit(revision, answers, declared, signature.image);
      onSubmitted();
    });
  }

  const input = (item: Field) => (
    <TextField key={item.key} label={item.label} size="small" fullWidth
      select={item.kind === "select"} multiline={item.kind === "textarea"}
      minRows={item.kind === "textarea" ? 4 : undefined}
      required={!item.optional} value={answers[item.key] ?? ""} disabled={!!busy}
      slotProps={{ htmlInput: {
        maxLength: item.kind === "textarea" ? 3000 : item.kind === "id" ? 9 : 160,
        inputMode: item.kind === "id" ? "numeric" : item.kind === "money" ? "decimal" : item.kind === "phone" ? "tel" : undefined,
        dir: ["id", "money", "phone"].includes(item.kind) ? "ltr" : undefined,
      } }}
      onChange={(event) => {
        const value = event.target.value;
        setAnswers((current) => {
          const next = { ...current, [item.key]: value };
          if (item.key.endsWith("Employment") && value === "na") {
            delete next[item.key.replace("Employment", "Benefit")];
          }
          return next;
        });
        setDirty(true);
        setSaved(false);
      }}
    >
      {item.options && Object.entries(item.options).map(([value, label]) => (
        <MenuItem key={value} value={value}>{label}</MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      <DialogContent dividers>
        <Box component="form" id="discount-form" onSubmit={send} aria-busy={!!busy} noValidate>
          <Stack gap={3}>
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>הסבר למילוי טופס הנחה</AccordionSummary>
              <AccordionDetails><Stack gap={1}>
                {draft.instructions.map((line) => <Typography key={line}>{line}</Typography>)}
              </Stack></AccordionDetails>
            </Accordion>
            {draft.sections.filter((section) => !section.any || section.any.some((rule) => applies(rule, answers))).map((section) => (
              <Box component="section" key={section.title}>
                <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>{section.title}</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: section.fields.length === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
                  {section.fields.filter((item) => applies(item.when, answers)).map(input)}
                </Box>
              </Box>
            ))}
            <Box component="section">
              <Typography component="h2" variant="h6" sx={{ mb: 1 }}>מסמכים תומכים</Typography>
              <Typography sx={{ mb: 1 }}>חובה לצרף את כל המסמכים הרלוונטיים עבור שני ההורים. אפשר לצרף PDF, JPEG, PNG או WebP עד 10 מגה־בייט לקובץ.</Typography>
              <Stack gap={1} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
                {documents.map((document) => (
                  <Stack key={document.key} sx={{ py: 1 }} gap={0.5}>
                    <Typography fontWeight={600}>{document.label}</Typography>
                    {attachments[document.key] && <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{attachments[document.key]}</Typography>}
                    <Stack direction="row" gap={1}>
                      <Button component="label" disabled={!!busy || conflict} variant="outlined" size="small">
                        {attachments[document.key] ? "החלפת קובץ" : "בחירת קובץ"}
                        <input hidden type="file" aria-label={document.label} accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            event.currentTarget.value = "";
                            if (!file) return;
                            void run("file", async () => {
                              if (file.size > 10 * 1024 * 1024) throw new Error();
                              const currentRevision = dirty ? await save() : revision;
                              const { data } = await discountApi.upload(currentRevision, document.key, file);
                              setRevision(data.revision);
                              setAttachments((current) => ({ ...current, [document.key]: data.name }));
                            });
                          }} />
                      </Button>
                      {attachments[document.key] && <Button size="small" disabled={!!busy || conflict}
                        onClick={() => void run("file", async () => {
                          const { data } = await discountApi.remove(revision, document.key);
                          setRevision(data.revision);
                          setAttachments(({ [document.key]: _removed, ...remaining }) => remaining);
                        })}>הסרה</Button>}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Box component="section">
              <Typography component="h2" variant="h6" sx={{ mb: 1 }}>הצהרה</Typography>
              {draft.declarations.map((line) => <Typography key={line} sx={{ mb: 1 }}>{line}</Typography>)}
              <FormControlLabel label="קראתי ואני מאשר/ת את ההצהרה" control={<Checkbox checked={declared} disabled={!!busy}
                onChange={(event) => setDeclared(event.target.checked)} />} />
            </Box>
            <Box sx={{ maxWidth: 580, pointerEvents: busy ? "none" : undefined }} inert={!!busy}>
              <SignaturePad label="חתימת ממלא הבקשה" value={signature} onChange={setSignature} maxPixelRatio={2} />
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      {error && <Alert severity="error" action={conflict ? <Button onClick={reload}>טעינה מחדש</Button> : undefined}>{error}</Alert>}
      {saved && <Alert severity="success">הטיוטה נשמרה</Alert>}
      {confirmClose && <Alert severity="warning" action={<Button onClick={onClose}>סגירה</Button>}>יש שינויים שטרם נשמרו בטיוטה.</Alert>}
      <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button disabled={!!busy} onClick={() => dirty ? setConfirmClose(true) : onClose()}>סגירה</Button>
        <Button disabled={!!busy || conflict} onClick={() => void run("save", async () => { await save(); setSaved(true); setConfirmClose(false); })}>שמירת טיוטה</Button>
        <Button variant="contained" type="submit" form="discount-form" disabled={!!busy || conflict}>
          {busy === "submit" ? <><CircularProgress size={18} color="inherit" sx={{ mx: 1 }} />שולח בקשה</> : "שליחת בקשה"}
        </Button>
      </DialogActions>
    </>
  );
}
