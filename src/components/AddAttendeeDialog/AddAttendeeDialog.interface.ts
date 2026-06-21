import type { IEvent } from "../../interfaces/event.interface";

export interface IAddAttendeeDialogProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  users?: Array<{
    id: string;
    name: string;
    email: string | null;
    role?: number;
    events?: IEvent[];
  }>;
}
