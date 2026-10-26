import React, { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import eventService from "../services/event.service";
import { useBranch } from "./useBranch";
import { useAuth } from "./useAuth";
import { DataContext } from "./useDataContext";

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user, sessionId } = useAuth();
  const { activeBranch } = useBranch();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["events", activeBranch, user?.userId, sessionId],
    queryFn: ({ signal }) =>
      eventService.getAllEvents(activeBranch ?? undefined, signal),
    enabled: isAuthenticated && !!activeBranch,
  });

  const events = isError ? [] : (data ?? []);

  return (
    <DataContext.Provider value={{ events, isLoading: isPending, isError, error, refetch }}>
      {children}
    </DataContext.Provider>
  );
};
