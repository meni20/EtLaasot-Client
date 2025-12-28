import React from "react";
import AppRouter from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
