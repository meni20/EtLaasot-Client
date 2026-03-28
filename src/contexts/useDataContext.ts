import { createContext, useContext } from "react";
import type { IEvent } from "../interfaces/event.interface";

export interface IDataContext {
    events: IEvent[];
    isLoading: boolean;
    isError: boolean;
}

export const DataContext = createContext<IDataContext | null>(null);

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within an EventsProvider");
    }
    return context;
};
