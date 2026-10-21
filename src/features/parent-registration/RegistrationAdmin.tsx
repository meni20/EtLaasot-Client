import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
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
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  type FormDetail,
  type FormStatus,
  type RegistrationApi,
  canApprove,
  statuses,
} from "./api";
import {
  useRegistrationAction,
  useRegistrationDetail,
  useRegistrationList,
  useRegistrationYears,
} from "./hooks";

export interface AdminBranch {
  id: string;
  name: string;
}
export interface AdminTrainee {
  id: string;
  name: string;
}
const statusKeys = Object.keys(statuses) as FormStatus[];
export function RegistrationAdmin({
  api,
  branches,
  trainees,
  onBranchChange,
}: {
  api: RegistrationApi;
  branches: AdminBranch[];
  trainees: AdminTrainee[];
  onBranchChange?: (branchId: string) => void;
}) {
  const years = useRegistrationYears(api);
  const [branch, setBranch] = useState(branches[0]?.id ?? "");
  const [selectedYear, setYear] = useState("");
  const year =
    selectedYear ||
    years.data?.find((y) => y.isActive)?.id ||
    years.data?.[0]?.id ||
    "";
  const [status, setStatus] = useState<FormStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("");
  const detail = useRegistrationDetail(api, selected);
  const params = {
    branchId: branch,
    activityYearId: year,
    status: status || undefined,
    page,
    pageSize: 25,
  };
  const list = useRegistrationList(api, params);
  const counts = useQueries({
    queries: statusKeys.map((key) => ({
      queryKey: ["registration", "count", branch, year, key],
      queryFn: () => api.list({ ...params, status: key, page: 1, pageSize: 1 }),
      enabled: !!branch && !!year,
      retry: false,
      gcTime: 0,
    })),
  });
  const [dialog, setDialog] = useState<
    "annual" | "renew" | "changes" | "approve" | null
  >(null);
  const [reason, setReason] = useState("");
  const [trainee, setTrainee] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [validation, setValidation] = useState("");
  const [success, setSuccess] = useState("");
  const action = useRegistrationAction(async (_: void) => {
    if (!branches.some((b) => b.id === branch) || !year)
      throw new Error("יש לבחור סניף ושנת פעילות מורשים");
    if (dialog === "annual") return api.openPeriod(branch, year);
    if (dialog === "renew")
      return api.renew(trainee, {
        reason: reason.trim(),
        blocksAccess: blocking,
        branchId: branch,
        activityYearId: year,
      });
    if (dialog === "changes")
      return api.requestChanges(selected, reason.trim());
    if (dialog === "approve" && detail.data && canApprove(detail.data)) {
      const latest = [...detail.data.versions].sort(
        (a, b) => b.versionNumber - a.versionNumber,
      )[0];
      return api.approve(selected, latest.id);
    }
    throw new Error("הפעולה אינה זמינה במצב הטופס הנוכחי");
  });
  const open = (value: typeof dialog) => {
    action.reset();
    setReason("");
    setValidation("");
    setSuccess("");
    setDialog(value);
  };
  const confirm = async () => {
    if ((dialog === "renew" || dialog === "changes") && !reason.trim()) {
      setValidation("חובה להזין סיבה");
      return;
    }
    if (dialog === "renew" && !trainees.some((t) => t.id === trainee)) {
      setValidation("יש לבחור חניך/ה מהסניף הנוכחי");
      return;
    }
    try {
      await action.mutateAsync();
      setSuccess(
        api.mode === "demo"
          ? "הפעולה הודגמה בזיכרון המקומי בלבד."
          : "הפעולה הושלמה",
      );
      setDialog(null);
    } catch {
      /* Sanitized API error is rendered below. */
    }
  };
  const changeScope = (nextBranch: string, nextYear: string) => {
    setBranch(nextBranch);
    setYear(nextYear);
    setSelected("");
    setPage(1);
    setDialog(null);
    setSuccess("");
    setSearch("");
    onBranchChange?.(nextBranch);
  };
  const rows =
    list.data?.rows.filter((row) =>
      `${trainees.find((t) => t.id === row.traineeUuid)?.name ?? ""} ${row.traineeUuid}`.includes(
        search.trim(),
      ),
    ) ?? [];
  return (
    <Box
      dir="rtl"
      sx={{ maxWidth: 1250, mx: "auto", p: { xs: 3, md: 6 }, color: "#303050" }}
    >
      <Stack gap={5}>
        <Typography variant="overline" color="primary" fontWeight={700}>
          עת לעשות · ניהול סניף
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={3}
        >
          <Box>
            <Typography component="h1" variant="h4" fontWeight={700}>
              רישום הורים
            </Typography>
            <Typography color="text.secondary">
              מעקב, בדיקה ואישור הטפסים של הסניף
            </Typography>
          </Box>
          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              disabled={!branch || !year}
              onClick={() => open("renew")}
            >
              בקשת חידוש אישי
            </Button>
            <Button
              variant="contained"
              disabled={!branch || !year}
              onClick={() => open("annual")}
            >
              פתיחת רישום שנתי
            </Button>
          </Stack>
        </Stack>
        <Alert severity="info">
          חסימת גישה לאפליקציה אינה מופעלת. העלאת קבצים, הפקת PDF וצפייה במסמכים
          טרם חוברו.
        </Alert>
        {success && <Alert severity="success">{success}</Alert>}
        <Paper
          variant="outlined"
          sx={{ p: 4, borderColor: "#D9BFD2", borderRadius: 4 }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
            <TextField
              select
              label="סניף מורשה"
              value={branch}
              onChange={(e) => changeScope(e.target.value, year)}
              fullWidth
            >
              {branches.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="שנת פעילות"
              value={year}
              onChange={(e) => changeScope(branch, e.target.value)}
              fullWidth
            >
              {years.data?.map((y) => (
                <MenuItem key={y.id} value={y.id}>
                  {y.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>
        {years.error && (
          <Alert
            severity="error"
            action={
              <Button onClick={() => void years.refetch()}>ניסיון נוסף</Button>
            }
          >
            {years.error.message}
          </Alert>
        )}
        {!branches.length && (
          <Alert severity="warning">
            לא נמצאו סניפים מורשים. אין גישה לטפסים.
          </Alert>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
            gap: 4,
          }}
        >
          {statusKeys.map((key, index) => (
            <Paper
              variant="outlined"
              key={key}
              sx={{
                p: 4,
                borderColor: status === key ? "#7A3E6B" : "#D9BFD2",
                borderRadius: 4,
                bgcolor: status === key ? "#F7F1F5" : "white",
              }}
            >
              <Typography color="text.secondary">{statuses[key]}</Typography>
              <Typography variant="h4">
                {counts[index].isError
                  ? "—"
                  : (counts[index].data?.count ?? "…")}
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setStatus(status === key ? "" : key);
                  setPage(1);
                }}
              >
                הצגת טפסים
              </Button>
            </Paper>
          ))}
        </Box>
        {counts.some((q) => q.isError) && (
          <Alert severity="warning">חלק מספירות הסטטוסים לא נטענו.</Alert>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
          <TextField
            label="חיפוש בשם או מזהה בעמוד הנוכחי"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            helperText="השרת אינו מספק חיפוש בכל העמודים. סינון זה חל על עד 25 הטפסים המוצגים."
          />
          <TextField
            select
            label="סינון סטטוס"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as FormStatus | "");
              setPage(1);
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">כל הסטטוסים</MenuItem>
            {statusKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {statuses[key]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {list.error && (
          <Alert
            severity="error"
            action={
              <Button onClick={() => void list.refetch()}>ניסיון נוסף</Button>
            }
          >
            {list.error.message}
          </Alert>
        )}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 4, borderColor: "#D9BFD2" }}
        >
          <Table aria-label="טפסי רישום הורים">
            <TableHead>
              <TableRow>
                {["חניך/ה", "סוג בקשה", "סטטוס", "מסמך PDF", ""].map(
                  (label, index) => (
                    <TableCell key={index} align="right">
                      {label}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="right">
                    {trainees.find((t) => t.id === row.traineeUuid)?.name ??
                      row.traineeUuid}
                  </TableCell>
                  <TableCell align="right">
                    {row.requestType === "YEARLY" ? "שנתי" : "אישי"}
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" label={statuses[row.status]} />
                  </TableCell>
                  <TableCell align="right">
                    {row.documentStatus === "READY"
                      ? "מוכן (צפייה לא זמינה)"
                      : row.documentStatus === "FAILED"
                        ? "נכשל"
                        : "ממתין להפקה"}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => setSelected(row.id)}>
                      פתיחת טופס
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {list.isFetching
                      ? "טוען טפסים…"
                      : "לא נמצאו טפסים בתצוגה זו"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
              setSelected("");
            }}
          >
            עמוד קודם
          </Button>
          <Typography>
            עמוד {page} · {list.data?.count ?? "…"} טפסים
          </Typography>
          <Button
            disabled={!list.data || page * 25 >= list.data.count}
            onClick={() => {
              setPage(page + 1);
              setSelected("");
            }}
          >
            עמוד הבא
          </Button>
        </Stack>
        {selected && (
          <Paper
            component="section"
            aria-label="פרטי טופס חתום"
            variant="outlined"
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              borderColor: "#D9BFD2",
            }}
          >
            <Stack gap={4}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5" component="h2">
                  בדיקת טופס
                </Typography>
                <Button onClick={() => setSelected("")}>סגירת פרטים</Button>
              </Stack>
              {detail.error && (
                <Alert severity="error">
                  {detail.error.message}
                  <Button onClick={() => void detail.refetch()}>
                    ניסיון נוסף
                  </Button>
                </Alert>
              )}
              {detail.isFetching && (
                <Typography role="status">טוען פרטים…</Typography>
              )}
              {detail.data && (
                <>
                  <DetailView detail={detail.data} />
                  <Stack direction="row" gap={3}>
                    <Button
                      variant="outlined"
                      disabled={detail.data.form.status !== "PENDING_REVIEW"}
                      onClick={() => open("changes")}
                    >
                      בקשת תיקונים
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!canApprove(detail.data)}
                      onClick={() => open("approve")}
                    >
                      אישור הטופס
                    </Button>
                  </Stack>
                  {!canApprove(detail.data) &&
                    detail.data.form.status === "PENDING_REVIEW" && (
                      <Typography color="text.secondary">
                        אישור יתאפשר רק כאשר השרת יספק PDF מאומת של גרסת ההגשה
                        העדכנית וסטטוס READY.
                      </Typography>
                    )}
                </>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
      <Dialog
        open={!!dialog}
        onClose={() => {
          if (!action.isPending) setDialog(null);
        }}
        fullWidth
        maxWidth="sm"
        dir="rtl"
      >
        <DialogTitle>
          {dialog === "annual"
            ? "פתיחת רישום שנתי"
            : dialog === "renew"
              ? "בקשת חידוש אישי"
              : dialog === "changes"
                ? "החזרת הטופס לתיקון"
                : "אישור טופס חתום"}
        </DialogTitle>
        <DialogContent>
          <Stack gap={4} sx={{ pt: 3 }}>
            <Typography>
              {branches.find((b) => b.id === branch)?.name} ·{" "}
              {years.data?.find((y) => y.id === year)?.name}
            </Typography>
            {dialog === "annual" && (
              <Alert severity="info">
                ייפתח רישום שנתי לכל החניכים בסניף, כולל מצטרפים חדשים. אכיפת
                חסימת גישה עדיין כבויה.
              </Alert>
            )}
            {dialog === "renew" && (
              <>
                <TextField
                  select
                  label="חניך/ה מהסניף"
                  value={trainee}
                  onChange={(e) => setTrainee(e.target.value)}
                >
                  {trainees.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={blocking}
                      onChange={(_, v) => setBlocking(v)}
                    />
                  }
                  label="בקשה חוסמת (האכיפה עדיין כבויה)"
                />
              </>
            )}
            {(dialog === "renew" || dialog === "changes") && (
              <TextField
                label="סיבה"
                required
                multiline
                minRows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
              />
            )}
            {dialog === "approve" && (
              <Typography>
                האישור יחול על גרסת ההגשה שנבדקה בלבד. נתוני רפואה דורשים התאמה
                ידנית.
              </Typography>
            )}
            {validation && <Alert severity="error">{validation}</Alert>}
            {action.error && (
              <Alert severity="error">{action.error.message}</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={action.isPending} onClick={() => setDialog(null)}>
            ביטול
          </Button>
          <Button
            variant="contained"
            disabled={action.isPending}
            onClick={() => void confirm()}
          >
            {action.isPending ? "מבצע…" : "אישור פעולה"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
const fieldLabels: Record<string, string> = {
  trainee: "חניך/ה",
  parent1: "הורה 1",
  parent2: "הורה 2",
  contacts: "אנשי קשר",
  medical: "רפואה",
  development: "התפתחות",
  name: "שם",
  familyName: "שם משפחה",
  nationalId: "תעודת זהות",
  phone: "טלפון",
  phoneNumber: "טלפון",
  parentName: "שם ההורה",
  occupation: "עיסוק",
  nickname: "כינוי",
  siblings: "מספר אחים",
  customShirtSize: "פירוט מידת חולצה",
  schoolPhone: "טלפון מסגרת חינוכית",
  schoolCounselor: "יועץ/ת המסגרת",
  schoolCounselorPhone: "טלפון יועץ/ת",
  restrictionDetails: "פירוט מגבלות השתתפות",
  toiletingDetails: "פירוט קשיים בשירותים",
  dosage: "מינון",
  frequency: "תדירות",
  instructions: "הנחיות",
  physicianSummaryDocumentId: "מזהה סיכום רפואי",
  dateOfBirth: "תאריך לידה",
  email: "דואר אלקטרוני",
  address: "כתובת",
  gender: "מין",
  school: "מסגרת חינוכית",
  healthFund: "קופת חולים",
  shirtSize: "מידת חולצה",
  pantsSize: "מידת מכנסיים",
  familyStatus: "מצב משפחתי",
  emergencyName: "איש קשר לחירום",
  emergencyPhone: "טלפון חירום",
  emergencyRelationship: "קרבה",
  conditions: "מצבים רפואיים",
  medications: "תרופות",
  allergies: "אלרגיות",
  physicianName: "שם רופא",
  physicianPhone: "טלפון רופא",
  physicianHealthFund: "קופת רופא",
  details: "פירוט",
  level: "רמה",
  signatures: "חתימות",
  declarationVersion: "גרסת הצהרות",
  declarationAcceptances: "אישורי הצהרות",
  hasConditions: "מגבלות בריאות",
  participationRestricted: "הגבלת השתתפות",
  takesMedication: "נטילת תרופות",
  hasFoodAllergies: "אלרגיה למזון",
  eatsIndependently: "אכילה עצמאית",
  hasToiletingDifficulties: "קשיים בשירותים",
  usesDiapers: "שימוש בטיטולים",
};
function label(path: string) {
  return path
    .split(".")
    .map((key) => fieldLabels[key] ?? key)
    .join(" · ");
}
function display(value: unknown, path = ""): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "כן" : "לא";
  if (path.includes("nationalId")) return `•••••${String(value).slice(-4)}`;
  if (path === "declarationAcceptances" && Array.isArray(value))
    return `${value.filter(Boolean).length} מתוך ${value.length} הצהרות אושרו`;
  if (value === "male") return "זכר";
  if (value === "female") return "נקבה";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
function flatten(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value) && prefix !== "declarationAcceptances")
    return value.flatMap((child, index) =>
      flatten(child, `${prefix}.${index + 1}`),
    );
  if (value && typeof value === "object" && !Array.isArray(value))
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    );
  return [[prefix, value]];
}
function DetailView({ detail }: { detail: FormDetail }) {
  const [versionId, setVersionId] = useState("");
  const versions = [...detail.versions].sort(
    (a, b) => b.versionNumber - a.versionNumber,
  );
  const version = versions.find((v) => v.id === versionId) ?? versions[0];
  return (
    <Stack gap={4}>
      <Alert severity="info">
        הנתונים החתומים מוצגים לקריאה בלבד. אין עריכת פרטים על ידי המנהל/ת.
      </Alert>
      {(detail.feedbackReason || detail.requestReason) && (
        <Typography>
          סיבת בקשה / תיקון: {detail.feedbackReason || detail.requestReason}
        </Typography>
      )}
      <Alert severity="warning">
        נתוני רפואה דורשים התאמה ידנית. אישור הטופס אינו מחליף את רשימת התרופות
        או האלרגיות המאושרת.
      </Alert>
      <Typography>
        אלרגיות בפרופיל הקיים: {detail.existingAllergies || "לא צוינו"}
      </Typography>
      <Typography>
        תרופות בפרופיל הקיים:{" "}
        {detail.existingMedications
          .map((m) => `${m.medicationName} ${m.dosage}`)
          .join(", ") || "לא צוינו"}
      </Typography>
      <Typography variant="h6" component="h3">
        השוואה לפרופיל הקיים (גרסה אחרונה)
      </Typography>
      <TableContainer>
        <Table size="small" aria-label="השוואת פרטי רישום">
          <TableHead>
            <TableRow>
              <TableCell>שדה</TableCell>
              <TableCell>בפרופיל</TableCell>
              <TableCell>בטופס שהוגש</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detail.differences.map((diff) => (
              <TableRow key={diff.field}>
                <TableCell>{label(diff.field)}</TableCell>
                <TableCell>{display(diff.currentValue, diff.field)}</TableCell>
                <TableCell>{display(diff.proposedValue, diff.field)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" component="h3">
        היסטוריית הגשות
      </Typography>
      {version ? (
        <>
          <TextField
            select
            label="גרסת הגשה"
            value={version.id}
            onChange={(e) => setVersionId(e.target.value)}
          >
            {versions.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                גרסה {v.versionNumber} ·{" "}
                {new Date(v.submittedAt).toLocaleString("he-IL")}
              </MenuItem>
            ))}
          </TextField>
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "minmax(160px,1fr) 2fr" },
              gap: 2,
              overflowWrap: "anywhere",
            }}
          >
            {flatten(version.data)
              .filter(([path]) => !path.startsWith("signatures."))
              .map(([path, value]) => (
                <Box key={path} sx={{ display: "contents" }}>
                  <Typography component="dt" fontWeight={600}>
                    {label(path)}
                  </Typography>
                  <Typography component="dd" sx={{ m: 0 }}>
                    {display(value, path)}
                  </Typography>
                </Box>
              ))}
          </Box>
          <Typography variant="h6" component="h3">
            הצהרות בגרסה החתומה
          </Typography>
          <Box component="ol" sx={{ paddingInlineStart: 6 }}>
            {version.declarations.map((text) => (
              <li key={text}>
                <Typography sx={{ mb: 3, lineHeight: 1.85 }}>{text}</Typography>
              </li>
            ))}
          </Box>
        </>
      ) : (
        <Typography>הטיוטה טרם הוגשה. אין עדיין גרסה חתומה לצפייה.</Typography>
      )}
      <Typography>
        מסמכים:{" "}
        {detail.documents.length
          ? `${detail.documents.length} מסמכים רשומים; הצפייה אינה זמינה`
          : "אין מסמכים זמינים"}
        . PDF:{" "}
        {detail.form.documentStatus === "READY"
          ? "מוכן"
          : detail.form.documentStatus === "FAILED"
            ? "נכשל"
            : "ממתין להפקה"}
        .
      </Typography>
    </Stack>
  );
}
