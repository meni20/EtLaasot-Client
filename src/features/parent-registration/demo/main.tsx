import { useState } from "react";
import "./preview.css";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {
  Alert,
  Box,
  Button,
  CssBaseline,
  MenuItem,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../../../theme/them";
import { RegistrationMobile } from "../RegistrationMobile";
import { RegistrationAdmin } from "../RegistrationAdmin";
import {
  createDemoAdapter,
  demoBranches,
  demoProfile,
  demoScenarios,
  demoTrainees,
  type DemoScenario,
} from "./adapter";

if (!import.meta.env.DEV)
  throw new Error("Local preview is not available in production");
const cache = createCache({
  key: "registration-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
export function PreviewSession({
  scenario,
  admin,
  superAdmin,
}: {
  scenario: DemoScenario;
  admin: boolean;
  superAdmin: boolean;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
          mutations: { retry: false, gcTime: 0 },
        },
      }),
  );
  const [adapter] = useState(() =>
    createDemoAdapter(
      scenario,
      superAdmin ? demoBranches.map((b) => b.id) : [demoBranches[0].id],
    ),
  );
  return (
    <QueryClientProvider client={client}>
      {admin ? (
        <RegistrationAdmin
          api={adapter.api}
          branches={superAdmin ? demoBranches : demoBranches.slice(0, 1)}
          trainees={demoTrainees}
        />
      ) : (
        <RegistrationMobile
          api={adapter.api}
          profile={demoProfile}
          onDemoSubmit={adapter.simulateSubmission}
        />
      )}
    </QueryClientProvider>
  );
}
export function Preview() {
  const [scenario, setScenario] = useState<DemoScenario>("required");
  const [actor, setActor] = useState("trainee");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box dir="rtl" sx={{ minHeight: "100dvh", bgcolor: "#F7F1F5" }}>
        <Box sx={{ bgcolor: "#303050", color: "white", p: 3 }}>
          <Typography align="center" fontWeight={700}>
            סביבת הדגמה מקומית · נתונים בדויים בלבד · ללא חיבור למערכת
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={3}
          sx={{ p: 4, maxWidth: 1250, mx: "auto" }}
        >
          <TextField
            select
            label="תפקיד בהדגמה בלבד"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            fullWidth
          >
            <MenuItem value="trainee">חניך/ה — אזור אישי</MenuItem>
            <MenuItem value="branch">מנהל/ת סניף</MenuItem>
            <MenuItem value="super">מנהל/ת על</MenuItem>
          </TextField>
          <TextField
            select
            label="תרחיש מקומי"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as DemoScenario)}
            fullWidth
          >
            {Object.entries(demoScenarios).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={() => window.location.reload()}>איפוס ההדגמה</Button>
        </Stack>
        <Box sx={{ maxWidth: 1250, mx: "auto", px: 4 }}>
          <Alert severity="warning">
            כל המידע זמני ונמחק ברענון. אין העלאה, הפקת PDF, אימות משתמש אמיתי
            או בדיקת הרשאות שרת בהדגמה. מעבר למצב ״ממתין לאישור״ מדמה ממשק בלבד.
          </Alert>
        </Box>
        <PreviewSession
          key={`${scenario}-${actor}`}
          scenario={scenario}
          admin={actor !== "trainee"}
          superAdmin={actor === "super"}
        />
      </Box>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <CacheProvider value={cache}>
    <Preview />
  </CacheProvider>,
);
