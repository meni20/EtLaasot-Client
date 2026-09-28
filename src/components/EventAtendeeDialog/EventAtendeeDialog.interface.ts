import type { IAddAttendeeDialogProps } from "../AddAttendeeDialog/AddAttendeeDialog.interface";

export interface IEventAtendeeDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  audience?: IAddAttendeeDialogProps["audience"];
  branchId?: string;
  users?: IAddAttendeeDialogProps["users"];
  eventName?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  address?: string;
}
