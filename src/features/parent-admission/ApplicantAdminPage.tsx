import { RecoveryAuthorization } from "./RecoveryAuthorization";
import { useReloadGuard } from "../../hooks/useReloadGuard";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { useAuth } from "../../contexts/useAuth";
import { useBranch } from "../../contexts/useBranch";
import {
  ContactsStage,
  IdentityStage,
  MedicalStage,
} from "../parent-registration/Stages";
import {
  createApplicationAdminApi,
  type ApplicationDetail,
  type WelcomeEmailStatus,
} from "./api";
import type { RegistrationData } from "../parent-registration/contracts";
import type { VolunteerData } from "../volunteer-registration/contracts";
import { RegistrationError } from "../parent-registration/api";
import {
  normalizeRegistrationType,
  type RegistrationType,
} from "./registration-type";
import { VolunteerApplicationDetails } from "./VolunteerApplicationDetails";

import { volunteerApprovalBlockers } from "./volunteer-review.model";

const labels = {
  DRAFT: "טיוטה",
  PENDING_REVIEW: "ממתין לבדיקה",
  CHANGES_REQUESTED: "נדרשים תיקונים",
  REJECTED: "נדחה",
  APPROVED: "אושר",
};
export default function ApplicantAdminPage() {
  const { sessionId } = useAuth();
  return <ApplicantAdminWorkspace key={sessionId ?? "anonymous"} />;
}
function ApplicantAdminWorkspace() {
  const volunteerEnabled =
    import.meta.env.VITE_VOLUNTEER_REGISTRATION_ENABLED === "true";
  const { availableBranches } = useBranch(),
    { user, sessionId } = useAuth();
  const branches = availableBranches.filter((b) =>
    user?.roles.some(
      (r) => r.roleId === 10001 || (r.roleId === 10000 && r.branchId === b.id),
    ),
  );
  const [api] = useState(createApplicationAdminApi),
    [branch, setBranch] = useState(branches[0]?.id ?? "");
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState(""),
    [reason, setReason] = useState(""),
    [verifiedVersion, setVerifiedVersion] = useState("");
  const [type, setType] = useState<RegistrationType | "ALL">(
    volunteerEnabled ? "ALL" : "TRAINEE",
  );
  const [status, setStatus] = useState(""),
    [search, setSearch] = useState("");
  const [confirmation, setConfirmation] = useState<{
    action: "approve" | "reject";
    id: string;
    versionId: string;
    reason: string;
    welcomeEmailConfirmed?: boolean;
  } | null>(null);
  const [welcomeResult, setWelcomeResult] = useState<{
    id: string;
    value: WelcomeEmailStatus;
  } | null>(null);
  const [approvalConfirmation, setApprovalConfirmation] = useState("");
  useEffect(() => setApprovalConfirmation(""), [selected]);
  const [passwordExpires, setPasswordExpires] = useState("");
  const [deletion, setDeletion] = useState<{
    id: string;
    revision: number;
    confirmed: boolean;
    status?: string;
    error?: string;
  } | null>(null);
  const [recovery, setRecovery] = useState<{
    id: string;
    verified: boolean;
    code?: string;
    expiresAt?: string;
    copied?: boolean;
    error?: string;
  } | null>(null);
  const [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useReloadGuard(
    busy ||
      !!deletion ||
      !!password ||
      !!confirmation ||
      !!recovery ||
      (!!selected && !!reason),
  );
  const cache = useQueryClient();
  const deletionStatus = useQuery({
    queryKey: ["draft-deletion", sessionId, deletion?.id],
    queryFn: () => api.draftDeletionStatus(deletion!.id),
    enabled:
      !!deletion?.status && !["COMPLETE", "FAILED"].includes(deletion.status),
    retry: false,
    gcTime: 0,
    refetchInterval: 3000,
  });
  useEffect(() => {
    const status = deletionStatus.data?.status;
    if (!status) return;
    setDeletion((current) => (current ? { ...current, status } : current));
    if (status === "COMPLETE") {
      setSelected("");
      void cache.invalidateQueries({ queryKey: ["applications"] });
    }
  }, [deletionStatus.data, cache]);
  const list = useQuery({
    queryKey: [
      "applications",
      "list",
      sessionId,
      branch,
      page,
      type,
      status,
      search,
    ],
    queryFn: () => api.list(branch, page, type, status, search),
    enabled: !!branch,
    retry: false,
    gcTime: 0,
  });
  const detail = useQuery({
    queryKey: ["applications", "detail", sessionId, branch, selected],
    queryFn: () => api.detail(selected),
    enabled: !!selected,
    retry: false,
    gcTime: 0,
    refetchInterval: (query) =>
      ["PENDING", "PROCESSING"].includes(
        query.state.data?.welcomeEmail?.status ?? "",
      )
        ? 3000
        : false,
  });
  const setVerified = (value: boolean) =>
    setVerifiedVersion(value ? (detail.data?.versions[0]?.id ?? "") : "");
  const run = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
      await cache.invalidateQueries({ queryKey: ["applications"] });
    } catch (error) {
      setPassword("");
      setShowPassword(false);
      setVerified(false);
      setConfirmation(null);
      setError(
        error instanceof RegistrationError && error.status === 409
          ? "הגרסה או מסמכי הבקשה השתנו. יש לבדוק מחדש את הבקשה לפני החלטה."
          : "הפעולה לא הושלמה. יש לבדוק הרשאה, גרסה עדכנית וזמינות מסמכים.",
      );
      await cache.invalidateQueries({ queryKey: ["applications"] });
    } finally {
      setBusy(false);
    }
  };
  const reset = () => {
    setRecovery(null);
    setSelected("");
    setReason("");
    setVerified(false);
    setPassword("");
    setShowPassword(false);
    setConfirmation(null);
    setError("");
  };
  const doc =
      detail.data &&
      (volunteerEnabled ||
        normalizeRegistrationType(detail.data.application.registrationType) ===
          "TRAINEE")
        ? detail.data
        : undefined,
    latest = doc?.versions[0];
  const verified = !!latest && verifiedVersion === latest.id;
  const isVolunteer =
    doc &&
    normalizeRegistrationType(doc.application.registrationType) === "VOLUNTEER";
  const blockers = isVolunteer
    ? volunteerApprovalBlockers(doc as ApplicationDetail<"VOLUNTEER">)
    : [];
  const canApprove = !!doc && canApproveApplication(doc) && !blockers.length;
  const existingPassword = doc?.authentication === "EXISTING_PASSWORD";
  const recipient = existingPassword
    ? doc?.approvalNotificationEmail
    : isVolunteer
      ? (latest?.data as VolunteerData | undefined)?.volunteer?.email
      : (latest?.data as RegistrationData | undefined)?.trainee?.email;
  const emailEnabled =
    !!doc?.welcomeEmail && doc.welcomeEmail.status !== "DISABLED";
  const welcome =
    doc?.application.status === "APPROVED"
      ? doc.welcomeEmail
      : welcomeResult?.id === selected
        ? welcomeResult.value
        : undefined;
  return (
    <Box dir="rtl" p={5}>
      <Stack gap={3}>
        <Typography component="h1" variant="h5" color="primary">
          בקשות הרשמה
        </Typography>
        <RecoveryAuthorization />
        {approvalConfirmation && (
          <Alert severity="success" onClose={() => setApprovalConfirmation("")}>
            {approvalConfirmation}
          </Alert>
        )}
        {welcome && (
          <Alert severity={welcome.status === "FAILED" ? "warning" : "info"}>
            החשבון אושר. {welcomeLabel(welcome, existingPassword)}{" "}
            {welcome.recipient && `(${welcome.recipient})`}
            {welcome.retryable && (
              <Button
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    const value = await api.retryWelcomeEmail(selected);
                    setWelcomeResult({ id: selected, value });
                  })
                }
              >
                ניסיון שליחה נוסף
              </Button>
            )}
          </Alert>
        )}
        <Alert severity="warning">
          {volunteerEnabled
            ? "אלה בקשות ללא חשבון מאומת. אישור דורש אימות ידני, את כל הראיות הנדרשות ו-PDF חתום מאומת של הגרסה שנבדקה. הקבצים נשמרים באחסון פרטי."
            : "אלה בקשות ללא חשבון מאומת. אישור דורש אימות ידני, סיכום רפואי ו-PDF חתום מאומת של הגרסה שנבדקה. הקבצים נשמרים באחסון פרטי."}
        </Alert>
        <TextField
          select
          label="סניף"
          value={branch}
          disabled={busy}
          onChange={(e) => {
            setBranch(e.target.value);
            setSelected("");
            setReason("");
            setVerified(false);
            setPassword("");
            setPage(1);
            setShowPassword(false);
            setConfirmation(null);
            setRecovery(null);
          }}
        >
          {branches.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" gap={2} flexWrap="wrap">
          {volunteerEnabled && (
            <TextField
              select
              label="סוג הרשמה"
              sx={{ minWidth: 180 }}
              value={type}
              disabled={busy}
              onChange={(e) => {
                setType(e.target.value as RegistrationType | "ALL");
                setPage(1);
                reset();
              }}
            >
              <MenuItem value="ALL">הכול</MenuItem>
              <MenuItem value="TRAINEE">חניכים</MenuItem>
              <MenuItem value="VOLUNTEER">מתנדבים</MenuItem>
            </TextField>
          )}
          <TextField
            select
            label="מצב בקשה"
            sx={{ minWidth: 180 }}
            value={status}
            disabled={busy}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
              reset();
            }}
          >
            <MenuItem value="">כל המצבים</MenuItem>
            {Object.entries(labels).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="חיפוש לפי שם"
            sx={{ minWidth: 240 }}
            value={search}
            disabled={busy}
            onChange={(e) => {
              setSearch(e.target.value.slice(0, 100));
              setPage(1);
              reset();
            }}
          />
        </Stack>
        {(error || list.isError || detail.isError) && (
          <Alert severity="error">
            {error || "לא ניתן לטעון בקשות מורשות"}
          </Alert>
        )}
        {list.data?.rows.map((app) => (
          <Stack key={app.id} direction="row" gap={1} alignItems="center">
            <Button
              fullWidth
              disabled={busy}
              variant={selected === app.id ? "contained" : "outlined"}
              onClick={() => {
                if (app.deletionPending) {
                  setDeletion({
                    id: app.id,
                    revision: app.revision,
                    confirmed: true,
                    status: "PENDING",
                  });
                  return;
                }
                setSelected(app.id);
                setReason("");
                setVerified(false);
                setPassword("");
                setShowPassword(false);
                setConfirmation(null);
                setError("");
              }}
            >
              {app.applicantName || "ללא שם"} ·{" "}
              {app.deletionPending ? "מחיקה בטיפול" : labels[app.status]}
            </Button>
            {volunteerEnabled && (
              <Chip
                label={
                  normalizeRegistrationType(app.registrationType) ===
                  "VOLUNTEER"
                    ? "מתנדב"
                    : "חניך"
                }
              />
            )}
            {app.pdfDocumentId && (
              <IconButton
                size="small"
                color="primary"
                aria-label={`פתיחת PDF הרישום של ${app.applicantName || "החניך"}`}
                onClick={(event) => {
                  event.stopPropagation();
                  const url = new URL(
                    "/registration-pdf",
                    window.location.origin,
                  );
                  url.searchParams.set("source", "APPLICATION");
                  url.searchParams.set("formId", app.id);
                  url.searchParams.set("documentId", app.pdfDocumentId!);
                  const pdfTab = window.open(url.toString(), "_blank");
                  if (!pdfTab) {
                    window.alert(
                      "הדפדפן חסם את פתיחת ה-PDF. יש לאפשר חלונות קופצים ולנסות שוב.",
                    );
                    return;
                  }
                  pdfTab.opener = null;
                }}
                sx={{ width: 40, height: 40, flex: "0 0 auto" }}
              >
                <PictureAsPdfOutlined fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
        <Stack direction="row" gap={2}>
          <Button
            disabled={busy || page <= 1}
            onClick={() => {
              setPage((p) => p - 1);
              setSelected("");
              setPassword("");
              setShowPassword(false);
              setConfirmation(null);
            }}
          >
            הקודם
          </Button>
          <Typography>עמוד {page}</Typography>
          <Button
            disabled={busy || !list.data || page * 25 >= list.data.count}
            onClick={() => {
              setPage((p) => p + 1);
              setSelected("");
              setPassword("");
              setShowPassword(false);
              setConfirmation(null);
            }}
          >
            הבא
          </Button>
        </Stack>
        {doc && (
          <>
            <Typography variant="h6">
              {labels[doc.application.status]} · סניף{" "}
              {branches.find((b) => b.id === doc.application.branchId)?.name}
            </Typography>
            {doc.application.feedbackReason && (
              <Alert severity="info">{doc.application.feedbackReason}</Alert>
            )}
            {doc.recoveryEligible === true && (
              <Button
                variant="outlined"
                disabled={busy}
                onClick={() =>
                  setRecovery({ id: doc.application.id, verified: false })
                }
              >
                הנפקת קוד שחזור חדש
              </Button>
            )}
            {doc.canDeleteDraft === true && (
              <Button
                color="error"
                variant="outlined"
                disabled={busy || !!deletion}
                onClick={() =>
                  setDeletion({
                    id: doc.application.id,
                    revision: doc.application.revision,
                    confirmed: false,
                  })
                }
              >
                מחיקת טיוטה
              </Button>
            )}
            {isVolunteer ? (
              <VolunteerApplicationDetails
                detail={doc as ApplicationDetail<"VOLUNTEER">}
              />
            ) : (
              <SignedApplication detail={doc as ApplicationDetail<"TRAINEE">} />
            )}
            {doc.documents
              .filter((d) => {
                if (!isVolunteer)
                  return !d.versionId || d.versionId === latest?.id;
                const data = (doc as ApplicationDetail<"VOLUNTEER">).versions[0]
                  ?.data;
                return (
                  d.versionId === latest?.id ||
                  [
                    data?.policeClearanceDocumentId,
                    ...Object.values(data?.signatures ?? {}).map(
                      (s) => s.documentId,
                    ),
                  ].includes(d.id)
                );
              })
              .map((d) => (
                <Button
                  key={d.id}
                  onClick={() =>
                    void run(async () => {
                      const blob = await api.document(selected, d.id);
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download =
                        d.kind === "REGISTRATION_PDF"
                          ? "registration.pdf"
                          : `evidence.${d.mimeType === "application/pdf" ? "pdf" : d.mimeType === "image/png" ? "png" : "jpg"}`;
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(url), 60000);
                    })
                  }
                >
                  הורדת{" "}
                  {d.kind === "REGISTRATION_PDF"
                    ? "PDF הרישום"
                    : d.kind === "PHYSICIAN_SUMMARY"
                      ? "סיכום רפואי"
                      : d.kind === "POLICE_CLEARANCE"
                        ? "אישור משטרה"
                        : isVolunteer
                          ? ({
                              VOLUNTEER_AGREEMENT: "חתימת הסכם ההתנדבות",
                              PARENTAL_CONSENT: "חתימת הורה",
                              CONFIDENTIALITY: "חתימת סודיות",
                            }[
                              d.signaturePurpose as
                                | "VOLUNTEER_AGREEMENT"
                                | "PARENTAL_CONSENT"
                                | "CONFIDENTIALITY"
                            ] ?? "חתימה")
                          : "חתימה"}
                </Button>
              ))}
            {doc.application.status === "PENDING_REVIEW" &&
              doc.application.documentStatus !== "READY" && (
                <Button
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await api.retryPdf(selected);
                    })
                  }
                >
                  ניסיון נוסף להפקת PDF
                </Button>
              )}
            <TextField
              label="סיבת החזרה לתיקון או דחייה"
              multiline
              disabled={busy}
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 2000))}
            />
            <Stack direction="row" gap={2} flexWrap="wrap">
              <Button
                disabled={
                  busy ||
                  doc.application.status !== "PENDING_REVIEW" ||
                  !latest ||
                  !reason.trim()
                }
                onClick={() =>
                  void run(async () => {
                    await api.review(
                      selected,
                      "request-changes",
                      reason,
                      latest!.id,
                    );
                    setVerified(false);
                    setReason("");
                  })
                }
              >
                החזרה לתיקון
              </Button>
              <Button
                color="error"
                disabled={
                  busy ||
                  doc.application.status !== "PENDING_REVIEW" ||
                  !latest ||
                  !reason.trim()
                }
                onClick={() =>
                  setConfirmation({
                    action: "reject",
                    id: selected,
                    versionId: latest!.id,
                    reason,
                  })
                }
              >
                דחיית בקשה
              </Button>
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={verified}
                  disabled={busy}
                  onChange={(_, v) => setVerified(v)}
                />
              }
              label={
                isVolunteer
                  ? "אימתתי ידנית את זהות המתנדב, המסמכים ושיוכו לסניף"
                  : "אימתתי ידנית את זהות החניך וההורה ואת שיוכם לסניף"
              }
            />
            <Button
              variant="contained"
              disabled={busy || !verified || !latest || !canApprove}
              onClick={() =>
                setConfirmation({
                  action: "approve",
                  id: selected,
                  versionId: latest!.id,
                  reason: "",
                })
              }
            >
              {isVolunteer
                ? "אישור ויצירת חשבון מתנדב"
                : "אישור ויצירת חשבון חניך"}
            </Button>
            {!canApprove && (
              <Alert severity="info">
                לא ניתן לאשר לפני שכל המסמכים והראיות של ההגשה העדכנית יהיו
                מוכנים ומאומתים. לא נוצר חשבון.
                {blockers.map((b) => (
                  <Typography key={b}>{b}</Typography>
                ))}
              </Alert>
            )}
            {doc.history && (
              <Stack gap={1}>
                <Typography variant="h6">היסטוריית הבקשה</Typography>
                {doc.history.map((h) => (
                  <Typography key={h.id}>
                    {h.createdAt} ·{" "}
                    {labels[h.action as keyof typeof labels] ??
                      {
                        CREATED: "נוצרה בקשה",
                        SUBMITTED: "הוגשה גרסה",
                        PDF_GENERATED: "הופק PDF",
                        PDF_FAILED: "הפקת PDF נכשלה",
                        RECOVERED: "שוחזרה גישה",
                        SESSION_REVOKED: "בוטלה גישה",
                      }[h.action as "CREATED"] ??
                      h.action}{" "}
                    ·{" "}
                    {h.versionId
                      ? `גרסה ${doc.versions.find((v) => v.id === h.versionId)?.versionNumber ?? ""} · `
                      : ""}
                    {h.reason ?? ""}
                    {h.actorUuid && h.action === "RECOVERED"
                      ? ` · מנהל: ${h.actorUuid}`
                      : ""}
                  </Typography>
                ))}
              </Stack>
            )}
            {isVolunteer &&
              doc.documents
                .filter(
                  (d) =>
                    d.kind === "REGISTRATION_PDF" && d.versionId !== latest?.id,
                )
                .map((d) => (
                  <Button
                    key={d.id}
                    onClick={() =>
                      void run(async () => {
                        const blob = await api.document(selected, d.id);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "registration-history.pdf";
                        a.click();
                        setTimeout(() => URL.revokeObjectURL(url), 60000);
                      })
                    }
                  >
                    PDF גרסה{" "}
                    {
                      doc.versions.find((v) => v.id === d.versionId)
                        ?.versionNumber
                    }{" "}
                    · היסטוריה פרטית
                  </Button>
                ))}
          </>
        )}
        <Dialog
          open={!!deletion}
          onClose={() => {
            if (!busy) setDeletion(null);
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { direction: "rtl" } }}
        >
          <DialogTitle>מחיקת טיוטה לצמיתות</DialogTitle>
          <DialogContent>
            <Stack gap={2}>
              {!deletion?.status && (
                <>
                  <Typography>
                    פעולה זו בלתי הפיכה במערכת הפעילה. פרטי הטיוטה, החתימות,
                    המסמכים וקודי הגישה יימחקו. רק לאחר השלמת המחיקה ניתן יהיה
                    להתחיל הרשמה חדשה עם אותה תעודת זהות. גיבויים היסטוריים אינם
                    נמחקים בפעולה זו.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={deletion?.confirmed ?? false}
                        disabled={busy}
                        onChange={(_, confirmed) =>
                          setDeletion((d) => (d ? { ...d, confirmed } : d))
                        }
                      />
                    }
                    label="אני מאשר/ת מחיקה בלתי הפיכה של הטיוטה במערכת הפעילה"
                  />
                </>
              )}
              {deletion?.status === "COMPLETE" ? (
                <Alert severity="success">
                  הטיוטה וקבציה נמחקו מהמערכת הפעילה. ניתן להתחיל הרשמה חדשה.
                </Alert>
              ) : deletion?.status === "FAILED" ? (
                <Alert severity="error">
                  המחיקה טרם הושלמה. הגישה לבקשה חסומה ותעודת הזהות טרם שוחררה.
                  יש לנסות שוב.
                </Alert>
              ) : deletion?.status ? (
                <Alert severity="info" role="status">
                  המחיקה בטיפול. הגישה לבקשה נחסמה. אין להתחיל הרשמה חדשה עד
                  לאישור השלמת המחיקה.
                </Alert>
              ) : null}
              {(deletion?.error || deletionStatus.isError) && (
                <Alert severity="error">
                  {deletion?.error ||
                    "לא ניתן לבדוק אם המחיקה הושלמה. יש לבדוק שוב; אין אישור למחיקה מלאה."}
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setDeletion(null)}>
              {deletion?.status ? "סגירה" : "ביטול"}
            </Button>
            {(!deletion?.status || deletion.status === "FAILED") && (
              <Button
                color="error"
                variant="contained"
                disabled={busy || !deletion?.confirmed}
                onClick={async () => {
                  if (!deletion || busy || !deletion.confirmed) return;
                  setBusy(true);
                  try {
                    const result = await api.deleteDraft(
                      deletion.id,
                      deletion.revision,
                    );
                    setDeletion((d) =>
                      d ? { ...d, status: result.status, error: undefined } : d,
                    );
                    void cache.invalidateQueries({
                      queryKey: ["applications"],
                    });
                  } catch {
                    setDeletion((d) =>
                      d
                        ? {
                            ...d,
                            error:
                              "לא ניתן למחוק את הטיוטה. יש לבדוק הרשאה, מצב בקשה וגרסה עדכנית.",
                          }
                        : d,
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy
                  ? "שולח…"
                  : deletion?.status === "FAILED"
                    ? "ניסיון מחיקה נוסף"
                    : "מחיקת טיוטה לצמיתות"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={!!recovery}
          onClose={() => {
            if (!busy) setRecovery(null);
          }}
          dir="rtl"
          fullWidth
        >
          <DialogTitle>הנפקת קוד שחזור חדש</DialogTitle>
          <DialogContent>
            <Stack gap={2}>
              <Typography>מספר בקשה: {recovery?.id}</Typography>
              {recovery?.error && (
                <Alert severity="error">{recovery.error}</Alert>
              )}
              {recovery?.code ? (
                <>
                  <Alert severity="warning">
                    הקוד מוצג פעם אחת. יש למסור אותו רק לפונה שזהותו אומתה, ולא
                    לשמור אותו בהערות הבקשה. הקוד הקודם והגישה הקודמת אינם
                    תקפים.
                  </Alert>
                  <TextField
                    label="קוד שחזור למסירה"
                    value={recovery.code}
                    slotProps={{
                      input: { readOnly: true },
                      htmlInput: { dir: "ltr" },
                    }}
                  />
                  <Typography>
                    תוקף הקוד:{" "}
                    {new Date(recovery.expiresAt!).toLocaleString("he-IL")}
                  </Typography>
                  <Button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(recovery.code!);
                        setRecovery((current) =>
                          current
                            ? { ...current, copied: true, error: undefined }
                            : null,
                        );
                      } catch {
                        setRecovery((current) =>
                          current
                            ? {
                                ...current,
                                error:
                                  "לא ניתן להעתיק אוטומטית. יש לסמן את הקוד ולהעתיק ידנית.",
                              }
                            : null,
                        );
                      }
                    }}
                  >
                    העתקת קוד השחזור
                  </Button>
                  {recovery.copied && (
                    <Alert severity="success" role="status">
                      קוד השחזור הועתק
                    </Alert>
                  )}
                </>
              ) : (
                <>
                  <Typography>
                    הפעולה תבטל את הקוד והגישה הקודמים ותאפשר שחזור של אותה
                    בקשה. המידע, החתימות, המסמכים והיסטוריית ההגשות יישמרו.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={recovery?.verified ?? false}
                        disabled={busy}
                        onChange={(_, verified) =>
                          setRecovery((current) =>
                            current ? { ...current, verified } : null,
                          )
                        }
                      />
                    }
                    label="אימתתי באופן עצמאי את זהות הפונה המבקש לשחזר גישה"
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setRecovery(null)}>
              {recovery?.code ? "סיום והסרת הקוד מהמסך" : "ביטול"}
            </Button>
            {!recovery?.code && (
              <Button
                disabled={busy || !recovery?.verified}
                onClick={async () => {
                  if (busy || !recovery?.verified) return;
                  const id = recovery.id;
                  setBusy(true);
                  try {
                    const result = await api.reissueRecoveryCode(
                      id,
                      recovery.verified,
                    );
                    setRecovery({
                      id,
                      verified: false,
                      code: result.recoveryCode,
                      expiresAt: result.recoveryExpiresAt,
                    });
                    void cache
                      .invalidateQueries({ queryKey: ["applications"] })
                      .catch(() => {});
                  } catch (error) {
                    const message =
                      error instanceof RegistrationError && error.status === 429
                        ? "בוצעו ניסיונות רבים מדי. יש להמתין ולנסות שוב."
                        : error instanceof RegistrationError &&
                            error.status === 403
                          ? "אין הרשאה להנפיק קוד לבקשה זו."
                          : error instanceof RegistrationError &&
                              error.status === 409
                            ? "לבקשה כבר נוצר חשבון. יש להשתמש בכניסה עם סיסמה."
                            : "לא התקבל קוד שחזור. אם ההנפקה נקלטה, הקוד הקודם כבר אינו תקף. יש לאמת זהות ולנסות להנפיק שוב.";
                    setRecovery({ id, verified: false, error: message });
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "מנפיק קוד…" : "אישור והנפקת קוד"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={!!password}
          onClose={() => {
            setPassword("");
            setShowPassword(false);
          }}
          dir="rtl"
          fullWidth
        >
          <DialogTitle>מסירה חד-פעמית של סיסמה זמנית</DialogTitle>
          <DialogContent>
            <Stack gap={2}>
              <Alert severity="warning">
                הסיסמה מוצגת פעם אחת למנהל לצורך מסירה ידנית. אין לשמור אותה
                בהערות או לשלוח אותה באימייל. אם נשלח קישור לבחירת סיסמה, מסירה
                ידנית היא גיבוי בלבד.
              </Alert>
              <TextField
                label="סיסמה זמנית למסירה"
                type={showPassword ? "text" : "password"}
                value={password}
                slotProps={{ input: { readOnly: true } }}
              />
              <Typography>תוקף הסיסמה: {passwordExpires}</Typography>
              <Button onClick={() => setShowPassword((v) => !v)}>
                הצגה / הסתרה
              </Button>
              <Button
                onClick={() => {
                  setPassword("");
                  setShowPassword(false);
                }}
              >
                סיום והסרת הסיסמה מהמסך
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!confirmation}
          onClose={() => {
            if (!busy) setConfirmation(null);
          }}
          dir="rtl"
          fullWidth
        >
          <DialogTitle>
            {confirmation?.action === "approve"
              ? "אישור הבקשה ויצירת חשבון"
              : "אישור דחיית בקשה"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {confirmation?.action === "approve"
                ? existingPassword
                  ? "הפעולה תיצור חשבון עבור הגרסה שנבדקה. המבקש יוכל להיכנס עם הסיסמה שבחר בעת ההרשמה."
                  : "הפעולה תיצור חשבון עבור הגרסה שנבדקה. סיסמה זמנית תוצג פעם אחת כגיבוי למסירה ידנית."
                : `הבקשה תידחה. סיבה: ${confirmation?.reason ?? ""}`}
            </Typography>
            {confirmation?.action === "approve" &&
              emailEnabled &&
              recipient &&
              (existingPassword ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  הודעת האישור תאפשר כניסה עם הסיסמה הקיימת. לא יישלח קישור
                  לבחירת סיסמה.
                  {!isVolunteer && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmation.welcomeEmailConfirmed === true}
                          onChange={(e) =>
                            setConfirmation(
                              (current) =>
                                current && {
                                  ...current,
                                  welcomeEmailConfirmed: e.target.checked,
                                },
                            )
                          }
                        />
                      }
                      label={`אני מאשר/ת שליחת הודעת אישור לכתובת ההרשמה ${recipient}`}
                    />
                  )}
                </Alert>
              ) : isVolunteer ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  לאחר האישור תישלח הודעת ברוכים הבאים וקישור לבחירת סיסמה
                  לכתובת {recipient}. באישורכם אתם מאשרים שזו כתובת מורשית של
                  המבקש. סיסמה זמנית לא תישלח באימייל.
                </Alert>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmation.welcomeEmailConfirmed === true}
                      onChange={(e) =>
                        setConfirmation(
                          (current) =>
                            current && {
                              ...current,
                              welcomeEmailConfirmed: e.target.checked,
                            },
                        )
                      }
                    />
                  }
                  label={`אימתתי שהכתובת ${recipient} מורשית לקבל קישור לבחירת סיסמה עבור החניך, ואני מאשר/ת שליחה אליה`}
                />
              ))}
            {confirmation?.action === "approve" &&
              (!emailEnabled || !recipient) && (
                <Typography sx={{ mt: 1 }}>
                  {existingPassword
                    ? "המבקש יוכל להיכנס עם הסיסמה שבחר בעת ההרשמה גם ללא הודעת אימייל."
                    : "שליחת קישור אינה זמינה לבקשה זו. יש למסור את הסיסמה הזמנית ידנית."}
                </Typography>
              )}
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setConfirmation(null)}>
              ביטול
            </Button>
            <Button
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  if (!confirmation) return;
                  const decision = confirmation;
                  setPassword("");
                  setShowPassword(false);
                  if (decision.action === "approve") {
                    const result = await api.approve(
                      decision.id,
                      decision.versionId,
                      decision.welcomeEmailConfirmed === true,
                    );
                    if (result.welcomeEmail)
                      setWelcomeResult({
                        id: decision.id,
                        value: result.welcomeEmail,
                      });
                    if (result.authentication === "EXISTING_PASSWORD") {
                      setApprovalConfirmation(
                        "הבקשה אושרה. ניתן להיכנס למערכת עם הסיסמה שנבחרה בעת ההרשמה.",
                      );
                      setPassword("");
                    } else setPassword(result.temporaryPassword ?? "");
                    setPasswordExpires(result.temporaryPasswordExpiresAt ?? "");
                  } else
                    await api.review(
                      decision.id,
                      "reject",
                      decision.reason,
                      decision.versionId,
                    );
                  setConfirmation(null);
                  setVerified(false);
                  setReason("");
                })
              }
            >
              {confirmation?.action === "approve"
                ? "אישור ויצירת חשבון"
                : "דחיית הבקשה"}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
