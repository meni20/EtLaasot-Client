import React from "react";
import AppRouter from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthProvider } from "./contexts/AuthContext.context";
import { BranchProvider } from "./contexts/BranchContext.context";
import { DataProvider } from "./contexts/DataContext.context";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/them";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <DataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppRouter />
              </ThemeProvider>
            </DataProvider>
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;
