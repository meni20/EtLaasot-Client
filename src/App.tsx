import React from "react";
import AppRouter from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { heIL } from "@mui/x-date-pickers/locales";
import { he } from "date-fns/locale";
import { AuthProvider } from "./contexts/AuthContext.context";
import { BranchProvider } from "./contexts/BranchContext.context";
import { DataProvider } from "./contexts/DataContext.context";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/them";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

const queryClient = new QueryClient();
const rtlCache = createCache({
  key: "etlaasot-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={he}
      localeText={
        heIL.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <DataProvider>
              <CacheProvider value={rtlCache}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AppRouter />
                </ThemeProvider>
              </CacheProvider>
            </DataProvider>
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;
