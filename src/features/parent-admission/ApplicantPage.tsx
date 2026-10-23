import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
  client?: ApplicantClient;
}) {
  const [client] = useState(
    () =>
      injected ??
      (admissionUrl() ? createApplicantClient(admissionUrl()!) : null),
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
    return <Alert severity="error">הרישום אינו מחובר לכתובת API מאושרת.</Alert>;
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
  client: ApplicantClient;
  clear: () => void;
}) {
  const [id, setId] = useState(takePendingApplicantId),
    [branch, setBranch] = useState("");
  const [branches, setBranches] = useState<
    { id: string; name: string; city: string }[]
  >([]);
  const [snapshot, setSnapshot] = useState<ApplicationSnapshot | null>(null),
    [loading, setLoading] = useState(true);
  const [code, setCode] = useState(""),
    [newCode, setNewCode] = useState(""),
    [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [epoch, setEpoch] = useState(0);
  const [api] = useState(() => applicantFormApi(client));
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
  const accept = async (result: ApplicantCredentials) => {
    clear();
    setNewCode(result.recoveryCode);
    setCode("");
    setId("");
    setAck(false);
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
  const saveRecovery = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          `EtLaasot applicant recovery credential\nKeep private. Enter only in the registration recovery form.\n${newCode}\n`,
        ],
        { type: "text/plain;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "etlaasot-registration-recovery.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Box dir="rtl" sx={{ maxWidth: 820, mx: "auto", p: { xs: 3, sm: 5 } }}>
      <Stack gap={3}>
        <Typography variant="h5" component="h1" color="primary">
          עת לעשות · בקשת רישום חניך
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
                <Alert severity="warning">
                  קוד השחזור מוצג פעם אחת. שמרו אותו במקום פרטי. הוא מאפשר גישה
                  לטופס ולמידע הרפואי; תעודת זהות אינה תחליף לקוד.
                </Alert>
                <Button onClick={saveRecovery}>שמירת קוד שחזור פרטי</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setAck(true);
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
                ) : (
                  <RegistrationMobile key={epoch} api={api} profile={{}} />
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
                  setCode("");
                })
              }
            >
              סיום וביטול הגישה לבקשה במכשיר זה
            </Button>
            <Typography variant="caption">
              סיום הגישה מבטל גם את קוד השחזור. לחידוש לאחר ביטול נדרש טיפול
              מנהל; לא נפתחת גישה באמצעות תעודת זהות.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6">בקשה חדשה</Typography>
            <TextField
              label="תעודת זהות חניך"
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
              disabled={busy || !id || !branch}
              onClick={() =>
                void run(async () => accept(await client.start(id, branch)))
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
