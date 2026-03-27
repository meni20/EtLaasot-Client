import React from "react";
import AppRouter from "./router/Router";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataProvider } from "./contexts/DataContext.context";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/them";
import { isAuthenticated } from "./constants/auth.const";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      {authenticated ? (
        <DataProvider>
          <AppRouter />
        </DataProvider>
      ) : (
        <AppRouter />
      )}
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;
