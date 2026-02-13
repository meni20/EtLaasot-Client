export interface IAddAttendeeDialogProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  onDelete: (id: string) => void;
}