import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useAuth } from "../../contexts/useAuth";
import { useBranch } from "../../contexts/useBranch";
import { createAxiosInstance } from "../../config/axiosInstance";
import type { ICurrentUserProfile } from "../../interfaces/user.interface";
import { createRegistrationApi, safeRegistrationError } from "./api";
import { RegistrationMobile } from "./RegistrationMobile";
import { RegistrationAdmin, type AdminTrainee } from "./RegistrationAdmin";
import { registrationApiUrl } from "./environment";
import ApplicantAdminPage from "../parent-admission/ApplicantAdminPage";

function localApiUrl(): string | null {
  return registrationApiUrl(
    import.meta.env.VITE_PARENT_REGISTRATION_API_URL,
    import.meta.env.VITE_SERVER_URL,
    import.meta.env.VITE_PARENT_REGISTRATION_ENVIRONMENT,
  );
}
export default function LiveRegistrationPage() {
  const url = localApiUrl();
  if (!url)
    return (
      <Alert severity="warning">
        הרישום אינו זמין כרגע. נסו שוב מאוחר יותר.
      </Alert>
    );
  return <ConnectedRegistration url={url} />;
}
function ConnectedRegistration({ url }: { url: string }) {
  const { user, sessionId } = useAuth();
  const { availableBranches } = useBranch();
  const http = useMemo(() => createAxiosInstance(url), [url]);
  const api = useMemo(() => createRegistrationApi(http), [http]);
  const superAdmin = user?.roles.some((role) => role.roleId === 10001) ?? false;
  const admin =
    superAdmin || (user?.roles.some((role) => role.roleId === 10000) ?? false);
  const trainee = user?.roles.some((role) => role.roleId === 2) ?? false;
  const branches = availableBranches.filter(
    (branch) =>
      superAdmin ||
      user?.roles.some(
        (role) => role.roleId === 10000 && role.branchId === branch.id,
      ),
  );
  const [branch, setBranch] = useState(branches[0]?.id ?? "");
  const profile = useQuery({
    queryKey: ["registration", "profile", sessionId],
    queryFn: async () => {
      try {
        return (await http.get<ICurrentUserProfile>("/user/me")).data;
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
    enabled: !admin && trainee,
    retry: false,
    gcTime: 0,
  });
  const trainees = useQuery({
    queryKey: ["registration", "trainees", branch, sessionId],
    queryFn: async () => {
      try {
        const response = await http.get<AdminTrainee[]>(
          "/user/get-all-trainees",
          { params: { branchId: branch, status: "active" } },
        );
        return response.data.map((t) => ({ id: t.id, name: t.name }));
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
    enabled: admin && !!branch && branches.some((b) => b.id === branch),
    retry: false,
    gcTime: 0,
  });
  if (!user || (!admin && !trainee))
    return <Alert severity="error">אין הרשאה לרישום.</Alert>;
  if (admin)
    return (
      <RegistrationManagement
        key={sessionId}
        renewals={
          trainees.error ? (
            <Alert
              severity="error"
              action={<Button onClick={() => void trainees.refetch()}>ניסיון נוסף</Button>}
            >
              {trainees.error.message}
            </Alert>
          ) : (
            <RegistrationAdmin
              api={api}
              branches={branches}
              trainees={trainees.data ?? []}
              onBranchChange={setBranch}
            />
          )
        }
      />
    );
  if (profile.error)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void profile.refetch()}>ניסיון נוסף</Button>}
      >
        {profile.error.message}
      </Alert>
    );
  if (!profile.data) return <Alert severity="info">טוען פרטי פרופיל…</Alert>;
  return (
    <RegistrationMobile key={sessionId} api={api} profile={profile.data} />
  );
}

function RegistrationManagement({ renewals }: { renewals: ReactNode }) {
  const [tab, setTab] = useState(0);
  const applicationsEnabled =
    import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED === "true";
  return (
    <Box dir="rtl">
      <Typography component="h1" variant="h4" sx={{ px: { xs: 3, md: 6 }, pt: 3 }}>
        ניהול הרשמות
      </Typography>
      {applicationsEnabled && (
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          aria-label="ניהול הרשמות"
        >
          <Tab
            label="בקשות הרשמה"
            id="applications-tab"
            aria-controls="applications-panel"
          />
          <Tab
            label="תקופות רישום וחידושים"
            id="renewals-tab"
            aria-controls="renewals-panel"
          />
        </Tabs>
      )}
      {applicationsEnabled && tab === 0 ? (
        <Box role="tabpanel" id="applications-panel" aria-labelledby="applications-tab">
          <ApplicantAdminPage />
        </Box>
      ) : (
        <Box
          role={applicationsEnabled ? "tabpanel" : undefined}
          id="renewals-panel"
          aria-labelledby={applicationsEnabled ? "renewals-tab" : undefined}
        >
          {renewals}
        </Box>
      )}
    </Box>
  );
}
