import type { EventAudience } from "../../constants/event-audience.constants";
import type { IUserRole } from "../../interfaces/user.interface";
import type { IEvent } from "../../interfaces/event.interface";

export interface IAddAttendeeDialogProps {
  eventId: string;
  audience?: EventAudience;
  branchId?: string;
  open: boolean;
  onClose: () => void;
  users?: Array<{
    id: string;
    name: string;
    email: string | null;
    role?: number;
    userRoles?: IUserRole[];
    events?: IEvent[];
  }>;
}
