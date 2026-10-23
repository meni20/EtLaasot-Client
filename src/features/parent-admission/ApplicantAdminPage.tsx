import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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

const labels = {
  DRAFT: "טיוטה",
  PENDING_REVIEW: "ממתין לבדיקה",
  CHANGES_REQUESTED: "נדרשים תיקונים",
  REJECTED: "נדחה",
  APPROVED: "אושר",
};
export default function ApplicantAdminPage() {
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
    [verified, setVerified] = useState(false);
  const [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const cache = useQueryClient();
  const list = useQuery({
    queryKey: ["applications", "list", sessionId, branch, page],
    queryFn: () => api.list(branch, page),
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
  const run = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
      await cache.invalidateQueries({ queryKey: ["applications"] });
    } catch {
      setError("הפעולה לא הושלמה. יש לבדוק הרשאה, גרסה עדכנית וזמינות מסמכים.");
    } finally {
      setBusy(false);
    }
  };
  const doc = detail.data,
    latest = doc?.versions[0];
  return (
    <Box dir="rtl" p={5}>
      <Stack gap={3}>
        <Typography component="h1" variant="h5" color="primary">
          בקשות חניכים חדשים
        </Typography>
        <Alert severity="warning">
          אלה בקשות ללא חשבון מאומת. אישור דורש אימות ידני, סיכום רפואי ו-PDF
          חתום מאומת של הגרסה שנבדקה. הקבצים נשמרים באחסון פרטי.
        </Alert>
        <TextField
          select
          label="סניף"
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setSelected("");
            setReason("");
            setVerified(false);
            setPassword("");
            setPage(1);
          }}
        >
          {branches.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField>
        {(error || list.isError || detail.isError) && (
          <Alert severity="error">
            {error || "לא ניתן לטעון בקשות מורשות"}
          </Alert>
        )}
        {list.data?.rows.map((app) => (
          <Stack key={app.id} direction="row" gap={1} alignItems="center">
            <Button
              fullWidth
              variant={selected === app.id ? "contained" : "outlined"}
              onClick={() => {
                setSelected(app.id);
                setReason("");
                setVerified(false);
                setPassword("");
              }}
            >
              {app.applicantName || "ללא שם"} · {labels[app.status]}
            </Button>
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
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => p - 1);
              setSelected("");
              setPassword("");
            }}
          >
            הקודם
          </Button>
          <Typography>עמוד {page}</Typography>
          <Button
            disabled={!list.data || page * 25 >= list.data.count}
            onClick={() => {
              setPage((p) => p + 1);
              setSelected("");
              setPassword("");
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
            <SignedApplication detail={doc} />
            {doc.documents
              .filter((d) => !d.versionId || d.versionId === latest?.id)
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
                      : "חתימה"}{" "}
                  פרטי
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
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 2000))}
            />
            <Stack direction="row" gap={2} flexWrap="wrap">
              <Button
                disabled={
                  busy ||
                  doc.application.status !== "PENDING_REVIEW" ||
                  !reason.trim()
                }
                onClick={() =>
                  void run(async () => {
                    await api.review(selected, "request-changes", reason);
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
                  !reason.trim()
                }
                onClick={() =>
                  void run(async () => {
                    await api.review(selected, "reject", reason);
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
                  onChange={(_, v) => setVerified(v)}
                />
              }
              label="אימתתי ידנית את זהות החניך וההורה ואת שיוכם לסניף"
            />
            <Button
              variant="contained"
              disabled={
                busy || !verified || !latest || !canApproveApplication(doc)
              }
              onClick={() =>
                void run(async () => {
                  const result = await api.approve(selected, latest!.id);
                  setPassword(result.temporaryPassword);
                  setShowPassword(false);
                })
              }
            >
              אישור ויצירת חשבון חניך
            </Button>
            {!canApproveApplication(doc) && (
              <Alert severity="info">
                אישור אינו זמין ללא חיבור מסמכים וראיות מאומתות של הגרסה
                הנוכחית. לא נוצר חשבון.
              </Alert>
            )}
          </>
        )}
        {password && (
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
        )}
      </Stack>
    </Box>
  );
}
function canApproveApplication(d: ApplicationDetail) {
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
