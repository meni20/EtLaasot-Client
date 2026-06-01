import React, { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import eventService from "../services/event.service";
import { useBranch } from "./useBranch";
import { useAuth } from "./useAuth";
import { DataContext } from "./useDataContext";

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { activeBranch } = useBranch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", activeBranch],
    queryFn: () => eventService.getAllEvents(activeBranch ?? undefined),
    enabled: isAuthenticated && !!activeBranch,
  });

  const events = data ?? [];

  return (
    <DataContext.Provider value={{ events, isLoading, isError }}>
      {children}
    </DataContext.Provider>
  );
};
