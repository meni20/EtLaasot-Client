import { useReloadGuard } from "../../hooks/useReloadGuard";
import { useState } from "react";
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
import { createApplicationAdminApi, type ApplicationDetail } from "./api";
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
  } | null>(null);
  const [passwordExpires, setPasswordExpires] = useState("");
  const [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useReloadGuard(busy || !!password || !!confirmation || (!!selected && !!reason));
  const cache = useQueryClient();
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
  return (
    <Box dir="rtl" p={5}>
      <Stack gap={3}>
        <Typography component="h1" variant="h5" color="primary">
          בקשות הרשמה
        </Typography>
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
                setSelected(app.id);
                setReason("");
                setVerified(false);
                setPassword("");
                setShowPassword(false);
                setConfirmation(null);
                setError("");
              }}
            >
              {app.applicantName || "ללא שם"} · {labels[app.status]}
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
                בהערות או לשלוח בדואר אוטומטי.
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
                ? "הפעולה תיצור חשבון עבור הגרסה שנבדקה. יש למסור את הסיסמה הזמנית ידנית."
                : `הבקשה תידחה. סיבה: ${confirmation?.reason ?? ""}`}
            </Typography>
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
                    );
                    setPassword(result.temporaryPassword ?? "");
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
