/* eslint-disable react-refresh/only-export-components -- This isolated QA entry mounts its own harness. */
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Alert, CssBaseline, ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../../../theme/them";
import { AuthContext, type IAuthContext } from "../../../contexts/useAuth";
import { BranchContext } from "../../../contexts/useBranch";
import { TwoStepLogin } from "../TwoStepLogin";
import { ApplicantPage } from "../ApplicantPage";
import ApplicantAdminPage from "../ApplicantAdminPage";
import { RegistrationBoundary } from "../RegistrationBoundary";
import { PasswordChangePage } from "../../../pages/Mobile/PasswordChangePage/PasswordChange";
import { PwaInstallContext } from "../../../contexts/PwaInstallContext";
import "../../parent-registration/demo/preview.css";

if (!import.meta.env.DEV) throw Error("Phase 4 QA is local only");
const marker = "phase4-fictional-branch";
function Harness() {
  const screen = new URLSearchParams(location.search).get("screen") ?? "login";
  const [passwordRequired, setPasswordRequired] = useState(false);
  const admin = screen === "admin",
    roleId = admin ? 10000 : 2;
  const user = {
    userId: "fictional-user",
    name: "Fictional QA",
    roles: [
      {
        role: "fictional",
        roleId,
        branchId: marker,
        branchName: "סניף בדיקה מקומי",
      },
    ],
    activeBranch: marker,
  };
  const auth: IAuthContext = {
    user,
    token: null,
    sessionId: 1,
    isAuthenticated: false,
    mustChangePassword: passwordRequired,
    loading: false,
    isSuperAdmin: false,
    login: async () => setPasswordRequired(true),
    changePassword: async () => setPasswordRequired(false),
    logout: () => {},
  };
  const [query] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );
  return (
    <CacheProvider
      value={createCache({
        key: "phasefour-rtl",
        stylisPlugins: [prefixer, rtlPlugin],
      })}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={query}>
          <PwaInstallContext.Provider
            value={{
              canInstall: false,
              installed: false,
              iosDevice: false,
              mobileDevice: false,
              requestInstall: async () => "unavailable",
            }}
          >
            <AuthContext.Provider value={auth}>
              <BranchContext.Provider
                value={{
                  activeBranch: marker,
                  availableBranches: [{ id: marker, name: "סניף בדיקה מקומי" }],
                  switchBranch: () => {},
                  isSuperAdmin: false,
                }}
              >
                <MemoryRouter
                  initialEntries={[
                    screen === "apply"
                      ? "/apply"
                      : screen === "restricted"
                        ? "/old-bookmark"
                        : "/login",
                  ]}
                >
                  <Alert severity="warning">
                    Phase 4 QA · נתונים בדויים בלבד · ללא מערכת חיה
                  </Alert>
                  {screen === "admin" ? (
                    <ApplicantAdminPage />
                  ) : screen === "restricted" ? (
                    <RegistrationBoundary>
                      <Alert>גישה רגילה לדוגמה</Alert>
                    </RegistrationBoundary>
                  ) : passwordRequired ? (
                    <PasswordChangePage />
                  ) : (
                    <Routes>
                      <Route path="/login" element={<TwoStepLogin />} />
                      <Route path="/apply" element={<ApplicantPage />} />
                    </Routes>
                  )}
                </MemoryRouter>
              </BranchContext.Provider>
            </AuthContext.Provider>
          </PwaInstallContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
createRoot(document.getElementById("root")!).render(<Harness />);
