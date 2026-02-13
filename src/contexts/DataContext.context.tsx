import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type { IEvent } from "../interfaces/event.interface";
import eventService from "../services/event.service";

interface IDataContext {
  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  isLoading: boolean;
  isError: boolean;
}

const DataContext = createContext<IDataContext | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<IEvent[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
  });

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);

  return (
    <DataContext.Provider value={{ events, setEvents, isLoading, isError }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within an EventsProvider");
  }
  return context;
};
