import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Button, Stack } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { createServerAxiosInstance } from "../../config/axiosInstance";
import { PwaUpdatePrompt } from "../../components/PwaUpdatePrompt/PwaUpdatePrompt";
import { accessView, onlyTraineeRoles } from "./navigation";
const LiveRegistrationPage = lazy(
  () => import("../parent-registration/LiveRegistrationPage"),
);

export function RegistrationBoundary({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return onlyTraineeRoles(user?.roles ?? []) ? (
    <TraineeBoundary>{children}</TraineeBoundary>
  ) : (
    children
  );
}
function TraineeBoundary({ children }: { children: ReactNode }) {
  const { user, logout, sessionId } = useAuth();
  const [epoch, setEpoch] = useState(0);
  const [wasRestricted, setWasRestricted] = useState(false);
  const [http] = useState(() =>
    createServerAxiosInstance("/parent-registration"),
  );
  const enabled =
    import.meta.env.VITE_PARENT_REGISTRATION_BLOCKING_ENABLED === "true";
  useEffect(() => {
    const required = () => setEpoch((v) => v + 1);
    window.addEventListener("registration:required", required);
    return () => window.removeEventListener("registration:required", required);
  }, []);
  const status = useQuery({
    queryKey: ["registration", "access", user?.userId, sessionId, epoch],
    queryFn: async () =>
      (await http.get<{ accessBlocked: boolean }>("/me/status")).data,
    enabled: enabled || epoch > 0,
    retry: false,
    refetchInterval: 15000,
    gcTime: 0,
  });
  useEffect(() => {
    if (status.isSuccess) setWasRestricted(status.data.accessBlocked);
  }, [status.isSuccess, status.data?.accessBlocked]);
  const checkedView = accessView(
    enabled,
    epoch > 0,
    status.isPending,
    status.isError,
    status.data?.accessBlocked ?? false,
  );
  // Rechecking a known restriction must not unmount an in-progress form. Keep
  // the restricted surface while verification is pending/failed; never grant
  // normal application access from a stale result.
  const view =
    checkedView === "VERIFY" && wasRestricted ? "REGISTRATION" : checkedView;
  if (view === "NORMAL") return children;
  return (
    <Box
      dir="rtl"
      sx={{ minHeight: "100dvh", p: 3, bgcolor: "background.default" }}
    >
      <Stack gap={2}>
        <Alert severity="info">
          {view === "VERIFY"
            ? "יש לאמת את מצב הרישום לפני המשך שימוש באפליקציה."
            : "נדרש אישור רישום. עד לאישור ניתן להשלים את הטופס ולהתנתק."}
        </Alert>
        <Button onClick={() => void status.refetch()}>בדיקת אישור מחדש</Button>
        <Button onClick={() => void logout()}>התנתקות</Button>
        {view === "REGISTRATION" && (
          <Suspense fallback={<Alert severity="info">טוען טופס…</Alert>}>
            <Routes>
              <Route
                path="/parent-registration"
                element={<LiveRegistrationPage />}
              />
              <Route
                path="*"
                element={<Navigate to="/parent-registration" replace />}
              />
            </Routes>
          </Suspense>
        )}
        <PwaUpdatePrompt />
      </Stack>
    </Box>
  );
}
