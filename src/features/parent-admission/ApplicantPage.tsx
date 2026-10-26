import { useReloadGuard } from "../../hooks/useReloadGuard";
import { VolunteerRegistration } from "../volunteer-registration/VolunteerRegistration";
import {
  canStartRegistration,
  normalizeRegistrationType,
  type RegistrationType,
} from "./registration-type";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RegistrationMobile } from "../parent-registration/RegistrationMobile";
import { RegistrationError } from "../parent-registration/api";
import {
  admissionUrl,
  applicantFormApi,
  createApplicantClient,
  takePendingApplicantId,
  type ApplicantClient,
  type ApplicantCredentials,
  type ApplicationSnapshot,
} from "./api";

export function ApplicantPage({
  client: injected,
}: {
  client?: ApplicantClient<RegistrationType>;
}) {
  const [client] = useState(
    () =>
      injected ??
      (admissionUrl()
        ? createApplicantClient<RegistrationType>(admissionUrl()!, "TRAINEE")
        : null),
  );
  // Applicant medical data never shares the signed-in user's React Query cache.
  const [queries] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      }),
  );
  useEffect(() => () => queries.clear(), [queries]);
  if (!client)
    return <Alert severity="error">הרישום אינו זמין כרגע. נסו שוב מאוחר יותר.</Alert>;
  return (
    <QueryClientProvider client={queries}>
      <ApplicantWorkspace client={client} clear={() => queries.clear()} />
    </QueryClientProvider>
  );
}
function ApplicantWorkspace({
  client,
  clear,
}: {
  client: ApplicantClient<RegistrationType>;
  clear: () => void;
}) {
  const volunteerPreparationEnabled =
    import.meta.env.VITE_VOLUNTEER_REGISTRATION_ENABLED === "true";
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("TRAINEE");
  const [id, setId] = useState(takePendingApplicantId),
    [branch, setBranch] = useState("");
  const [branches, setBranches] = useState<
    { id: string; name: string; city: string }[]
  >([]);
  const [snapshot, setSnapshot] =
      useState<ApplicationSnapshot<RegistrationType> | null>(null),
    [loading, setLoading] = useState(true);
  const [code, setCode] = useState(""),
    [newCode, setNewCode] = useState(""),
    [ack, setAck] = useState(false),
    [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [epoch, setEpoch] = useState(0);
  useReloadGuard(busy || (!!newCode && !ack), "יש להשלים את הפעולה ולשמור את קוד השחזור לפני העדכון.");
  const api = useMemo(
    () => applicantFormApi(client, snapshot?.application.id),
    [client, snapshot?.application.id],
  );
  useEffect(() => {
    let live = true;
    Promise.all([
      client.branches(),
      client.me().catch((e) => {
        if (e instanceof RegistrationError && e.status === 401) return null;
        throw e;
      }),
    ])
      .then(([list, me]) => {
        if (live) {
          setBranches(list);
          setSnapshot(me);
        }
      })
      .catch(() => {
        if (live) setError("לא ניתן לטעון רישום. נסו שוב מאוחר יותר.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [client]);
  const accept = async (result: ApplicantCredentials<RegistrationType>) => {
    clear();
    setNewCode(result.recoveryCode);
    setCode("");
    setId("");
    setAck(false);
    setCopied(false);
    setSnapshot(await client.me());
    setEpoch((v) => v + 1);
  };
  const run = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(
        e instanceof RegistrationError && e.status === 409
          ? "לא ניתן להתחיל בקשה נוספת. יש להיכנס עם סיסמה או להשתמש בקוד השחזור שנשמר."
          : "הפעולה לא הושלמה. אין לשחזר בקשה באמצעות תעודת זהות בלבד.",
      );
    } finally {
      setBusy(false);
    }
  };
  const refresh = () =>
    run(async () => {
      clear();
      setSnapshot(await client.me());
      setEpoch((v) => v + 1);
    });
  const copyRecovery = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      setCopied(true);
    } catch {
      setError("לא ניתן להעתיק את קוד השחזור. נסו שוב.");
    }
  };
  if (!loading && snapshot?.application.status === "PENDING_REVIEW")
    return (
      <Box
        dir="rtl"
        sx={{ minHeight: "70vh", display: "grid", placeItems: "center", p: 3 }}
      >
        <Stack alignItems="center" gap={2} textAlign="center">
          <CheckCircleOutline color="success" sx={{ fontSize: 72 }} />
          <Typography variant="h6" role="status">
            הטופס נשלח בהצלחה והועבר לטיפול.
          </Typography>
          {normalizeRegistrationType(snapshot.application.registrationType) ===
            "VOLUNTEER" && (
            <>
              {error && (
                <Alert severity="error">
                  לא ניתן לפתוח או להכין את המסמך כרגע. נסו שוב מאוחר יותר.
                </Alert>
              )}
              <Typography role="status">
                {snapshot.application.documentStatus === "READY"
                  ? "המסמך החתום מוכן"
                  : snapshot.application.documentStatus === "FAILED"
                    ? "הפקת ה-PDF נכשלה. ניתן לנסות שוב."
                    : "המסמך בהכנה"}
              </Typography>
              <Button
                disabled={
                  busy ||
                  snapshot.application.documentStatus !== "READY" ||
                  !client.pdf
                }
                onClick={() =>
                  void run(async () => {
                    const blob = await client.pdf!();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "volunteer-registration.pdf";
                    link.click();
                    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
                  })
                }
              >
                הורדת PDF חתום
              </Button>
              {snapshot.application.documentStatus !== "READY" && (
                <Button
                  disabled={busy || !client.retryPdf}
                  onClick={() =>
                    void run(async () => {
                      await client.retryPdf!();
                      setSnapshot(await client.me());
                    })
                  }
                >
                  ניסיון נוסף להפקת PDF
                </Button>
              )}
            </>
          )}
        </Stack>
      </Box>
    );
  return (
    <Box
      dir="rtl"
      sx={{
        position: "relative",
        maxWidth: 820,
        mx: "auto",
        p: { xs: 3, sm: 5 },
        pt:
          volunteerPreparationEnabled && !snapshot
            ? { xs: "88px", sm: "88px" }
            : undefined,
      }}
    >
      <Stack gap={3}>
        <Typography variant="h5" component="h1" color="primary">
          {(snapshot
            ? normalizeRegistrationType(snapshot.application.registrationType)
            : registrationType) === "VOLUNTEER"
            ? "עת לעשות · בקשת רישום מתנדב"
            : "עת לעשות · בקשת רישום חניך"}
        </Typography>
        <Button component={RouterLink} to="/login">
          חזרה לכניסה לחשבון
        </Button>
        {error && (
          <Alert severity="error" role="alert">
            {error}
          </Alert>
        )}
        {loading ? (
          <Typography role="status">טוען…</Typography>
        ) : snapshot ? (
          <>
            <Typography>
              סניף:{" "}
              {branches.find((b) => b.id === snapshot.application.branchId)
                ?.name ?? "הסניף שנבחר"}
            </Typography>
            {newCode && !ack ? (
              <Stack gap={2}>
                <TextField
                  fullWidth
                  label="קוד שחזור"
                  value={newCode}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label="העתקת קוד השחזור"
                          onClick={() => void copyRecovery()}
                        >
                          <ContentCopyOutlined fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    dir: "ltr",
                    style: { fontFamily: "monospace", letterSpacing: "0.04em" },
                  }}
                />
                {copied && (
                  <Alert severity="success" role="status">
                    קוד השחזור הועתק
                  </Alert>
                )}
                <Button
                  variant="contained"
                  onClick={() => {
                    setAck(true);
                    setCopied(false);
                    setNewCode("");
                  }}
                >
                  שמרתי את קוד השחזור במקום בטוח
                </Button>
              </Stack>
            ) : (
              <>
                <Button disabled={busy} onClick={() => void refresh()}>
                  רענון מצב הבקשה
                </Button>
                {snapshot.application.status === "REJECTED" ? (
                  <Alert severity="error">
                    הבקשה נדחתה. {snapshot.application.feedbackReason}
                  </Alert>
                ) : snapshot.application.status === "APPROVED" ? (
                  <Alert severity="success">
                    הבקשה אושרה. מנהל הסניף ימסור את הסיסמה הזמנית בתהליך הקיים.
                  </Alert>
                ) : normalizeRegistrationType(
                    snapshot.application.registrationType,
                  ) !== "TRAINEE" ? (
                  !volunteerPreparationEnabled ? (
                    <Alert severity="info">
                      הרשמה למתנדבים אינה זמינה כרגע.
                    </Alert>
                  ) : (
                    <VolunteerRegistration
                      key={epoch}
                      client={client}
                      initial={snapshot as ApplicationSnapshot<"VOLUNTEER">}
                      onReload={() => void refresh()}
                      onSubmitted={() =>
                        setSnapshot((current) =>
                          current
                            ? {
                                ...current,
                                application: {
                                  ...current.application,
                                  status: "PENDING_REVIEW",
                                },
                              }
                            : current,
                        )
                      }
                    />
                  )
                ) : (
                  <RegistrationMobile
                    key={epoch}
                    api={api}
                    profile={{}}
                    onSubmitted={() =>
                      setSnapshot((current) =>
                        current
                          ? {
                              ...current,
                              application: {
                                ...current.application,
                                status: "PENDING_REVIEW",
                              },
                            }
                          : current,
                      )
                    }
                  />
                )}
              </>
            )}
            <Button
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await client.revoke();
                  clear();
                  setSnapshot(null);
                  setNewCode("");
                  setCopied(false);
                  setCode("");
                })
              }
            >
              סיום וביטול הגישה לבקשה במכשיר זה
            </Button>
          </>
        ) : (
          <>
            {volunteerPreparationEnabled && (
              <Box style={{ position: "absolute", left: 24, top: 16 }}>
                <TextField
                  select
                  size="small"
                  label="סוג הרשמה"
                  value={registrationType}
                  disabled={busy}
                  onChange={(e) => {
                    clear();
                    setRegistrationType(
                      normalizeRegistrationType(e.target.value),
                    );
                  }}
                >
                  <MenuItem value="TRAINEE">הרשמה לחניך</MenuItem>
                  <MenuItem value="VOLUNTEER">הרשמה למתנדב</MenuItem>
                </TextField>
              </Box>
            )}
            <Typography variant="h6">בקשה חדשה</Typography>

            <TextField
              label={
                registrationType === "TRAINEE"
                  ? "תעודת זהות חניך"
                  : "תעודת זהות מתנדב"
              }
              autoComplete="off"
              value={id}
              onChange={(e) =>
                setId(e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              inputProps={{ inputMode: "numeric", maxLength: 9 }}
            />
            <TextField
              select
              label="סניף פעיל"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {branches.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name} · {b.city}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              disabled={
                busy ||
                !id ||
                !branch ||
                !canStartRegistration(
                  registrationType,
                  volunteerPreparationEnabled,
                )
              }
              onClick={() =>
                void run(async () =>
                  accept(await client.start(id, branch, registrationType)),
                )
              }
            >
              יצירת בקשה ללא חשבון
            </Button>
            <Typography variant="h6">המשך בקשה קיימת או תיקונים</Typography>
            <TextField
              label="קוד שחזור פרטי"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
            />
            <Button
              disabled={busy || code.length !== 43}
              onClick={() =>
                void run(async () => accept(await client.recover(code)))
              }
            >
              שחזור גישה מאובטח
            </Button>
            <Typography variant="body2">
              אין שחזור לפי תעודת זהות. אם הקוד אבד, פנו למנהל הסניף לאימות
              ידני; אין מסלול אוטומטי העוקף את האימות.
            </Typography>
          </>
        )}
      </Stack>
    </Box>
  );
}
