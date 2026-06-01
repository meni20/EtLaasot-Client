import type { IAddAttendeeDialogProps } from "../AddAttendeeDialog/AddAttendeeDialog.interface";

export interface IEventAtendeeDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  users?: IAddAttendeeDialogProps["users"];
}
