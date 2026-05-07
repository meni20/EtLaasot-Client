import type { IEvent } from "../../interfaces/event.interface";

export interface ICreateEventProps {
    open: boolean;
    onClose: () => void;
    event?: IEvent | null;
}