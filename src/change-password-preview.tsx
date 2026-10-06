import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthContext, type IAuthContext } from "./contexts/useAuth";
import { ChangePasswordDialog } from "./components/AccountSettings/ChangePasswordDialog";
import { theme } from "./theme/them";
import "./index.css";

const cache = createCache({ key: "preview-rtl", stylisPlugins: [prefixer, rtlPlugin] });
const auth: IAuthContext = {
  sessionId: 1, user: null, token: null, isAuthenticated: true,
  mustChangePassword: false, loading: false, isSuperAdmin: true,
  login: async () => {}, changePassword: async () => {}, logout: () => {},
};

createRoot(document.getElementById("root")!).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={auth}>
        <ChangePasswordDialog open onClose={() => {}} />
      </AuthContext.Provider>
    </ThemeProvider>
  </CacheProvider>,
);
