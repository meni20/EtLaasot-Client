import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationStatusScreen } from "./ApplicationStatusScreen";
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
  const navigate = useNavigate();
  const [correcting, setCorrecting] = useState(false);
  const requestInFlight = useRef(false);
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
    [error, setError] = useState("");
  const [epoch, setEpoch] = useState(0);
  const load = useCallback(async () => {
    if (!client) {
      setLoading(false);
      return;
    }
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setError("");
    try {
      const current = await client.me();
      const list = ["DRAFT", "CHANGES_REQUESTED"].includes(
        current.application.status,
      )
        ? await client.branches()
        : [];
      setSnapshot(current);
      setBranches(list);
      setCorrecting(false);
      setEpoch((v) => v + 1);
    } catch (e) {
      if (e instanceof RegistrationError && e.status === 401) {
        queries.clear();
        setSnapshot(null);
        navigate("/login", { replace: true });
      } else setError("לא ניתן לטעון את הבקשה כרגע. נסו שוב.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }, [client, queries, navigate]);
  useEffect(() => {
    const expire = () => {
      queries.clear();
      setSnapshot(null);
      navigate("/login", { replace: true });
    };
    window.addEventListener("applicant-session-expired", expire);
    void load();
    return () => {
      window.removeEventListener("applicant-session-expired", expire);
      queries.clear();
    };
  }, [load, queries, navigate]);
  useEffect(() => {
    if (snapshot?.application.status !== "PENDING_REVIEW") return;
    const refresh = () => {
      void load();
    };
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [snapshot?.application.status, load]);
  const submitted = () => {
    setCorrecting(false);
    setSnapshot((current) =>
      current
        ? {
            ...current,
            application: { ...current.application, status: "PENDING_REVIEW" },
          }
        : current,
    );
    void load();
  };
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
        notice={error || undefined}
      />
    );
  const application = snapshot.application;
  const state = application.status;
  if (
    state === "PENDING_REVIEW" ||
    state === "APPROVED" ||
    state === "REJECTED" ||
    (state === "CHANGES_REQUESTED" && !correcting)
  )
    return (
      <ApplicationStatusScreen
        status={state}
        reason={application.feedbackReason}
        onCorrect={() => setCorrecting(true)}
      />
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
          {application.registrationType === "VOLUNTEER" ? (
            <VolunteerRegistration
              key={`${application.id}-${epoch}`}
              client={client}
              initial={snapshot as ApplicationSnapshot<"VOLUNTEER">}
              branchOptions={branches}
              onReload={() => void load()}
              onSubmitted={submitted}
            />
          ) : (
            <RegistrationMobile
              key={`${application.id}-${epoch}`}
              api={api}
              profile={{}}
              branchOptions={branches}
              onSubmitted={submitted}
            />
          )}
        </Stack>
      </Box>
    </QueryClientProvider>
  );
}
