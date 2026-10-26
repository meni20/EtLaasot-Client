/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline, Button, TextField } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { AuthContext, type IAuthContext } from "../../src/contexts/useAuth";
import { BranchContext } from "../../src/contexts/useBranch";
import { DataProvider } from "../../src/contexts/DataContext.context";
import { AttendanceCheckinPage } from "../../src/pages/Mobile/AttendanceCheckin/AttendanceCheckin";
import { EventPage } from "../../src/pages/DesktopPages/EventPage/Event";
import { EventMobile } from "../../src/pages/Mobile/EventMobile/EventMobile";
import { PwaUpdatePrompt } from "../../src/components/PwaUpdatePrompt/PwaUpdatePrompt";
import {
  SignaturePad,
  type CompletedSignature,
} from "../../src/features/parent-registration/SignaturePad";
import { useDraft } from "../../src/features/parent-registration/useDraft";
import { ProfilePage } from "../../src/pages/Mobile/ProfilePage/Profile";
import { PwaInstallContext } from "../../src/contexts/PwaInstallContext";
import { theme } from "../../src/theme/them";
import "../../src/index.css";

if (!import.meta.env.DEV) throw Error("Local UX harness only");
const params = new URLSearchParams(location.search),
  screen = params.get("screen") ?? "attendance";
const transport = {
  save: async (body: { data: { note: string }; revision: number }) => {
    const response = await fetch("/ux-draft", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) throw Error("השמירה נכשלה");
    return { data: body.data, form: { revision: body.revision + 1 } };
  },
};
function Draft() {
  const draft = useDraft(
    transport,
    { data: { note: "" }, form: { revision: 0, currentStep: 1 } },
    {},
    false,
    { setField: (data, _path, value) => ({ ...data, note: String(value) }) },
  );
  const [signature, setSignature] = useState<CompletedSignature>();
  return (
    <>
      <TextField
        label="פרט לדוגמה"
        value={draft.data.note}
        onChange={(e) => draft.change("note", e.target.value)}
      />
      <p role="status">{draft.saveState}</p>
      <Button onClick={draft.retry}>שמירה מחדש</Button>
      <SignaturePad label="בדיקה" value={signature} onChange={setSignature} />
    </>
  );
}
const auth = {
  user: {
    userId: "ux-user",
    name: "משתמש בדיקה",
    roles: [
      {
        roleId: params.get("role") === "volunteer" ? 1 : 10000,
        branchId: "ux-branch",
        branchName: "סניף בדיקה",
      },
    ],
  },
  sessionId: 1,
  isAuthenticated: true,
  isSuperAdmin: false,
  loading: false,
  mustChangePassword: false,
  login: async () => {},
  logout: () => {},
  changePassword: async () => {},
} as unknown as IAuthContext;
const query = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});
const cache = createCache({
  key: "uxrtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
createRoot(document.getElementById("root")!).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={query}>
        <AuthContext.Provider value={auth}>
          <BranchContext.Provider
            value={{
              activeBranch: params.has("noBranch") ? null : "ux-branch",
              availableBranches: [{ id: "ux-branch", name: "סניף בדיקה" }],
              switchBranch: () => {},
              isSuperAdmin: false,
            }}
          >
            <PwaInstallContext.Provider
              value={{
                canInstall: false,
                installed: false,
                iosDevice: false,
                mobileDevice: false,
                requestInstall: async () => "unavailable",
              }}
            >
              <MemoryRouter initialEntries={["/events/ux-event/attendance"]}>
                <main dir="rtl">
                  <p>בדיקת UX מקומית — נתונים בדויים בלבד</p>
                  {screen === "draft" ? (
                    <Draft />
                  ) : screen === "profile" ? (
                    <ProfilePage />
                  ) : screen === "desktop" ? (
                    <DataProvider>
                      <EventPage />
                    </DataProvider>
                  ) : screen === "mobile" ? (
                    <EventMobile />
                  ) : (
                    <Routes>
                      <Route
                        path="/events/:eventId/attendance"
                        element={<AttendanceCheckinPage />}
                      />
                    </Routes>
                  )}
                </main>
                <PwaUpdatePrompt />
              </MemoryRouter>
            </PwaInstallContext.Provider>
          </BranchContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  </CacheProvider>,
);
