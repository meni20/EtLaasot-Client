import React from "react";
import AppRouter from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataProvider } from "./contexts/DataContext.context";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/them";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <DataProvider>
          <ThemeProvider theme={theme}>
            <AppRouter />
          </ThemeProvider>
        </DataProvider>
      </BrowserRouter>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;