function welcomeLabel(value: WelcomeEmailStatus, existingPassword = false) {
  if (value.notificationOnly || existingPassword) {
    const messages: Record<string, string> = {
      DISABLED:
        "שליחת אימייל אינה פעילה. המבקש יכול להיכנס עם הסיסמה שבחר בהרשמה.",
      SKIPPED: "לא נשלח אימייל. המבקש יכול להיכנס עם הסיסמה שבחר בהרשמה.",
      CANCELLED: "הודעת האישור בוטלה. המבקש יכול להיכנס עם הסיסמה שבחר בהרשמה.",
      FAILED:
        "שליחת הודעת האישור נכשלה. אפשר לנסות שוב; החשבון כבר פעיל עם הסיסמה הקיימת.",
    };
    if (messages[value.status]) return messages[value.status];
  }
  if (value.passwordSet) return "הסיסמה האישית כבר נבחרה.";
  const text: Record<string, string> = {
    PENDING: "הודעת ברוכים הבאים ממתינה לשליחה; החשבון כבר אושר.",
    PROCESSING: "הודעת ברוכים הבאים נשלחת כעת.",
    SENT: "ההודעה נמסרה לשרת הדואר. קבלת ההודעה בתיבה אינה מובטחת.",
    FAILED:
      "שליחת האימייל נכשלה. האישור נשמר; אפשר לנסות שליחה שוב או להשתמש במסירה ידנית.",
    SKIPPED:
      "לא נשלח אימייל: חסרה כתובת מורשית ומאושרת או שהנמען חסום בסביבת הבדיקה. יש להשתמש במסירה ידנית.",
    CANCELLED:
      "קישור בחירת הסיסמה בוטל. השתמשו באיפוס הסיסמה הקיים במידת הצורך.",
    EXPIRED: "תוקף הקישור פג. השתמשו באיפוס הסיסמה הקיים במידת הצורך.",
    DISABLED: "שליחת אימייל אינה פעילה. יש למסור את הסיסמה הזמנית ידנית.",
    NOT_QUEUED:
      "לא נוצרה הודעת ברוכים הבאים לבקשה זו. אין לאשר את הבקשה שוב לצורך שליחה.",
  };
  return text[value.status] ?? "יש לרענן את פרטי השליחה.";
}
function canApproveApplication(d: ApplicationDetail<RegistrationType>) {
  const latest = d.versions[0];
  return (
    d.integration === "READY" &&
    d.application.status === "PENDING_REVIEW" &&
    d.application.documentStatus === "READY" &&
    !!latest &&
    d.documents.some(
      (doc) =>
        doc.kind === "REGISTRATION_PDF" &&
        doc.versionId === latest.id &&
        !!doc.verifiedAt &&
        doc.mimeType === "application/pdf" &&
        doc.fileSize > 0 &&
        /^[a-f0-9]{64}$/.test(doc.checksum),
    )
  );
}
function SignedApplication({ detail }: { detail: ApplicationDetail }) {
  const latest = detail.versions[0];
  if (!latest)
    return (
      <Alert severity="info">
        אין גרסה חתומה שהוגשה. טיוטת המבקש אינה מוצגת כאן.
      </Alert>
    );
  const props = {
    data: latest.data,
    change: () => {},
    issues: [],
    disabled: true,
  };
  return (
    <Stack gap={4}>
      <Typography>גרסה {latest.versionNumber} · קריאה בלבד</Typography>
      <IdentityStage {...props} />
      <ContactsStage {...props} />
      <MedicalStage {...props} />
      <Typography variant="h6">הצהרות חתומות</Typography>
      {latest.declarations.map((text, i) => (
        <Typography key={text}>
          {i + 1}. {text}
        </Typography>
      ))}
      <Alert severity="info">
        הורדת הקבצים הפרטיים דורשת הרשאת מנהל הסניף ונבדקת מחדש בכל בקשה.
      </Alert>
    </Stack>
  );
}
