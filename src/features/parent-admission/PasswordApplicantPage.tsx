import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RegistrationMobile } from "../parent-registration/RegistrationMobile";
import { RegistrationError } from "../parent-registration/api";
import { VolunteerRegistration } from "../volunteer-registration/VolunteerRegistration";
import {
  applicantFormApi,
  type ApplicantClient,
  type ApplicationSnapshot,
} from "./api";
import type { RegistrationType } from "./registration-type";
import { passwordApplicantClient } from "./password-flow";
import { UnifiedEntry } from "./UnifiedEntry";

export function PasswordApplicantPage({
  client: supplied,
}: {
  client?: ApplicantClient<RegistrationType>;
}) {
  const [client] = useState(() => supplied ?? passwordApplicantClient());
  const [queries] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0, refetchOnWindowFocus: false },
        },
      }),
  );
  const [snapshot, setSnapshot] =
    useState<ApplicationSnapshot<RegistrationType> | null>(null);
  const [branches, setBranches] = useState<
    { id: string; name: string; city: string }[]
  >([]);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [expired, setExpired] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const authenticated = useRef(false);
  const load = useCallback(async () => {
    if (!client) {
      setLoading(false);
      return;
    }
    setError("");
    try {
      const current = await client.me();
      const list = await client.branches();
      setSnapshot(current);
      authenticated.current = true;
      setBranches(list);
      setExpired(false);
      setEpoch((v) => v + 1);
    } catch (e) {
      if (e instanceof RegistrationError && e.status === 401) {
        queries.clear();
        setSnapshot(null);
      } else setError("לא ניתן לטעון את הבקשה כרגע. נסו שוב.");
    } finally {
      setLoading(false);
    }
  }, [client, queries]);
  useEffect(() => {
    const expire = () => {
      queries.clear();
      setSnapshot(null);
      if (authenticated.current) setExpired(true);
    };
    window.addEventListener("applicant-session-expired", expire);
    void load();
    return () => {
      window.removeEventListener("applicant-session-expired", expire);
      queries.clear();
    };
  }, [load, queries]);
  const api = useMemo(
    () => (client ? applicantFormApi(client, snapshot?.application.id) : null),
    [client, snapshot?.application.id],
  );
  if (!client || !api)
    return <Alert severity="error">הרישום אינו זמין כרגע.</Alert>;
  if (loading)
    return (
      <Box p={4} dir="rtl">
        <CircularProgress aria-label="טוען הרשמה" />
      </Box>
    );
  if (!snapshot)
    return (
      <UnifiedEntry
        client={client}
        onApplicantAuthenticated={load}
        notice={
          expired
            ? "הגישה פגה. יש להיכנס שוב כדי להמשיך בבקשה."
            : error || undefined
        }
      />
    );
  const application = snapshot.application;
  const statusOnly = ["PENDING_REVIEW", "REJECTED", "APPROVED"].includes(
    application.status,
  );
  return (
    <QueryClientProvider client={queries}>
      <Box dir="rtl" sx={{ minHeight: "100dvh", p: { xs: 2, md: 4 } }}>
        <Stack gap={2} sx={{ maxWidth: 1100, mx: "auto" }}>
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="h1" variant="h5">
              {application.registrationType === "VOLUNTEER"
                ? "הרשמת מתנדב"
                : "הרשמת חניך"}
            </Typography>
            <Button
              onClick={() =>
                void client
                  .revoke()
                  .then(() => {
                    queries.clear();
                    setSnapshot(null);
                  })
                  .catch(() => setError("לא ניתן לצאת כרגע. נסו שוב."))
              }
            >
              יציאה מהבקשה
            </Button>
          </Stack>
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}
          {application.status === "CHANGES_REQUESTED" && (
            <Alert severity="warning">
              הבקשה הוחזרה לתיקון: {application.feedbackReason}
            </Alert>
          )}
          {statusOnly ? (
            <Stack gap={2} sx={{ py: 4 }}>
              <Alert
                severity={
                  application.status === "REJECTED" ? "error" : "success"
                }
                role="status"
              >
                {application.status === "PENDING_REVIEW"
                  ? "הבקשה נשלחה וממתינה לאישור מנהל. אין אפשרות לערוך כעת."
                  : application.status === "REJECTED"
                    ? `הבקשה נדחתה. ${application.feedbackReason ?? ""}`
                    : "הבקשה אושרה. יש להיכנס באמצעות פרטי החשבון."}
              </Alert>
              {application.status === "APPROVED" ? (
                <Button component={RouterLink} to="/login" variant="contained">
                  לכניסה למערכת
                </Button>
              ) : (
                <Button onClick={() => void load()}>רענון מצב הבקשה</Button>
              )}
            </Stack>
          ) : application.registrationType === "VOLUNTEER" ? (
            <VolunteerRegistration
              key={`${application.id}-${epoch}`}
              client={client}
              initial={snapshot as ApplicationSnapshot<"VOLUNTEER">}
              branchOptions={branches}
              onReload={() => void load()}
              onSubmitted={() => void load()}
            />
          ) : (
            <RegistrationMobile
              key={`${application.id}-${epoch}`}
              api={api}
              profile={{}}
              branchOptions={branches}
              onSubmitted={() => void load()}
            />
          )}
        </Stack>
      </Box>
    </QueryClientProvider>
  );
}
