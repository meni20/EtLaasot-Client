import { stageNames } from "./stageNames";
import { useRef, useState } from "react";
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
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  type DraftResponse,
  type RegistrationApi,
  type RegistrationStatus,
  RegistrationError,
  statuses,
} from "./api";
import {
  useRegistration,
  useRegistrationFeedback,
  useRegistrationStatus,
} from "./hooks";
import { useDraft } from "./useDraft";
import {
  validateForm,
  stageFor,
  type FieldIssue,
  type ProfilePrefill,
} from "./model";
import type { CompletedSignature } from "./SignaturePad";
import {
  ContactsStage,
  DeclarationsStage,
  IdentityStage,
  MedicalStage,
  ParentLetter,
  SigningStage,
} from "./Stages";

export function RegistrationMobile({
  api,
  profile,
  onDemoSubmit,
}: {
  api: RegistrationApi;
  profile: ProfilePrefill;
  onDemoSubmit?: () => Promise<void>;
}) {
  const draft = useRegistration(api);
  const status = useRegistrationStatus(api);
  const feedback = useRegistrationFeedback(api);
  const [epoch, setEpoch] = useState(0);
  const reload = async () => {
    await Promise.all([draft.refetch(), status.refetch(), feedback.refetch()]);
    setEpoch((v) => v + 1);
  };
  if (draft.isPending || status.isPending || feedback.isPending)
    return (
      <Box p={6} role="status">
        <CircularProgress aria-label="טוען טופס" />
      </Box>
    );
  const error = draft.error || status.error || feedback.error;
  if (error || !draft.data || !status.data)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void reload()}>ניסיון נוסף</Button>}
      >
        {error?.message ?? "לא ניתן לטעון את הטופס"}
      </Alert>
    );
  return (
    <MobileForm
      key={`${draft.data.form?.id ?? "new"}-${epoch}`}
      api={api}
      initial={draft.data}
      profile={profile}
      status={status.data}
      feedback={feedback.data?.reason ?? feedback.data?.requestReason}
      reload={reload}
      onDemoSubmit={onDemoSubmit}
    />
  );
}
function MobileForm({
  api,
  initial,
  profile,
  status,
  feedback,
  reload,
  onDemoSubmit,
}: {
  api: RegistrationApi;
  initial: DraftResponse;
  profile: ProfilePrefill;
  status: RegistrationStatus;
  feedback?: string | null;
  reload: () => Promise<void>;
  onDemoSubmit?: () => Promise<void>;
}) {
  const draft = useDraft(
    api,
    initial,
    profile,
    initial.form?.status === "PENDING_REVIEW" ||
      initial.form?.status === "APPROVED" ||
      !status.registrationRequired,
  );
  const [letterRead, setLetterRead] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [issues, setIssues] = useState<FieldIssue[]>([]);
  const [file, setFile] = useState<File>();
  const [signatures, setSignatures] = useState<{
    parent1?: CompletedSignature;
    parent2?: CompletedSignature;
  }>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const [reloadConfirm, setReloadConfirm] = useState(false);
  const formStatus = initial.form?.status;
  const approved =
    formStatus === "APPROVED" ||
    (!!initial.previousApproved && !status.registrationRequired);
  const pending = formStatus === "PENDING_REVIEW";
  const noRequest = !status.registrationRequired && !initial.form && !approved;
  const locked =
    pending ||
    approved ||
    noRequest ||
    draft.saveState === "conflict" ||
    submitting;
  const change = (path: string, value: unknown) => {
    if (locked) return;
    draft.change(path, value);
    setSignatures({});
    setIssues([]);
    setMessage("");
  };
  const serverIssue =
    draft.error instanceof RegistrationError && draft.error.field
      ? draft.error.field.replace(/^data\./, "")
      : null;
  const props = {
    data: draft.data,
    change,
    issues: serverIssue
      ? [
          ...issues,
          {
            path: serverIssue,
            stage: stageFor(serverIssue),
            message: draft.error!.message,
          },
        ]
      : issues,
    disabled: locked,
  };
  const go = (step: number) => {
    draft.navigate(step);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const submit = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setMessage("");
    try {
      const validation = validateForm(draft.data, initial.declarationVersion, {
        physician: !!file || !!draft.data.medical?.physicianSummaryDocumentId,
        parent1: !!signatures.parent1 || !!draft.data.signatures?.parent1,
        parent2: !!signatures.parent2 || !!draft.data.signatures?.parent2,
      });
      setIssues(validation);
      if (validation.length) {
        go(validation[0].stage);
        setMessage(`יש להשלים ${validation.length} שדות לפני השליחה.`);
        return;
      }
      if (!(await draft.flush())) return;
      if (api.mode === "demo") {
        if (!onDemoSubmit) throw new Error("Demo submission unavailable");
        await onDemoSubmit();
      } else {
        if (!api.upload)
          throw new Error("Private upload integration is unavailable");
        let current = await api.me();
        if (!current.form) throw new Error("Save a draft before submitting");
        let data = structuredClone(current.data),
          revision = current.form.revision;
        const save = async () => {
          const next = await api.save({ data, revision, currentStep: 5 });
          data = next.data;
          revision = next.form.revision;
          draft.accept(next);
        };
        if (file) {
          const uploaded = await api.upload({
            kind: "PHYSICIAN_SUMMARY",
            file,
            revision,
          });
          data.medical = {
            ...data.medical,
            physicianSummaryDocumentId: uploaded.documentId,
          };
          delete data.signatures;
          await save();
        }
        for (const signer of ["parent1", "parent2"] as const) {
          const ink = signatures[signer];
          if (!ink) continue;
          const blob = await (await fetch(ink.image)).blob();
          const signing = await api.upload({
            kind: "SIGNATURE",
            file: blob,
            revision,
            signer,
          });
          data.signatures = { ...data.signatures, [signer]: signing };
        }
        await save();
        await api.submit({
          formId: current.form.id,
          revision,
          idempotencyKey: crypto.randomUUID(),
        });
      }
      setSignatures({});
      setFile(undefined);
      await reload();
    } catch (e) {
      if (e instanceof RegistrationError && e.field) {
        const path = e.field.replace(/^data\./, "");
        setIssues([{ path, stage: stageFor(path), message: e.message }]);
        go(stageFor(path));
      }
      setMessage(e instanceof Error ? e.message : "השליחה נכשלה");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };
  return (
    <Box
      dir="rtl"
      sx={{
        maxWidth: 780,
        mx: "auto",
        p: { xs: 3, sm: 6 },
        pb: 10,
        color: "#303050",
      }}
    >
      <Stack gap={4}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography variant="overline" color="primary" fontWeight={700}>
            עת לעשות · האזור האישי
          </Typography>
          <Chip
            size="small"
            label={
              approved
                ? "מאושר"
                : formStatus
                  ? statuses[formStatus]
                  : status.registrationRequired
                    ? "נדרש רישום"
                    : "לא נדרש רישום"
            }
            color={approved ? "success" : "default"}
          />
        </Stack>
        <Typography component="h1" variant="h4" fontWeight={700}>
          רישום הורים לפעילויות
        </Typography>
        <Typography color="text.secondary">
          ממלאים בקצב שלכם. ניתן לעבור בין כל השלבים ולחזור להשלמה.
        </Typography>
        {status.wouldBlockAccess && (
          <Alert severity="info">
            {status.accessBlocked
              ? "נדרש אישור לרישום זה. הגישה לאפליקציה מוגבלת עד לקבלת האישור."
              : "נדרש אישור לרישום זה. חסימת השימוש באפליקציה עדיין אינה מופעלת."}
          </Alert>
        )}
        {formStatus === "CHANGES_REQUESTED" && (
          <Alert severity="warning">
            <b>הטופס הוחזר לתיקון</b>
            <br />
            {feedback || "יש לבדוק את הערות המנהל/ת."}
          </Alert>
        )}
        {pending && (
          <Alert severity="success">
            <b>הטופס נשלח וממתין לאישור מנהל/ת</b>
            <br />
            {api.mode === "demo"
              ? "זהו מצב הדגמה בלבד. לא נשלח טופס אמיתי."
              : "הפרטים החתומים זמינים לצפייה בלבד."}
            <br />
            PDF:{" "}
            {initial.form?.documentStatus === "FAILED"
              ? "ההפקה נכשלה"
              : initial.form?.documentStatus === "READY"
                ? "מוכן ונשמר באחסון פרטי"
                : "ממתין להפקה; ניתן לנסות שוב אם ההפקה נכשלת"}
          </Alert>
        )}
        {approved && (
          <Alert severity="success">
            הרישום אושר. פרטים חתומים אינם ניתנים לעריכה.
          </Alert>
        )}
        {noRequest && (
          <Alert severity="info">כרגע לא נדרש מילוי טופס רישום.</Alert>
        )}
        {!letterRead ? (
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 4, sm: 6 },
              borderColor: "#D9BFD2",
              borderRadius: 4,
            }}
          >
            <ParentLetter />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 5 }}
              onClick={() => setLetterRead(true)}
            >
              {locked ? "המשך לצפייה" : "קראתי, המשך למילוי הטופס"}
            </Button>
          </Paper>
        ) : !initial.form && (approved || noRequest) ? (
          <Paper
            variant="outlined"
            sx={{ p: 5, borderColor: "#D9BFD2", borderRadius: 4 }}
          >
            <Typography>
              אין טופס פעיל לעריכה.
              {approved ? " לצפייה בפרטי הרישום המאושר פנו למנהל/ת הסניף." : ""}
            </Typography>
            <Button onClick={() => setLetterOpen(true)}>המכתב להורים</Button>
          </Paper>
        ) : (
          <>
            <Stack
              direction="row"
              gap={2}
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button onClick={() => setLetterOpen(true)}>המכתב להורים</Button>
              <Typography role="status" aria-live="polite" variant="body2">
                {locked && draft.saveState !== "conflict"
                  ? "צפייה בלבד"
                  : {
                      saved: "כל השינויים נשמרו",
                      dirty: "ממתין לשמירה…",
                      saving: "שומר…",
                      error: "השמירה נכשלה",
                      conflict: "התנגשות גרסאות",
                    }[draft.saveState]}
              </Typography>
            </Stack>
            {draft.saveState === "saving" && <LinearProgress />}
            {draft.error && (
              <Alert
                severity="error"
                action={
                  draft.saveState === "conflict" ? (
                    <Button onClick={() => setReloadConfirm(true)}>
                      טעינת גרסת השרת
                    </Button>
                  ) : (
                    <Button onClick={draft.retry}>ניסיון נוסף</Button>
                  )
                }
              >
                {draft.error.message}
              </Alert>
            )}
            <Box
              component="nav"
              aria-label="שלבי הרישום"
              sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
            >
              {stageNames.map((name, index) => (
                <Button
                  key={name}
                  aria-current={draft.step === index + 1 ? "step" : undefined}
                  onClick={() => go(index + 1)}
                  variant={draft.step === index + 1 ? "contained" : "outlined"}
                  sx={{ flexGrow: 1, fontSize: 13, px: 2 }}
                >
                  {index + 1}. {name}
                </Button>
              ))}
            </Box>
            {pending &&
              initial.form?.documentStatus !== "READY" &&
              api.retryPdf && (
                <Button
                  onClick={() =>
                    void api.retryPdf!()
                      .then(reload)
                      .catch(() =>
                        setMessage(
                          "הפקת PDF נכשלה; ההגשה נשמרה וניתן לנסות שוב.",
                        ),
                      )
                  }
                >
                  ניסיון נוסף להפקת PDF
                </Button>
              )}
            {message && (
              <Alert severity="warning" role="alert">
                {message}
              </Alert>
            )}
            {issues.length > 0 && (
              <Alert severity="error">
                יש להשלים את השדות המסומנים. המעבר בין השלבים פתוח.
              </Alert>
            )}
            <Paper
              component="section"
              aria-label={stageNames[draft.step - 1]}
              variant="outlined"
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 4,
                borderColor: "#D9BFD2",
                minWidth: 0,
              }}
            >
              <Typography variant="overline" color="primary">
                שלב {draft.step} מתוך 5
              </Typography>
              <Typography variant="h5" component="h2" sx={{ mb: 6 }}>
                {stageNames[draft.step - 1]}
              </Typography>
              {draft.step === 1 && (
                <IdentityStage {...props} profileName={profile.name} />
              )}
              {draft.step === 2 && <ContactsStage {...props} />}
              {draft.step === 3 && <MedicalStage {...props} />}
              {draft.step === 4 && (
                <DeclarationsStage
                  {...props}
                  declarations={initial.declarations}
                  version={initial.declarationVersion}
                />
              )}
              {draft.step === 5 && (
                <SigningStage
                  {...props}
                  live={api.mode === "live" && !!api.upload}
                  file={file}
                  onFile={(value) => {
                    setFile(value);
                    setSignatures({});
                    draft.change("signatures", {});
                  }}
                  signatures={signatures}
                  onSignature={(parent, value) =>
                    setSignatures((previous) => ({
                      ...previous,
                      [parent]: value,
                    }))
                  }
                  generation={draft.signatureGeneration}
                />
              )}
            </Paper>
            <Stack direction="row" justifyContent="space-between" gap={3}>
              <Button
                disabled={draft.step === 1}
                onClick={() => go(draft.step - 1)}
              >
                הקודם
              </Button>
              {draft.step < 5 ? (
                <Button variant="contained" onClick={() => go(draft.step + 1)}>
                  השלב הבא
                </Button>
              ) : (
                !locked && (
                  <Button
                    variant="contained"
                    disabled={
                      submitting ||
                      draft.saveState === "conflict" ||
                      draft.saveState === "error"
                    }
                    onClick={() => void submit()}
                  >
                    {api.mode === "demo"
                      ? "הדמיית שליחה (ללא העלאה)"
                      : "שליחת הטופס"}
                  </Button>
                )
              )}
            </Stack>
          </>
        )}
      </Stack>
      <Dialog
        open={letterOpen}
        onClose={() => setLetterOpen(false)}
        fullWidth
        maxWidth="sm"
        dir="rtl"
      >
        <DialogContent>
          <ParentLetter />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLetterOpen(false)}>סגירה</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={reloadConfirm}
        onClose={() => setReloadConfirm(false)}
        dir="rtl"
      >
        <DialogTitle>לטעון את גרסת השרת?</DialogTitle>
        <DialogContent>
          השינויים המקומיים שלא נשמרו והחתימות שבזיכרון יימחקו. לא ייכתב דבר מעל
          הגרסה החדשה בשרת.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReloadConfirm(false)}>ביטול</Button>
          <Button onClick={() => void reload()}>אישור וטעינה</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
